<?php

namespace App\Services\Stripe;

use App\Services\Message\Handlers\LifetimeUpgradeHandler;
use App\Services\Message\MessageService;
use App\Services\Message\Strategies\DatabaseMessageStrategy;
use App\Services\Stripe\DTO\StripeCheckoutCompletedDTO;
use App\Services\Stripe\DTO\StripeSubscriptionUpdatedDTO;
use App\Services\StripeService;
use Stripe\Event;
use Stripe\Checkout\Session;
use Stripe\Subscription;

class WebhookHandler {
	public function __construct(
		private StripeRepository $repository,
		private StripeAPIService $stripeAPI,
		private LifetimeUpgradeHandler $lifetimeUpgradeHandler,
	) {}

	public function handleEvent( Event $event ): void {
		$eventObject = $event->data->object;
		match ( $event->type ) {
			'checkout.session.completed' => $this->handleCheckoutCompleted( $event->data->object ),
			'customer.subscription.updated' => $this->handleSubscriptionUpdated( $event->data->object ),
			default => null,
		};
	}

	private function handleCheckoutCompleted( Session $session ): void {
		$checkoutDTO = StripeCheckoutCompletedDTO::create( $session );

		$this->repository->saveCheckoutSession( $checkoutDTO );

		if ( $checkoutDTO->isLifetime ) {
			$this->stripeAPI->cancelAllSubscriptions( $checkoutDTO->customerId );
			$this->lifetimeUpgradeHandler->handle( $checkoutDTO );
		}
	}

	private function handleSubscriptionUpdated( Subscription $subscription ): void {
		$subscriptionDTO = StripeSubscriptionUpdatedDTO::create( $subscription );

		$this->repository->saveSubpscriptionUpdated( $subscriptionDTO );
	}
}
