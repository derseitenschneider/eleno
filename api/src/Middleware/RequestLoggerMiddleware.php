<?php

namespace App\Middleware;

use InvalidArgumentException;
use Monolog\Level;
use Monolog\Logger;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as Handler;
use Psr\Log\InvalidArgumentException as LogInvalidArgumentException;

class RequestLoggerMiddleware implements MiddlewareInterface {
	/**
	 * Construct
	 *
	 * The class constructor
	 *
	 * @param Logger $requestLogger
	 */
	public function __construct(
		private Logger $requestLogger
	) {}

	/**
	 * Process
	 *
	 * Logs the request informations.
	 *
	 * @param Request $request
	 * @param Handler $handler
	 *
	 * @throws InvalidArgumentException Throws on invalid args.
	 * @throws LogInvalidArgumentException Throws when invalid args for logger.
	 */
	public function process( Request $request, Handler $handler ): Response {

		// Don't log preflights.
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
				$headerLine = $request->getHeaderLine( $headerName );

				$loggedHeaders[ $headerName ] = $headerLine;
			}
		}

		$requestData = array(
			'method'  => $request->getMethod(),
			'uri'     => (string) $request->getUri(),
			'headers' => $loggedHeaders,
		);

		$this->requestLogger->info( 'Request received', $requestData );

		$response = $handler->handle( $request );

		$responseHeadersToLog = [
			'Content-Type',
		];

		$loggedResponseHeaders = [];
		foreach ( $responseHeadersToLog as $headerName ) {
			if ( $response->hasHeader( $headerName ) ) {
				$loggedResponseHeaders[ $headerName ] = $response->getHeaderLine( $headerName );
			}
		}

		$responseBody    = (string) $response->getBody();
		$responseBodyLog = strlen( $responseBody ) > 500
			? substr( $responseBody, 0, 500 ) . '...'
			: $responseBody;

		$statusCode   = $response->getStatusCode();
		$responseData = [
			'statusCode' => $statusCode,
			'requestUri' => (string) $request->getUri(),
			'headers'    => $loggedResponseHeaders,
			'body'       => $responseBodyLog,
		];

		$logLevel = Level::Info;
		if ( $statusCode >= 400 && $statusCode < 500 ) {
			$logLevel = Level::Warning;
		} elseif ( $statusCode >= 500 ) {
			$logLevel = Level::Error;
		}

		$this->requestLogger->log( $logLevel, 'Response sent', $responseData );
		return $response;
	}
}
