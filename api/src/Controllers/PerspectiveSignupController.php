<?php

namespace App\Controllers;

use App\Config\Config;
use App\Core\Http;
use App\Repositories\UserRepository;
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
	 * @param Config         $config
	 * @param Logger         $logger
	 * @param UserRepository $userRepository
	 */
	public function __construct(
		private Config $config,
		private Logger $logger,
		private UserRepository $userRepository,
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
		$token        = $request->getQueryParams()['token'] ?? '';

		if ( $token !== $webhookToken ) {
			return $response->withStatus( 401, 'Access denied: invalid token' );
		}

		$payload = json_decode( $request->getBody()->getContents(), true );

		$email    = $payload['values']['email'] ?? null;
		$fullName = $payload['values']['name'] ?? null;

		if ( ! $email || ! $fullName ) {
			return $response->withStatus(
				400,
				'Bad request: missing email or fullname.'
			);
		}

		try {
			$newUser = $this->userRepository
				->createUserWithInvite( $email, $fullName );

			$response->getBody()->write( json_encode( $newUser ) );

			return $response
				->withHeader( 'Content-Type', 'application/json' )
				->withStatus( 201 );

		} catch ( \Exception $e ) {
			$this->logger->error( $e->getMessage() );
			return $response->withStatus(
				409,
				'Error creating user: ' . $e->getMessage()
			);
		}
	}
}
