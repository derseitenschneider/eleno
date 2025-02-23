<?php

namespace App\Controllers\Stripe;

use App\Core\Http;
use App\Repositories\SubscriptionRepository;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Services\StripeService;
use Monolog\Logger;

class SubscriptionController {
	public function __construct(
		private StripeService $stripeService,
		private Logger $logger
	) {
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
			$this->logger->error( 'Cancel at period end: ' . $e->getMessage() );
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
			$this->logger->error( 'Subscription reactivation: ' . $e->getMessage() );
			return Http::errorResponse( $response, $e->getMessage() );
		}
	}
}
