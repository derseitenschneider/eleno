<?php

namespace App\Middleware;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as SlimResponse;
use App\Config\Config;

/**
 * ApiKeyAuthMiddleware is a Slim Framework middleware responsible for protecting routes
 * by validating an API key sent in the 'Authorization' header.
 */
class ApiKeyAuthMiddleware implements MiddlewareInterface {

	/**
	 * Constructor
	 *
	 * The class constructor.
	 *
	 * @param Config $config
	 */
	public function __construct( private Config $config ) {
	}

	/**
	 * This is the primary method executed by the middleware.
	 * It intercepts the incoming request to perform authentication before it reaches the route handler.
	 *
	 * @param Request        $request
	 * @param RequestHandler $handler
	 *
	 * @return Response
	 */
	public function process( Request $request, RequestHandler $handler ): Response {
		$expectedApiKey = $this->config->fluentCMRInternalApiKey;

		if ( empty( $expectedApiKey ) ) {
			$response = new SlimResponse();
			return $response->withStatus( 500, 'Internal Server Error' );
		}

		$authHeader = $request->getHeaderLine( 'Authorization' );

		if ( empty( $authHeader ) || ! preg_match( '/^Bearer\s+(.*)$/i', $authHeader, $matches ) ) {
			$response = new SlimResponse();
			return $response->withStatus( 401, 'Unauthorized' );
		}

		$submittedApiKey = $matches[1];

		if ( ! hash_equals( $expectedApiKey, $submittedApiKey ) ) {
			$response = new SlimResponse();
			return $response->withStatus( 401, 'Unauthorized' );
		}

		return $handler->handle( $request );
	}
}
