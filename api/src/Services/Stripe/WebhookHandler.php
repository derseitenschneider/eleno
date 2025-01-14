<?php

namespace App\Services\Stripe;

use App\Services\Stripe\DTO\StripeCheckoutCompletedDTO;
use App\Services\Stripe\DTO\StripeSubscriptionUpdatedDTO;
use Stripe\Event;
use Stripe\Checkout\Session;
use Stripe\Subscription;

class WebhookHandler {
	public function __construct(
		private StripeRepository $repository
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
	}

	private function handleSubscriptionUpdated( Subscription $subscription ): void {
		logDebug( $subscription );
		$subscriptionDTO = StripeSubscriptionUpdatedDTO::create( $subscription );
		$this->repository->saveSubpscriptionUpdated( $subscriptionDTO );
	}
}
