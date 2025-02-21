<?php

namespace App\Middleware;

use Monolog\Logger;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class RequestLoggerMiddleware implements MiddlewareInterface {
	public function __construct(
		private Logger $requestLogger
	) {}

	public function process( Request $request, RequestHandlerInterface $handler ): Response {
		if ( $request->getMethod() === 'OPTIONS' ) {
			return $handler->handle( $request );
		}

		$headersToLog = array(
			'Content-Type',
			'Accept',
			'User-Agent',
		);

		$loggedHeaders = array();

		foreach ( $headersToLog as $headerName ) {
			if ( $request->hasHeader( $headerName ) ) {
				$loggedHeaders[ $headerName ] = $request->getHeaderLine( $headerName );
			}
		}

		$requestData = array(
			'method'  => $request->getMethod(),
			'uri'     => (string) $request->getUri(),
			'headers' => $loggedHeaders,
		);

		$this->requestLogger->info( 'Request received', $requestData );

		return $handler->handle( $request );
	}
}
