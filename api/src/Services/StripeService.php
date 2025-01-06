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
		$auth_response   = $this->supabase->authorize( $request, $response );

		if ( $auth_response !== null ) {
			return $auth_response;
		}

		try {
			$this->stripeClient
			->subscriptions
			->update( $subscription_id, array( 'cancel_at_period_end' => true ) );

		} catch ( \Exception $e ) {
			$response->getBody()->write(
				json_encode(
					array(
						'status'  => 'error',
						'message' => $e->getMessage(),
					)
				)
			);
			return $response->withStatus( 404 );
		}

		$response->getBody()->write(
			json_encode(
				array(
					'status' => 'success',
					'data'   => null,
				)
			)
		);
		$this->supabase->cancelSubscription( $subscription_id );

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
