<?php

namespace App\Services\Stripe;

use App\Config\Config;
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

	public function getSubscription( string $subscriptionId ): Subscription {
		return $this->client->subscriptions->retrieve( $subscriptionId );
	}

	public static function initialize(): void {
		\Stripe\Stripe::setApiKey( Config::getInstance()->stripeSecretKey );
	}
}
