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

class StripeService {

	public function __construct( private SupabaseService $supabase ) {
	}

	public static function initialize() {
		Stripe::setApiKey( Config::getInstance()->stripeSecretKey );
	}

	protected function authorize( Request $request, Response $response ) {
		$headers     = $request->getHeaders();
		$auth_header = $headers['Authorization'][0] ?? '';
		if ( ! $auth_header || ! preg_match( '/^Bearer\s+(.*)$/', $auth_header, $matches ) ) {
			$response->getBody()->write( json_encode( array( 'error' => 'No token provided' ) ) );
			return $response->withStatus( 401 );
		}

		$jwt = $matches[1];

		try {
			$decoded = JWT::decode(
				$jwt,
				new Key( Config::getInstance()->supabaseJwtSecret, 'HS256' )
			);
		} catch ( \Firebase\JWT\ExpiredException $e ) {
			$response->getBody()->write( json_encode( array( 'error' => 'Token has expired' ) ) );
			return $response->withStatus( 401 );
		} catch ( \Exception $e ) {
			$response->getBody()->write( json_encode( array( 'error' => 'Invalid token' ) ) );
			return $response->withStatus( 401 );
		}

		return null;
	}

	public function handleDelete( Request $request, Response $response, $args ) {
		$subscription_id = $args['subscription_id'];
		$auth_response   = $this->authorize( $request, $response );

		if ( $auth_response !== null ) {
			return $auth_response;
		}

		$response->getBody()->write( json_encode( array( 'success' => 'Deletion successfull' ) ) );
		return $response->withStatus( 200 );
	}

	public function handleWebhook( Request $request, Response $response ) {
		$payload = @file_get_contents( 'php://input' );
		$event   = null;

		try {
			$event = Event::constructFrom(
				json_decode( $payload, true )
			);
		} catch ( \UnexpectedValueException $e ) {
			echo 'Webhook error while parsing basic request.' . esc_html( $e->getMessage() );
			http_response_code( 400 );
			exit();
		}

		switch ( $event->type ) {
			case 'checkout.session.completed':
				/** @var Session $chekoutSession */
				$checkoutSession = $event->data->object;

				$this->handleCheckoutCompleted( $checkoutSession );
				break;
		}
		return $response->withStatus( 200 );
	}


	/**
	 * Handle webhook checkout.session.completed
	 *
	 * @param Session $session
	 */
	private function handleCheckoutCompleted( Session $session ) {
		$this->supabase->handleCheckoutCompleted( $session );
	}
}
