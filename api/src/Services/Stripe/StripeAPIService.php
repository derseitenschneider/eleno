<?php

namespace App\Services\Stripe;

use App\Config\Config;
use Stripe\Checkout\Session;
use Stripe\Collection;
use Stripe\PaymentMethod;
use Stripe\StripeClient;
use Stripe\Subscription;

/** @package App\Services\Stripe */
class StripeAPIService {
	private StripeClient $client;

	public function __construct() {
		$this->client = new StripeClient( Config::getInstance()->stripeSecretKey );
	}

	public function createSession(): Session {
		$baseUrl = Config::getInstance()->appBaseUrl;

		$session = $this->client->checkout->sessions->create(
			array(
				'billing_address_collection' => 'required',
				'cancel_url'                 => $baseUrl . '/settings/subscription',
				'consent_collection'         => array(
					'terms_of_service' => 'required',
				),
				'client_reference_id'        => '13c1e634-0906-4c30-8622-c786957553ae',
				'customer'                   => 'cus_RZdQnaJ0cjl2gg',
				'line_items'                 => array(
					array(
						'price'    => 'price_1QNJcRGqCC0x0Xxsq5LagLin',
						'quantity' => 1,
					),
				),
				'locale'                     => 'de',
				'mode'                       => 'subscription',
				'success_url'                => $baseUrl . '/settings/subscription?success=true',
			)
		);

		return $session;
	}

	public function updateSubscription( string $subscriptionId, array $params ): Subscription {
		return $this->client->subscriptions->update( $subscriptionId, $params );
	}

	public function updateSubscriptionSession(
		string $customerId,
		string $subscriptionId,
		string $locale
	) {
		$returnUrl = Config::getInstance()->appBaseUrl . '/settings/subscription';
		return $this->client->billingPortal->sessions->create(
			array(
				'customer'   => $customerId,
				'locale'     => $locale,
				'return_url' => $returnUrl,
				'flow_data'  => array(
					'type'                => 'subscription_update',
					'subscription_update' => array(
						'subscription' => $subscriptionId,
					),
				),
			)
		);
	}

	public function subscription( string $subscriptionId ): Subscription {
		return $this->client->subscriptions->retrieve( $subscriptionId );
	}

	public function customerPortal(
		string $customerId,
		string $locale
	) {
		$returnUrl = Config::getInstance()->appBaseUrl . '/settings/subscription';
		return $this->client->billingPortal->sessions->create(
			array(
				'customer'   => $customerId,
				'locale'     => $locale,
				'return_url' => $returnUrl,
			)
		);
	}
}
