<?php

namespace App\Services;

use App\Config\Config;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use GuzzleHttp\Client;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Stripe\Checkout\Session;

class SupabaseService {
	private $client;
	private Config $config;

	public function __construct( Config $config ) {
		$this->config = $config;
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
		$this->get(
			endpoint: 'lessons',
			query:array(
				'select'      => '*,students(id,firstName),groups(id,name)',
				'homeworkKey' => 'eq.' . $homeworkKey,
			),
		);
	}


	public function cancelSubscription( string $subscription_id ) {
		$this->updateSubscription(
			data: array( 'subscription_status' => 'canceled' ),
			query: array( 'stripe_subscription_id' => 'eq.' . $subscription_id ),
		);
	}

	public function reactivateSubscription( string $subscription_id ) {
		$this->updateSubscription(
			data: array( 'subscription_status' => 'active' ),
			query: array( 'stripe_subscription_id' => 'eq.' . $subscription_id ),
		);
	}

	public function updateSubscription( array $data, array $query ) {
		$this->patch(
			endpoint: 'stripe_subscriptions',
			data: $data,
			query:$query
		);
	}

	public function get(
		string $endpoint,
		array $query
	) {
		try {
			$response = $this->client->get(
				"rest/v1/{$endpoint}",
				array( 'query' => $query )
			);

			return array(
				'success' => true,
				'data'    => json_decode( $response->getBody(), true ),
			);
		} catch ( \Exception $e ) {
			return array( 'error' => $e->getMessage() );
		}
	}

	public function patch(
		string $endpoint,
		array $data,
		array $query,
	): array {
		try {
			$response = $this->client->request(
				'PATCH',
				"{$this->config->supabaseUrl}/rest/v1/{$endpoint}",
				array(
					'query' => $query,
					'json'  => $data,
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
