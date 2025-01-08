<?php

namespace App\Middleware;

use App\Config\Config;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class CorsMiddleware implements MiddlewareInterface {

	private array $allowedOrigins;

	public function __construct( Config $config ) {
		$this->allowedOrigins = $config->corsAllowedOrigins;
	}

	public function process( Request $request, RequestHandlerInterface $handler ): Response {
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
