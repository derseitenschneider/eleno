<?php

namespace App\Services\Stripe;

use App\Repositories\SubscriptionRepository;
use App\Services\Message\Handlers\SubscriptionMessageHandler;
use App\Services\Message\Handlers\LifetimeMessageHandler;
use App\Services\Message\Handlers\LifetimeUpgradeHandler;
use App\Services\Message\Handlers\PaymentFailedMessageHandler;
use App\Services\Message\MessageService;
use App\Services\Message\Strategies\DatabaseMessageStrategy;
use App\Services\Stripe\DTO\StripeCheckoutCompletedDTO;
use App\Services\Stripe\DTO\StripeSubscriptionUpdatedDTO;
use App\Services\StripeService;
use Monolog\Logger;
use Stripe\Event;
use Stripe\Checkout\Session;
use Stripe\Invoice;
use Stripe\Subscription;

class WebhookHandler {
	public function __construct(
		private SubscriptionRepository $repository,
		private StripeAPIService $stripeAPI,
		private SubscriptionMessageHandler $subscriptionMessageHandler,
		private LifetimeMessageHandler $lifetimeMessageHandler,
		private PaymentFailedMessageHandler $paymentFailedMessageHandler,
		private Logger $logger
	) {}

	/**
	 * @param Event $event
	 * @return void
	 */
	public function handleEvent( Event $event ): void {
		$eventObject = $event->data->object;

		$this->logger->info(
			'Received Stripe webhook event',
			[
				'type' => $event->type,
				'data' => $event->data,
			]
		);

		try {
			match ( $event->type ) {
				'checkout.session.completed' => $this->handleCheckoutCompleted( $eventObject ),
				'customer.subscription.updated' => $this->handleSubscriptionUpdated( $eventObject ),
				'invoice.payment_failed' => $this->handlePaymentFailed( $eventObject ),
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

	private function handlePaymentFailed( Invoice $invoice ) {
		$stripeCustomer        = $invoice->customer;
		$firstName             = explode( ' ', $invoice->customer_name )[0] ?? '';
		$subscription          = $this->repository->getSubscription( $stripeCustomer );
		$userId                = $subscription['user_id'];
		$failedPaymentAttempts = $subscription['failed_payment_attempts'] ?? 0;
		$subscriptionId        = $subscription['stripe_subscription_id'];

		$messageLevels = array(
			0 => 1,
			1 => 2,
			2 => 3,
			3 => 3,
		);

		$level = $messageLevels[ $failedPaymentAttempts ] ?? null;

		if ( $level !== null ) {
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

			if ( $level === 3 ) {
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

	private function handleCheckoutCompleted( Session $session ): void {
		$checkoutDTO = StripeCheckoutCompletedDTO::create( $session );

		$this->repository->saveCheckoutSession( $checkoutDTO );
		$this->repository->resetFailedPaymentAttempts( $checkoutDTO->customerId );

		if ( $checkoutDTO->isLifetime ) {
			$this->logger->info(
				'Lifetime purchase completed',
				[ 'checkout_dto' => $checkoutDTO ]
			);
			$this->stripeAPI->cancelAllSubscriptions( $checkoutDTO->customerId );
			$this->lifetimeMessageHandler->handle( $checkoutDTO );

		} else {
			$this->logger->info(
				'Subscription purchase completed',
				[ 'checkout_dto' => $checkoutDTO ]
			);
			$this->subscriptionMessageHandler->handle( $checkoutDTO );
		}
	}

	private function handleSubscriptionUpdated( Subscription $subscription ): void {
		$subscriptionDTO = StripeSubscriptionUpdatedDTO::create( $subscription );

		$this->logger->info(
			'Subscription updated',
			[ 'subscription_dto' => $subscriptionDTO ]
		);

		$this->repository->saveSubpscriptionUpdated( $subscriptionDTO );
	}
}
