<?php
namespace App\Services;

use App\Repositories\SubscriptionRepository;
use App\Services\Message\Handlers\CancellationMessageHandler;
use App\Services\Message\Handlers\ReactivationMessageHandler;
use App\Services\Stripe\DTO\CheckoutSessionDTO;
use App\Services\Stripe\StripeAPIService;
use App\Services\Stripe\StripeRepository;
use InvalidArgumentException;
use Stripe\BillingPortal\Session as BillingPortalSession;
use Stripe\Checkout\Session;
use Stripe\Exception\ApiErrorException;

class StripeService {

	public function __construct(
		private StripeAPIService $stripeAPI,
		private SubscriptionRepository $repository,
		private CancellationMessageHandler $cancellationMessageHandler,
		private ReactivationMessageHandler $reactivationMessageHandler,
	) {
	}

	/**
	 * Gets the invoice url for given invoice id.
	 *
	 * @param string $invoiceId
	 *
	 * @return string $invoiceUrl
	 * @throws ApiErrorException Stripe exception when failed.
	 */
	public function getInvoiceUrl( string $invoiceId ): string {
		$invoiceUrl = $this->stripeAPI->getInvoiceUrl( $invoiceId );
		return $invoiceUrl;
	}

	/**
	 * Cancels all subscriptions and deletes the customer.
	 *
	 * @param string $customerId
	 *
	 * @return void
	 * @throws ApiErrorException Stripe exception when failed.
	 */
	public function deleteCustomer( string $customerId ): void {
		$this->stripeAPI->cancelAllSubscriptions( $customerId );
		$this->stripeAPI->deleteCustomer( $customerId );
	}

	/**
	 * Creates a checkout session.
	 *
	 * @param CheckoutSessionDTO $sessionDTO
	 *
	 * @return Session
	 * @throws ApiErrorException Stripe exception when failed.
	 */
	public function createCheckoutSession( CheckoutSessionDTO $sessionDTO ): Session {
		return $this->stripeAPI->createSession( $sessionDTO );
	}

	/**
	 * Creates a customer portal session.
	 *
	 * @param string $customerId
	 * @param string $userLocale
	 *
	 * @return BillingPortalSession
	 * @throws ApiErrorException Stripe exception when failed.
	 */
	public function createCustomerPortal(
		string $customerId,
		string $userLocale
	): BillingPortalSession {
			return $this->stripeAPI->createCustomerPortal( $customerId, $userLocale );
	}

	/**
	 * Cancels the subscription at the end of the period, updates the database
	 * and sends the user a confirmation message.
	 *
	 * @param string $subscriptionId
	 * @param string $userId
	 * @param string $firstName
	 *
	 * @return void
	 * @throws ApiErrorException When stripe request fails.
	 * @throws InvalidArgumentException Invalid arguments.
	 */
	public function cancelAtPeriodEnd(
		string $subscriptionId,
		string $userId,
		string $firstName
	): void {
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
