<?php

namespace App\Services\Stripe;

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
		private DatabaseMessageStrategy $dbMessageStrategy
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

		$messageService = new MessageService( 'database', $this->dbMessageStrategy );
		$messageService->send( '13c1e634-0906-4c30-8622-c786957553ae', 'test', 'test' );

		$this->repository->saveCheckoutSession( $checkoutDTO );
		if ( $checkoutDTO->isLifetime ) {
			$this->stripeAPI->cancelAllSubscriptions( $checkoutDTO->customerId );
		}
	}

	private function handleSubscriptionUpdated( Subscription $subscription ): void {
		$subscriptionDTO = StripeSubscriptionUpdatedDTO::create( $subscription );

		$messageService = new MessageService( 'database', $this->dbMessageStrategy );
		$messageService->send( '13c1e634-0906-4c30-8622-c786957553ae', 'test', 'test' );

		$this->repository->saveSubpscriptionUpdated( $subscriptionDTO );
	}
}
