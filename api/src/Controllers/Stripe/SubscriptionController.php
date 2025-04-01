<?php

namespace App\Controllers\Stripe;

use App\Core\Http;
use App\Repositories\SubscriptionRepository;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Services\StripeService;
use Monolog\Logger;

class SubscriptionController {
	/**
	 * Constructor
	 *
	 * The class constructor.
	 *
	 * @param StripeService $stripeService
	 * @param Logger        $logger
	 */
	public function __construct(
		private StripeService $stripeService,
		private Logger $logger
	) {
	}

	/**
	 * Cancel at period end
	 *
	 * Cancels a subscription at period end.
	 *
	 * @param Request  $request
	 * @param Response $response
	 * @param mixed    $args
	 */
	public function cancelAtPeriodEnd( Request $request, Response $response, $args ): Response {
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

	/**
	 * Handle reactivation
	 *
	 * Handles the reactivation of a canceled stripe subscription
	 *
	 * @param Request  $request
	 * @param Response $response
	 * @param mixed    $args
	 */
	public function handleReactivation( Request $request, Response $response, $args ): Response {
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
