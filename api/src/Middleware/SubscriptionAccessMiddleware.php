<?php

namespace App\Middleware;

use App\Core\Http;
use App\Services\Security\StripeSecurityChecks;
use Monolog\Logger;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as Handler;
use Slim\Psr7\Factory\ResponseFactory;
use Slim\Routing\RouteContext;

class SubscriptionAccessMiddleware implements MiddlewareInterface {
	/**
	 * Construct
	 *
	 * The class constructor.
	 *
	 * @param ResponseFactory      $responseFactory
	 * @param StripeSecurityChecks $securityChecks
	 * @param Logger               $logger
	 */
	public function __construct(
		private ResponseFactory $responseFactory,
		private StripeSecurityChecks $securityChecks,
		private Logger $logger
	) {}

	/**
	 * Process
	 *
	 * Checks access permission for stripe subscription.
	 *
	 * @param Request $request
	 * @param Handler $handler
	 */
	public function process( Request $request, Handler $handler ): Response {
		try {
			$route          = RouteContext::fromRequest( $request )->getRoute();
			$userId         = $this->securityChecks->getUserIdFromRequest( $request );
			$subscriptionId = $route->getArgument( 'subscription_id' );

			$isVerifiedSubscription = $this
				->securityChecks
				->verifySubscriptionAccess( $subscriptionId, $userId );

			if ( ! $isVerifiedSubscription ) {
				return $this->createErrorResponse( 'Unauthorized access', 403 );
			}

			return $handler->handle( $request );
		} catch ( \Exception $e ) {
			$this->logger->error( 'Subscription access middleware: ' . $e->getMessage() );
			return $this->createErrorResponse( $e->getMessage(), $e->getCode() );
		}
	}

	/**
	 * Create error response
	 *
	 * Creates an error response.
	 *
	 * @param string $message
	 * @param int    $status
	 */
	private function createErrorResponse( string $message, int $status ): Response {
		$response = $this->responseFactory->createResponse( $status );
		return Http::errorResponse( $response, $message, $status );
	}
}
