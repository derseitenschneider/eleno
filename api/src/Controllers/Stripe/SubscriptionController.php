<?php

namespace App\Controllers\Stripe;

use App\Core\Http;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Services\StripeService;

class SubscriptionController {
	public function __construct( private StripeService $stripeService ) {
	}

	public function cancelAtPeriodEnd( Request $request, Response $response, $args ) {
		try {
			$subscriptionId = $args['subscription_id'];
			$body           = $request->getParsedBody();
			$firstName      = $body['firstName'] ?? '';
			$userId         = $body['userId'] ?? '';

			$this->stripeService->cancelAtPeriodEnd(
				subscriptionId: $subscriptionId,
				userId: $userId,
				firstName: $firstName
			);

			return Http::jsonResponse( $response, );

		} catch ( \Exception $e ) {
			return Http::errorResponse( $response, $e->getMessage() );
		}
	}

	public function handleReactivation( Request $request, Response $response, $args ) {
		try {
			$subscriptionId = $args['subscription_id'];
			$body           = $request->getParsedBody();
			$userId         = $body['userId'];
			$firstName      = $body['firstName'];

			$this->stripeService->handleReactivation(
				subscriptionId: $subscriptionId,
				userId: $userId,
				firstName: $firstName
			);

			return Http::jsonResponse( $response, );

		} catch ( \Exception $e ) {
			return Http::errorResponse( $response, $e->getMessage() );
		}
	}
}
