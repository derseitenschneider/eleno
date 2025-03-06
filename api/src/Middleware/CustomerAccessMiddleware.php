<?php

namespace App\Middleware;

use App\Core\Http;
use App\Services\Security\StripeSecurityChecks;
use Monolog\Logger;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Slim\Psr7\Factory\ResponseFactory;
use Slim\Routing\RouteContext;

class CustomerAccessMiddleware implements MiddlewareInterface {
	public function __construct(
		private ResponseFactory $responseFactory,
		private StripeSecurityChecks $securityChecks,
		private Logger $logger
	) {}

	public function process( Request $request, RequestHandlerInterface $handler ): Response {
		try {
			$userId     = $this->securityChecks->getUserIdFromRequest( $request );
			$customerId = RouteContext::fromRequest( $request )->getRoute()->getArgument( 'customer_id' );

			if ( $customerId && ! $this->securityChecks->verifyCustomerAccess( $customerId, $userId ) ) {
				return $this->createErrorResponse( 'Unauthorized access', 403 );
			}

			return $handler->handle( $request );
		} catch ( \Exception $e ) {
			$this->logger->error( 'Customer access middleware: ' . $e->getMessage() );
			return $this->createErrorResponse( $e->getMessage(), $e->getCode() );
		}
	}

	private function createErrorResponse( string $message, int $status ): Response {
		$response = $this->responseFactory->createResponse( $status );
		return Http::errorResponse( $response, $message, $status );
	}
}
