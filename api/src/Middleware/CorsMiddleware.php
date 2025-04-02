<?php

namespace App\Middleware;

use App\Config\Config;
use InvalidArgumentException;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as Handler;

class CorsMiddleware implements MiddlewareInterface {

	/** @var array $allowedOrigins A list of allowed origins. */
	private array $allowedOrigins;

	/**
	 * Constructor
	 *
	 * The class constructor.
	 *
	 * @param Config $config
	 */
	public function __construct( Config $config ) {
		$this->allowedOrigins = $config->corsAllowedOrigins;
	}

	/**
	 * Process
	 *
	 * Checks origin and processes the request based on the allowlist of origins.
	 *
	 * @param Request $request
	 * @param Handler $handler
	 *
	 * @throws InvalidArgumentException Throws invalid header name args.
	 */
	public function process( Request $request, Handler $handler ): Response {
		$response = $handler->handle( $request );
		$origin   = $request->getHeaderLine( 'Origin' );

		if ( in_array( $origin, $this->allowedOrigins, true ) ) {
			return $response
				->withHeader( 'Access-Control-Allow-Origin', $origin )
				->withHeader(
					'Access-Control-Allow-Headers',
					'X-Requested-With, Content-Type, Accept, Origin, Authorization'
				)
				->withHeader(
					'Access-Control-Allow-Methods',
					'GET, POST, PUT, DELETE, PATCH, OPTIONS'
				);
		}

		return $response;
	}
}
