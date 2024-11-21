<?php

namespace App\Services;

use Config\Config;
use GuzzleHttp\Client;
use Stripe\Checkout\Session;

class SupabaseService {
	private $client;
	private Config $config;

	public function __construct() {
		$this->config = Config::getInstance();
		$this->client = new Client(
			array(
				'base_uri' => $this->config->supabaseUrl,
				'headers'  => array(
					'apikey'        => $this->config->supabaseAnonKey,
					'Authorization' => 'Bearer ' . $this->config->supabaseServiceRoleKey,
				),
			)
		);
	}

	public function getLesson( string $homeworkKey ) {
		$response = $this->client->get(
			'rest/v1/lessons',
			array(
				'query' => array(
					'select'      => '*,students(id,firstName),groups(id,name)',
					'homeworkKey' => 'eq.' . $homeworkKey,
				),
			)
		);

		$data = json_decode( $response->getBody(), true );
		return $data[0] ?? null;
	}


	public function handleCheckoutCompleted( Session $session ): array {
		$userId     = $session->client_reference_id;
		$isLifetime = empty( $session->subscription );

		try {
			return $this->updateSubscription(
				$userId,
				array(
					'user_id'                => $userId,
					'stripe_customer_id'     => $session->customer,
					'stripe_subscription_id' => $session->subscription,
					'stripe_invoice_id'      => $session->invoice,
					'payment_type'           => $isLifetime ? 'lifetime' : 'subscription',
					'subscription_status'    => $isLifetime ? 'lifetime' : 'active',
					'payment_status'         => $session->payment_status,
					'amount'                 => $session->amount_total,
					'currency'               => $session->currency,
				)
			);

		} catch ( \Exception $e ) {
			return array( 'error' => $e->getMessage() );
		}
	}


	public function updateSubscription( string $user_id, array $data ): array {
		try {
			$response = $this->client->request(
				'POST', // PATCH in future
				"{$this->config->supabaseUrl}/rest/v1/stripe_subscriptions",
				array(
					// 'headers' => $this->headers,
					// 'query' => [
					// 'user_id' => 'eq.' . $user_id
					// ],
					'json' => $data,
				)
			);

			return array(
				'success' => true,
				'data'    => json_decode( $response->getBody(), true ),
			);

		} catch ( \Exception $e ) {
			return array( 'error' => $e->getMessage() );
		}
	}
}
