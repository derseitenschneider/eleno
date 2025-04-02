<?php
namespace App\Middleware;

use App\Config\Config;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use InvalidArgumentException;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as Handler;
use RuntimeException;
use Slim\Psr7\Factory\ResponseFactory;

class JWTAuthMiddleware implements MiddlewareInterface {

	/**
	 * Construct
	 *
	 * The class constructor.
	 *
	 * @param Config          $config
	 * @param ResponseFactory $responseFactory
	 */
	public function __construct(
		private Config $config,
		private ResponseFactory $responseFactory,
	) {}

	/**
	 * Process
	 *
	 * Checks the jwt in the auth header and.
	 *
	 * @param Request $request
	 * @param Handler $handler
	 *
	 * @throws InvalidArgumentException Invalid jwt key.
	 * @throws RuntimeException Other jwt decode exceptions.
	 */
	public function process( Request $request, Handler $handler ): Response {
		// Get token from header - case-insensitive check
		$authHeader     = $this->getAuthorizationHeader( $request );
		$hasBearerToken = preg_match( '/^Bearer\s+(.*)$/', $authHeader, $matches );

		if ( empty( $authHeader ) || ! $hasBearerToken ) {
			return $this->createErrorResponse( 'No token provided', 401 );
		}

		try {
			$key = new Key( $this->config->supabaseJwtSecret, 'HS256' );
			JWT::decode( $matches[1], $key );

			// Proceed with the request
			return $handler->handle( $request );
		} catch ( \Firebase\JWT\ExpiredException $e ) {
			return $this->createErrorResponse( 'Token has expired', 401 );
		} catch ( \Exception $e ) {
			return $this->createErrorResponse( $e->getMessage(), 401 );
		}
	}

	/**
	 * Get authorization header
	 *
	 * Retrieves the auth header case insensitive.
	 *
	 * Case insensitive because in playwright tests the auth header is lowercase.
	 *
	 * @param Request $request
	 */
	private function getAuthorizationHeader( Request $request ): ?string {
		$headers = $request->getHeaders();

		// Case-insensitive check for both common variations
		foreach ( [ 'Authorization', 'authorization' ] as $headerName ) {
			if ( isset( $headers[ $headerName ] ) && ! empty( $headers[ $headerName ][0] ) ) {
				return $headers[ $headerName ][0];
			}
		}
		return null;
	}

	/**
	 * Create error response
	 *
	 * @param string $message
	 * @param int    $status
	 *
	 * @throws InvalidArgumentException Throws when json is invalid.
	 * @throws RuntimeException Throws when args are invalid.
	 */
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
