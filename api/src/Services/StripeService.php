<?php

namespace App\Services;

use App\Config\Config;
use App\Services\Stripe\StripeAPIService;
use App\Services\Stripe\StripeRepository;
use App\Services\Stripe\WebhookHandler;
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

	public function __construct(
		private StripeAPIService $stripeAPI,
		private StripeRepository $repository,
		private WebhookHandler $webhookHandler
	) {
	}

	public function createSessionMonthly( Request $request, Response $response ) {
		return $this->createSession(
			request: $request,
			response: $response,
			priceId: Config::getInstance()->priceIdMonthly
		);
	}

	public function createSessionYearly( Request $request, Response $response ) {
		return $this->createSession(
			request:$request,
			response:$response,
			priceId:Config::getInstance()->priceIdYearly
		);
	}

	public function createSessionLifetime( Request $request, Response $response ) {
		$body             = $request->getParsedBody();
		$userId           = $body['user_id'];
		$stripeCustomerId = $body['stripe_customer_id'];
		$locale           = $body['locale'];
		try {
			$data = $this->stripeAPI->lifetimeSession(
				userId: $userId,
				stripeCustomerId: $stripeCustomerId,
				priceId: Config::getInstance()->priceIdLifetime,
				locale: $locale
			);
			return $this->jsonResponse(
				$response,
				array(
					'status' => 'success',
					'data'   => $data,
				)
			);
		} catch ( \Exception $e ) {
			return $this->errorResponse( $response, $e->getMessage() );
		}
	}

	public function createSession( Request $request, Response $response, string $priceId ) {
		$body             = $request->getParsedBody();
		$userId           = $body['user_id'];
		$stripeCustomerId = $body['stripe_customer_id'];
		$locale           = $body['locale'];
		try {
			$data = $this->stripeAPI->subscriptionSession(
				userId: $userId,
				stripeCustomerId: $stripeCustomerId,
				priceId: $priceId,
				locale: $locale
			);
			return $this->jsonResponse(
				$response,
				array(
					'status' => 'success',
					'data'   => $data,
				)
			);
		} catch ( \Exception $e ) {
			return $this->errorResponse( $response, $e->getMessage() );
		}
	}

	public function updateSubscriptionSession( Request $request, Response $response, $args ) {
		$subscriptionId = $args['subscription_id'];
		$body           = $request->getParsedBody();
		$customerId     = $body['customer_id'] ?? '';
		$customerLocale = $body['locale'] ?? '';

		try {

			$data = $this->stripeAPI->updateSubscriptionSession(
				$customerId,
				$subscriptionId,
				$customerLocale
			);

			return $this->jsonResponse(
				$response,
				array(
					'status' => 'success',
					'data'   => $data,
				)
			);
		} catch ( \Exception $e ) {
			return $this->errorResponse( $response, $e->getMessage() );
		}
	}



	public function customerPortal( Request $request, Response $response, $args ) {
		$customer_id = $args['customer_id'];
		$body        = $request->getParsedBody();
		$user_locale = $body['locale'] ?? '';

		try {
			$data = $this->stripeAPI->customerPortal( $customer_id, $user_locale );
			return $this->jsonResponse(
				$response,
				array(
					'status' => 'success',
					'data'   => $data,
				)
			);

		} catch ( \Exception $e ) {
			return $this->errorResponse( $response, $e->getMessage() );
		}
	}

	public function handleCancelation( Request $request, Response $response, $args ) {
		$subscription_id = $args['subscription_id'];

		try {
			$this->stripeAPI->updateSubscription(
				$subscription_id,
				array( 'cancel_at_period_end' => true )
			);

			$this->repository->updateSubscriptionStatus(
				$subscription_id,
				'canceled'
			);

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
			$this->stripeAPI->updateSubscription(
				$subscription_id,
				array( 'cancel_at_period_end' => false )
			);

			$this->repository->updateSubscriptionStatus(
				$subscription_id,
				'active'
			);

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

			$this->webhookHandler->handleEvent( $event );

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
