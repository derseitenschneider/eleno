<?php

namespace App\Middleware;

use App\Config\Config;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Slim\Psr7\Factory\ResponseFactory;

class JWTAuthMiddleware implements MiddlewareInterface {
	public function __construct(
		private Config $config,
		private ResponseFactory $responseFactory
	) {}

	public function process( Request $request, RequestHandlerInterface $handler ): Response {
		$headers    = $request->getHeaders();
		$authHeader = $headers['Authorization'][0] ?? '';

		if ( ! $authHeader || ! preg_match( '/^Bearer\s+(.*)$/', $authHeader, $matches ) ) {
			return $this->createErrorResponse( 'No token provided', 401 );
		}

		try {
			JWT::decode(
				$matches[1],
				new Key( $this->config->supabaseJwtSecret, 'HS256' )
			);

			// Proceed with the request
			return $handler->handle( $request );

		} catch ( \Firebase\JWT\ExpiredException $e ) {
			return $this->createErrorResponse( 'Token has expired', 401 );
		} catch ( \Exception $e ) {
			return $this->createErrorResponse( 'Invalid token', 401 );
		}
	}

	private function createErrorResponse( string $message, int $status ): Response {
		$response = $this->responseFactory->createResponse( $status );
		$response->getBody()->write(
			json_encode(
				array(
					'status'  => 'error',
					'message' => $message,
				)
			)
		);

		return $response->withHeader( 'Content-Type', 'application/json' );
	}
}
