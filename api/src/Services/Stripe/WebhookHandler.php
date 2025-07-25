<?php
/*
|--------------------------------------------------------------------------
| Webhookhhndler
|--------------------------------------------------------------------------
|
| This file contains the Webhookhander that is responsible for dispatching
| stripe webhook events based on their event type.
|
*/

namespace App\Services\Stripe;

use App\Repositories\SubscriptionRepository;
use App\Services\FluentCRMService;
use App\Services\Message\Handlers\DisputeMessageHandler;
use App\Services\Message\Handlers\SubscriptionMessageHandler;
use App\Services\Message\Handlers\LifetimeMessageHandler;
use App\Services\Message\Handlers\PaymentFailedMessageHandler;
use App\Services\Message\MessageService;
use App\Services\Message\Strategies\DatabaseMessageStrategy;
use App\Services\Stripe\DTO\StripeCheckoutCompletedDTO;
use App\Services\Stripe\DTO\StripeSubscriptionUpdatedDTO;
use App\Services\StripeService;
use Exception;
use InvalidArgumentException;
use Monolog\Logger;
use Stripe\Charge;
use Stripe\Event;
use Stripe\Checkout\Session;
use Stripe\Dispute;
use Stripe\Exception\ApiErrorException;
use Stripe\Invoice;
use Stripe\Subscription;

class WebhookHandler {
	/**
	 * Construct
	 *
	 * The class constructor.
	 *
	 * @param SubscriptionRepository      $repository
	 * @param StripeAPIService            $stripeAPI
	 * @param FluentCRMService            $fluentCRMService
	 * @param SubscriptionMessageHandler  $subscriptionMessageHandler
	 * @param LifetimeMessageHandler      $lifetimeMessageHandler
	 * @param PaymentFailedMessageHandler $paymentFailedMessageHandler
	 * @param DisputeMessageHandler       $disputeMessageHandler
	 * @param Logger                      $logger
	 */
	public function __construct(
		private SubscriptionRepository $repository,
		private StripeAPIService $stripeAPI,
		private FluentCRMService $fluentCRMService,
		private SubscriptionMessageHandler $subscriptionMessageHandler,
		private LifetimeMessageHandler $lifetimeMessageHandler,
		private PaymentFailedMessageHandler $paymentFailedMessageHandler,
		private DisputeMessageHandler $disputeMessageHandler,
		private Logger $logger
	) {}

	/**
	 * Handle event
	 *
	 * Defers the webhook event based on the event type.
	 *
	 * @param Event $event
	 */
	public function handleEvent( Event $event ) {
		try {
			$eventObject = $event->data->object; // @phpstan-ignore-line

			$this->logger->info(
				'Received Stripe webhook event',
				[
					'type' => $event->type,
					'data' => $event->data,
				]
			);

			match ( $event->type ) {
				'charge.dispute.created' => $this->handleDispute( $eventObject ),
				'checkout.session.completed' => $this->handleCheckoutCompleted( $eventObject ),
				'customer.subscription.updated' => $this->handleSubscriptionUpdated( $eventObject ),
				'invoice.payment_failed' => $this->handlePaymentFailed( $eventObject ),
				'invoice.payment_succeeded' => $this->handlePaymentSucceeded( $eventObject ),
				default => null,
			};
		} catch ( \Exception $e ) {
			$this->logger->error(
				'Error handling Stripe webhook event',
				[
					'type'      => $event->type,
					'data'      => $event->data,
					'exception' => $e,
				]
			);
		}
	}

	/**
	 *  Handle dispute
	 *
	 * @param Dispute $dispute
	 */
	private function handleDispute( Dispute $dispute ) {
		$this->disputeMessageHandler->handle( $dispute );
	}

	/**
	 * Handle pamynet succeeded
	 *
	 * @param Invoice $invoice
	 */
	private function handlePaymentSucceeded( Invoice $invoice ) {
		$customerId = $invoice->customer;
		$this->logger->info(
			'Payment succeeded, reset failed payment attempts',
			[ 'customerId' => $customerId ]
		);

		$this->repository->resetFailedPaymentAttempts( customer: $customerId );
	}

	/**
	 *  Handle payment failed
	 *
	 * @param Invoice $invoice
	 */
	private function handlePaymentFailed( Invoice $invoice ) {
		$stripeCustomer        = $invoice->customer;
		$firstName             = explode( ' ', $invoice->customer_name )[0];
		$subscription          = $this->repository->getSubscription(
			customerId: $stripeCustomer
		);
		$userId                = $subscription['user_id'];
		$failedPaymentAttempts = intval( $subscription['failed_payment_attempts'] );
		$subscriptionId        = $subscription['stripe_subscription_id'];

		$messageLevels = array(
			0 => 1,
			1 => 2,
			2 => 3,
		);

		$level = $messageLevels[ $failedPaymentAttempts ] ?? null;

		if ( null !== $level ) {
			$this->logger->warning(
				'Payment failed for invoice',
				array(
					'invoice_id'      => $invoice->id,
					'customer_id'     => $stripeCustomer,
					'failed_attempts' => $failedPaymentAttempts,
					'level'           => $level,
				)
			);

			$this->repository->bumpFailedPaymentAttempts(
				customer: $stripeCustomer,
				prevValue: $failedPaymentAttempts
			);

			$this->paymentFailedMessageHandler->handle(
				level: $level,
				userId: $userId,
				firstName: $firstName
			);

			if ( 3 === $level ) {
				$this->logger->warning(
					'Subscription cancelled due to multiple failed payments',
					array(
						'subscription_id' => $subscriptionId,
						'customer_id'     => $stripeCustomer,
					)
				);
				$this->repository->cancelSubscription( $subscriptionId );
				$this->stripeAPI->cancelSubscription( $subscriptionId );
			}
		}
	}

	/**
	 * Handle checkout completed
	 *
	 * @param Session $session
	 * @return void
	 */
	private function handleCheckoutCompleted( Session $session ) {
		$checkoutDTO = StripeCheckoutCompletedDTO::create( $session );
		$customerId  = $checkoutDTO->customerId;

		// Write new subscription to supabase.
		$this->repository->saveCheckoutSession( $checkoutDTO );

		// Update FluentCRM contact
		$payload = array(
			'__force_update' => 'yes',
			'email'          => $checkoutDTO->customerEmail,
			'detach_lists'   => array( 14 ), // Detach from 'new-users'.
			'lists'          => array( 4 ), // Add to 'active-customers'.
			'status'         => 'subscribed',
		);

		$fluentResponse = $this->fluentCRMService->createOrUpdateContact( $payload );
		$this->logger->info(
			'Fluent Database updated',
			[ 'data' => $fluentResponse ]
		);

		// Delete all previous subscriptions if lifetime.
		if ( $checkoutDTO->isLifetime ) {
			$this->logger->info(
				'Lifetime purchase completed',
				[ 'checkout_dto' => $checkoutDTO ]
			);
			$this->stripeAPI->cancelAllSubscriptions( customerId:$customerId );
			$this->lifetimeMessageHandler->handle( $checkoutDTO );

		} else {
			$this->logger->info(
				'Subscription purchase completed',
				[ 'checkout_dto' => $checkoutDTO ]
			);
			$this->subscriptionMessageHandler->handle( $checkoutDTO );
		}
	}

	/**
	 * Handle subscription updated
	 *
	 * @param Subscription $subscription
	 */
	private function handleSubscriptionUpdated( Subscription $subscription ) {
		$subscriptionDTO = StripeSubscriptionUpdatedDTO::create( $subscription );

		$this->logger->info(
			'Subscription updated',
			[ 'subscription_dto' => $subscriptionDTO ]
		);

		$this->repository->saveSubpscriptionUpdated( $subscriptionDTO );
	}
}
