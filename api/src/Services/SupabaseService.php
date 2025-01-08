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

	public function authorize( Request $request, Response $response ) {
		$headers     = $request->getHeaders();
		$auth_header = $headers['Authorization'][0] ?? '';
		if ( ! $auth_header || ! preg_match( '/^Bearer\s+(.*)$/', $auth_header, $matches ) ) {
			$response->getBody()->write(
				json_encode(
					array(
						'status'  => 'error',
						'message' => 'No token provided',
					)
				)
			);
			return $response->withStatus( 401 );
		}

		$jwt = $matches[1];

		try {
			$decoded = JWT::decode(
				$jwt,
				new Key( Config::getInstance()->supabaseJwtSecret, 'HS256' )
			);
		} catch ( \Firebase\JWT\ExpiredException $e ) {
			$response->getBody()->write(
				json_encode(
					array(
						'status'  => 'error',
						'message' => 'Token has expired',
					)
				)
			);
			return $response->withStatus( 401 );
		} catch ( \Exception $e ) {
			$response->getBody()->write(
				json_encode(
					array(
						'status'  => 'error',
						'message' => 'Invalid token',
					)
				)
			);
			return $response->withStatus( 401 );
		}

		return null;
	}

	public function cancelSubscription( string $subscription_id ) {
		try {
			$response = $this->client->request(
				'PATCH',
				"{$this->config->supabaseUrl}/rest/v1/stripe_subscriptions",
				array(
					'query' => array(
						'stripe_subscription_id' => 'eq.' . $subscription_id,
					),
					'json'  => array( 'subscription_status' => 'canceled' ),
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

	public function reactivateSubscription( string $subscription_id ) {
		try {
			$response = $this->client->request(
				'PATCH',
				"{$this->config->supabaseUrl}/rest/v1/stripe_subscriptions",
				array(
					'query' => array(
						'stripe_subscription_id' => 'eq.' . $subscription_id,
					),
					'json'  => array( 'subscription_status' => 'active' ),
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
				'PATCH',
				"{$this->config->supabaseUrl}/rest/v1/stripe_subscriptions",
				array(
					'query' => array( 'user_id' => 'eq.' . $user_id ),
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
