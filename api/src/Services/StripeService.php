<?php
namespace App\Services;

use App\Config\Config;
use App\Repositories\SubscriptionRepository;
use App\Services\Message\Handlers\CancellationMessageHandler;
use App\Services\Message\Handlers\ReactivationMessageHandler;
use App\Services\Stripe\DTO\CheckoutSessionDTO;
use App\Services\Stripe\StripeAPIService;
use App\Services\Stripe\StripeRepository;
use App\Services\Stripe\WebhookHandler;

class StripeService {

	public function __construct(
		private Config $config,
		private StripeAPIService $stripeAPI,
		private SubscriptionRepository $repository,
		private WebhookHandler $webhookHandler,
		private CancellationMessageHandler $cancellationMessageHandler,
		private ReactivationMessageHandler $reactivationMessageHandler,
	) {
	}

	public function getInvoice( $invoiceId ) {
		return $this->stripeAPI->getInvoiceUrl( $invoiceId );
	}

	public function deleteCustomer( string $customerId ) {
		$this->stripeAPI->cancelAllSubscriptions( $customerId );
		$this->stripeAPI->deleteCustomer( $customerId );
	}

	public function createCheckoutSession( CheckoutSessionDTO $sessionDTO ) {
		return $this->stripeAPI->createSession( $sessionDTO );
	}

	public function createCustomerPortal( string $customerId, string $userLocale ) {
			return $this->stripeAPI->createCustomerPortal( $customerId, $userLocale );
	}

	public function cancelAtPeriodEnd(
		string $subscriptionId,
		string $userId,
		string $firstName
	) {
		$this->stripeAPI->updateSubscription(
			$subscriptionId,
			array( 'cancel_at_period_end' => true )
		);

		$this->repository->cancelSubscription( $subscriptionId );

		$this->cancellationMessageHandler->handle(
			userId: $userId,
			firstName:$firstName
		);
	}

	public function handleReactivation(
		string $subscriptionId,
		string $userId,
		string $firstName
	) {
		$this->stripeAPI->updateSubscription(
			$subscriptionId,
			array( 'cancel_at_period_end' => false )
		);

		$this->repository->reactivateSubscription( $subscriptionId );

		$this->reactivationMessageHandler->handle(
			userId: $userId,
			firstName: $firstName
		);
	}
}
