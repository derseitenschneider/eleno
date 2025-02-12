<?php

namespace App\Services\Stripe;

use App\Config\Config;
use App\Services\Stripe\DTO\StripeCheckoutCompletedDTO;
use Stripe\Checkout\Session;
use Stripe\Collection;
use Stripe\PaymentMethod;
use Stripe\StripeClient;
use Stripe\Subscription;


class StripeAPIService {
	private StripeClient $client;

	public function __construct( private Config $config ) {
		$this->client = new StripeClient( $this->config->stripeSecretKey );
	}

	public function getInvoiceLink( string $invoiceId ): string {
		return $this->client->invoices->retrieve( $invoiceId )->hosted_invoice_url ?? '';
	}

	public function subscriptionSession(
		string $userId,
		string $stripeCustomerId,
		string $priceId,
		string $locale,
		string $currency
	): Session {
		$baseUrl = $this->config->appBaseUrl;

		$session = $this->client->checkout->sessions->create(
			array(
				'billing_address_collection' => 'required',
				'cancel_url'                 => $baseUrl . '/settings/subscription',
				'consent_collection'         => array(
					'terms_of_service' => 'required',
				),
				'client_reference_id'        => $userId,
				'customer'                   => $stripeCustomerId,
				'currency'                   => $currency,
				'line_items'                 => array(
					array(
						'price'    => $priceId,
						'quantity' => 1,
					),
				),
				'locale'                     => $locale,
				'mode'                       => 'subscription',
				'success_url'                => $baseUrl . '/settings/subscription?subscription=success',
			)
		);

		return $session;
	}

	public function deleteCustomer( string $customerId ) {
		$this->client->customers->delete( $customerId );
	}

	public function cancelSubscription( string $subscriptionId ) {
		$this->client->subscriptions->cancel( $subscriptionId );
	}

	public function cancelAllSubscriptions( string $customerId ) {
		$subscriptions = $this->client->subscriptions->all(
			array(
				'customer' => $customerId,
				'status'   => 'active',
			)
		);

		foreach ( $subscriptions->data as $subscription ) {
			$this->client->subscriptions->cancel( $subscription->id, );
		}
	}

	// TODO: Refactor all sessions into StripeSessionService class
	public function lifetimeSession(
		string $userId,
		string $stripeCustomerId,
		string $priceId,
		string $locale,
		string $currency
	): Session {
		$baseUrl = $this->config->appBaseUrl;

		$session = $this->client->checkout->sessions->create(
			array(
				'billing_address_collection' => 'required',
				'cancel_url'                 => $baseUrl . '/settings/subscription',
				'consent_collection'         => array(
					'terms_of_service' => 'required',
				),
				'client_reference_id'        => $userId,
				'customer'                   => $stripeCustomerId,
				'currency'                   => $currency,
				'invoice_creation'           => array(
					'enabled' => true,
				),
				'line_items'                 => array(
					array(
						'price'    => $priceId,
						'quantity' => 1,
					),
				),
				'locale'                     => $locale,
				'mode'                       => 'payment',
				'success_url'                => $baseUrl . '/settings/subscription?subscription=success',
			)
		);

		return $session;
	}

	public function updateSubscription( string $subscriptionId, array $params ): Subscription {
		return $this->client->subscriptions->update( $subscriptionId, $params );
	}

	public function subscription( string $subscriptionId ): Subscription {
		return $this->client->subscriptions->retrieve( $subscriptionId );
	}

	public function customerPortal(
		string $customerId,
		string $locale
	) {
		$returnUrl = $this->config->appBaseUrl . '/settings/subscription';
		return $this->client->billingPortal->sessions->create(
			array(
				'customer'   => $customerId,
				'locale'     => $locale,
				'return_url' => $returnUrl,
			)
		);
	}
}
