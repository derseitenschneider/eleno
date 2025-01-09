<?php

namespace App\Services\Stripe;

use App\Config\Config;
use Stripe\Collection;
use Stripe\PaymentMethod;
use Stripe\StripeClient;
use Stripe\Subscription;

class StripeAPIService {
	private StripeClient $client;

	public function __construct() {
		$this->client = new StripeClient( Config::getInstance()->stripeSecretKey );
	}

	public function updateSubscription( string $subscriptionId, array $params ): Subscription {
		return $this->client->subscriptions->update( $subscriptionId, $params );
	}

	public function subscription( string $subscriptionId ): Subscription {
		return $this->client->subscriptions->retrieve( $subscriptionId );
	}

	public function paymentMethods( string $customerId ): Collection {
		return $this->client->customers->allPaymentMethods( $customerId );
	}

	public function customerPortal(
		string $customerId,
		string $locale
		// string $returnUrl = Config::getInstance()->appBaseUrl . '/settings/subscription'
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
