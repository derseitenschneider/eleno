<?php

namespace App\Services;

use Config\Config;
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
