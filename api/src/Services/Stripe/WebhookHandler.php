<?php

namespace App\Services\Stripe;

use App\Services\Stripe\DTO\StripeSubscriptionDTO;
use Stripe\Event;
use Stripe\Checkout\Session;

class WebhookHandler {
	public function __construct(
		private StripeRepository $repository
	) {}

	public function handleEvent( Event $event ): void {
		match ( $event->type ) {
			'checkout.session.completed' => $this->handleCheckoutCompleted( $event->data->object ),
			default => null, // Ignore unhandled event types
		};
	}

	private function handleCheckoutCompleted( Session $session ): void {
		$subscriptionDTO = StripeSubscriptionDTO::fromCheckoutSession( $session );
		$this->repository->saveCheckoutSession( $subscriptionDTO );
	}
}
