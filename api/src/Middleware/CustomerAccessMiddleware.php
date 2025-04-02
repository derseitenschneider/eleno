<?php

namespace App\Middleware;

use App\Core\Http;
use App\Services\Security\StripeSecurityChecks;
use InvalidArgumentException;
use Monolog\Logger;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as Handler;
use RuntimeException;
use Slim\Psr7\Factory\ResponseFactory;
use Slim\Routing\RouteContext;

class CustomerAccessMiddleware implements MiddlewareInterface {
	/**
	 * Constructor
	 *
	 * The class constructor
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
	 * Authorizes request based on userId and stripe customerId.
	 *
	 * @param Request $request
	 * @param Handler $handler
	 */
	public function process( Request $request, Handler $handler ): Response {
		try {
			$userId     = $this->securityChecks->getUserIdFromRequest( $request );
			$customerId = RouteContext::fromRequest( $request )->getRoute()->getArgument( 'customer_id' );
			// logDebug( $userId );

			if ( $customerId && ! $this->securityChecks->verifyCustomerAccess( $customerId, $userId ) ) {
				return $this->createErrorResponse( 'Unauthorized access', 403 );
			}

			return $handler->handle( $request );
		} catch ( \Exception $e ) {
			$this->logger->error( 'Customer access middleware: ' . $e->getMessage() );
			return $this->createErrorResponse( $e->getMessage(), $e->getCode() );
		}
	}

	/**
	 * Create error response
	 *
	 * Creates an http error response.
	 *
	 * @param string $message
	 * @param int    $status
	 *
	 * @throws InvalidArgumentException Throws when json is invalid.
	 * @throws RuntimeException Throws when args are invalid.
	 */
	private function createErrorResponse( string $message, int $status ): Response {
		$response = $this->responseFactory->createResponse( $status );
		return Http::errorResponse( $response, $message, $status );
	}
}
