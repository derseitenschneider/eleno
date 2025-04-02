<?php
/*
|--------------------------------------------------------------------------
| StripeAPIService
|--------------------------------------------------------------------------
|
| This file contains the StripeAPIService class that is responsible for
| interacting with the stripe api.
|
*/

namespace App\Services\Stripe;

use App\Config\Config;
use App\Services\Stripe\DTO\CheckoutSessionDTO;
use App\Services\Stripe\DTO\StripeCheckoutCompletedDTO;
use App\Services\Stripe\DTO\StripeSessionDTO;
use Stripe\BillingPortal\Session as BillingPortalSession;
use Stripe\Checkout\Session;
use Stripe\Collection;
use Stripe\Customer;
use Stripe\Exception\ApiErrorException;
use Stripe\PaymentMethod;
use Stripe\StripeClient;
use Stripe\Subscription;

class StripeAPIService {
	/** @var StripeClient $client The stripe client */
	private StripeClient $client;

	/**
	 * Sets the stripe client.
	 *
	 * @param Config $config
	 */
	public function __construct( private Config $config ) {
		$this->client = new StripeClient( $this->config->stripeSecretKey );
	}

	/**
	 * Get invoice url
	 *
	 * Retrieves the url for the stripe invoice.
	 *
	 * @param string $invoiceId
	 */
	public function getInvoiceUrl( string $invoiceId ): string {
		return $this->client->invoices->retrieve( $invoiceId )->hosted_invoice_url ?? '';
	}

	/**
	 * Create session
	 *
	 * Creates a stripe checkout session.
	 *
	 * @param CheckoutSessionDTO $sessionDTO
	 */
	public function createSession( CheckoutSessionDTO $sessionDTO ): Session {

		$args = array(
			'billing_address_collection' => 'required',
			'cancel_url'                 => $sessionDTO->cancelUrl,
			'consent_collection'         => array(
				'terms_of_service' => 'required',
			),
			'client_reference_id'        => $sessionDTO->userId,
			'customer'                   => $sessionDTO->stripeCustomerId,
			'currency'                   => $sessionDTO->currency,
			'line_items'                 => array(
				array(
					'price'    => $sessionDTO->priceId,
					'quantity' => 1,
				),
			),
			'locale'                     => $sessionDTO->locale,
			'mode'                       => $sessionDTO->mode,
			'success_url'                => $sessionDTO->succesUrl,
		);

		if ( 'payment' === $sessionDTO->mode ) {
			$args['invoice_creation'] = array(
				'enabled' => true,
			);
		}

		$session = $this->client->checkout->sessions->create( $args );

		return $session;
	}

	/**
	 * Delete customer
	 *
	 * Deletes a stripe customer.
	 *
	 * @param string $customerId
	 */
	public function deleteCustomer( string $customerId ) {
		$this->client->customers->delete( $customerId );
	}

	/**
	 * Cancel subscription
	 *
	 * Cancels a stripe subscription.
	 *
	 * @param string $subscriptionId
	 */
	public function cancelSubscription( string $subscriptionId ) {
		$this->client->subscriptions->cancel( $subscriptionId );
	}

	/**
	 * Cancel all subscriptions
	 *
	 * Cancels all subscriptions of given customer.
	 *
	 * @param string $customerId
	 */
	public function cancelAllSubscriptions( string $customerId ) {
		$args          = array(
			'customer' => $customerId,
			'status'   => 'active',
		);
		$subscriptions = $this->client->subscriptions->all( $args );

		foreach ( $subscriptions->data as $subscription ) {
			$this->client->subscriptions->cancel( $subscription->id, );
		}
	}

	/**
	 * Update subscription
	 *
	 * @param string $subscriptionId
	 * @param array  $params
	 */
	public function updateSubscription(
		string $subscriptionId,
		array $params
	): Subscription {
		return $this->client->subscriptions->update( $subscriptionId, $params );
	}

	/**
	 * Get subscription
	 *
	 * Retrieves a given subscription by id.
	 *
	 * @param string $subscriptionId
	 */
	public function getSubscription( string $subscriptionId ): Subscription {
		return $this->client->subscriptions->retrieve( $subscriptionId );
	}

	/**
	 * Create customer portal.
	 *
	 * @param string $customerId
	 * @param string $locale
	 */
	public function createCustomerPortal(
		string $customerId,
		string $locale
	): BillingPortalSession {
		$returnUrl = $this->config->appBaseUrl . '/settings/subscription';
		$args      = array(
			'customer'   => $customerId,
			'locale'     => $locale,
			'return_url' => $returnUrl,
		);

		return $this->client->billingPortal->sessions->create( $args );
	}

	/**
	 * Create customer
	 *
	 * Creates a new stripe customer.
	 *
	 * @param string $userId
	 * @param string $email
	 */
	public function createCustomer( string $userId, string $email ): Customer {
		$params = array(
			'email'    => $email,
			'metadata' => array(
				'uid' => $userId,
			),
		);
		return $this->client->customers->create( $params );
	}
}
