<?php

namespace App\Controllers;

use App\Config\Config;
use App\Core\Http;
use InvalidArgumentException;
use Monolog\Logger;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use RuntimeException;

class PerspectiveSignupController {
	/**
	 * Constructor
	 *
	 * The class constructor.
	 *
	 * @param Config $config
	 * @param Logger $logger
	 */
	public function __construct(
		private Config $config,
		private Logger $logger,
	) {
	}

	/**
	 * Handle Webhook
	 *
	 * Takes an incoming request, checks the token and forwards the payload
	 * to the user signup.
	 *
	 * @param Request  $request
	 * @param Response $response
	 * @throws RuntimeException Exception, when parsing error.
	 * @throws InvalidArgumentException Exception, when invalid signature.
	 */
	public function handleWebhook( Request $request, Response $response ) {
		$webhookToken = $this->config->perspectiveWebhookToken;

		$payload = @file_get_contents( 'php://input' );
		$token   = $_GET['token'] ?? '';

		if ( $token !== $webhookToken ) {
			return $response->withStatus( 401, 'Access denied: invalid token' );
		}

		return $response
			->withHeader( 'Content-Type', 'application/json' )
			->withStatus( 201 );
	}
}
