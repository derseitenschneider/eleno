<?php

namespace App\Services\Stripe;

use App\Services\Message\Handlers\LifetimeMessageHandler;
use App\Services\Message\Handlers\LifetimeUpgradeHandler;
use App\Services\Message\Handlers\PaymentFailedMessageHandler;
use App\Services\Message\MessageService;
use App\Services\Message\Strategies\DatabaseMessageStrategy;
use App\Services\Stripe\DTO\StripeCheckoutCompletedDTO;
use App\Services\Stripe\DTO\StripeSubscriptionUpdatedDTO;
use App\Services\StripeService;
use Stripe\Event;
use Stripe\Checkout\Session;
use Stripe\Invoice;
use Stripe\Subscription;

class WebhookHandler {
	public function __construct(
		private StripeRepository $repository,
		private StripeAPIService $stripeAPI,
		private PaymentFailedMessageHandler $paymentFailedMessageHandler,
		private LifetimeMessageHandler $lifetimeMessageHandler,
	) {}

	public function handleEvent( Event $event ): void {
		$eventObject = $event->data->object;
		match ( $event->type ) {
			'checkout.session.completed' => $this->handleCheckoutCompleted( $eventObject ),
			'customer.subscription.updated' => $this->handleSubscriptionUpdated( $eventObject ),
			'invoice.payment_failed' => $this->handlePaymentFailed( $eventObject ),
			default => null,
		};
	}

	private function handlePaymentFailed( Invoice $invoice ) {
		$stripeCustomer        = $invoice->customer;
		$firstName             = explode( ' ', $invoice->customer_name )[0];
		$subscription          = $this->repository->getSubscription( $stripeCustomer );
		$userId                = $subscription['user_id'];
		$failedPaymentAttempts = $subscription['failed_payment_attempts'];
		$subscriptionId        = $subscription['stripe_subscription_id'];

		switch ( $failedPaymentAttempts ) {
			case null:
				$this->repository->bumpFailedPaymentAttempts(
					customer: $stripeCustomer,
					prevValue: $failedPaymentAttempts
				);
				$this->paymentFailedMessageHandler->handle(
					level: 1,
					userId: $userId,
					firstName:$firstName
				);
				break;

			case 1:
				$this->repository->bumpFailedPaymentAttempts(
					customer: $stripeCustomer,
					prevValue: $failedPaymentAttempts
				);
				$this->paymentFailedMessageHandler->handle(
					level: 2,
					userId: $userId,
					firstName:$firstName
				);
				break;

			case 2:
				$this->repository->bumpFailedPaymentAttempts(
					customer: $stripeCustomer,
					prevValue: $failedPaymentAttempts
				);
				$this->paymentFailedMessageHandler->handle(
					level: 3,
					userId: $userId,
					firstName:$firstName
				);
				break;

			case 3:
				$this->repository->bumpFailedPaymentAttempts(
					customer: $stripeCustomer,
					prevValue: $failedPaymentAttempts
				);

				$this->repository->cancelSubscription( $subscriptionId );
				$this->stripeAPI->cancelSubscription( $subscriptionId );

				$this->paymentFailedMessageHandler->handle(
					level: 3,
					userId: $userId,
					firstName:$firstName
				);
				break;
		}
	}

	private function handleCheckoutCompleted( Session $session ): void {
		$checkoutDTO = StripeCheckoutCompletedDTO::create( $session );

		$this->repository->saveCheckoutSession( $checkoutDTO );
		$this->repository->resetFailedPaymentAttempts( $checkoutDTO->customerId );

		if ( $checkoutDTO->isLifetime ) {
			$this->stripeAPI->cancelAllSubscriptions( $checkoutDTO->customerId );
			$this->lifetimeMessageHandler->handle( $checkoutDTO );
		}
	}

	private function handleSubscriptionUpdated( Subscription $subscription ): void {
		$subscriptionDTO = StripeSubscriptionUpdatedDTO::create( $subscription );

		$this->repository->saveSubpscriptionUpdated( $subscriptionDTO );
	}
}
