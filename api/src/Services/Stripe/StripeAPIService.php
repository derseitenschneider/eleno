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
