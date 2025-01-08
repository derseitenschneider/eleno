<?php

namespace App\Services;

use App\Config\Config;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Stripe\Checkout\Session;
use Stripe\Stripe;
use Stripe\Event;
use Stripe\StripeClient;

class StripeService {
	private StripeClient $stripeClient;

	public function __construct( private SupabaseService $supabase ) {
		$this->stripeClient = new StripeClient( Config::getInstance()->stripeSecretKey );
	}

	public static function initialize() {
		Stripe::setApiKey( Config::getInstance()->stripeSecretKey );
	}


	public function handleCancelation( Request $request, Response $response, $args ) {
		$subscription_id = $args['subscription_id'];

		try {
			$this->stripeClient
			->subscriptions
			->update( $subscription_id, array( 'cancel_at_period_end' => true ) );

			$this->supabase->cancelSubscription( $subscription_id );

			return $this->jsonResponse(
				$response,
				array(
					'status' => 'success',
					'data'   => null,
				)
			);

		} catch ( \Exception $e ) {
			return $this->errorResponse( $response, $e->getMessage() );
		}
	}

	public function handleReactivation( Request $request, Response $response, $args ) {
		$subscription_id = $args['subscription_id'];

		try {
			$this->stripeClient
				->subscriptions
				->update( $subscription_id, array( 'cancel_at_period_end' => false ) );

			$this->supabase->reactivateSubscription( $subscription_id );

			return $this->jsonResponse(
				$response,
				array(
					'status' => 'success',
					'data'   => null,
				)
			);

		} catch ( \Exception $e ) {
			return $this->errorResponse( $response, $e->getMessage() );
		}
	}

	public function handleWebhook( Request $request, Response $response ) {
		$payload = @file_get_contents( 'php://input' );
		$event   = null;

		try {
			$event = Event::constructFrom( json_decode( $payload, true ) );

			switch ( $event->type ) {
				case 'checkout.session.completed':
					/** @var Session $chekoutSession */
					$checkoutSession = $event->data->object;

					$this->supabase->handleCheckoutCompleted( $checkoutSession );
					break;
			}

			return $response->withStatus( 200 );
		} catch ( \UnexpectedValueException $e ) {
			return $this->errorResponse( $response, $e->getMessage(), 400 );
		}
	}

	private function jsonResponse( Response $response, array $data, int $status = 200 ): Response {
		$response->getBody()->write( json_encode( $data ) );
		return $response->withStatus( $status )
			->withHeader( 'Content-Type', 'application/json' );
	}

	private function errorResponse( Response $response, string $message, int $status = 404 ): Response {
		return $this->jsonResponse(
			$response,
			array(
				'status'  => 'error',
				'message' => $message,
			),
			$status
		);
	}
}
