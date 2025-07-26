<?php

namespace App\Controllers;

use App\Config\Config;
use App\Services\FluentCRMService;
use Monolog\Logger;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class FluentCRMController {

	/**
	 * Construct
	 *
	 * The class constructor.
	 *
	 * @param Config           $config
	 * @param Logger           $logger
	 * @param FluentCRMService $fluentCRMService
	 */
	public function __construct(
		private Config $config,
		private Logger $logger,
		private FluentCRMService $fluentCRMService
	) {
	}

	/**
	 * Create or update contact
	 *
	 * Creates a contact in fluent crm if none with given email exists or
	 * updates the existing one.
	 *
	 * @param Request  $request
	 * @param Response $response
	 */
	public function createOrUpdateContact( Request $request, Response $response ): Response {
		$data  = $request->getParsedBody();
		$email = $data['email'] ?? null;

		if ( empty( $email ) ) {
			return $response->withStatus( 400, 'Email is required.' );
		}

			$this->fluentCRMService->createOrUpdateContact( $data );
			$response->getBody()->write( json_encode( [ 'message' => 'New contact created.' ] ) );
			return $response->withHeader( 'Content-Type', 'application/json' )->withStatus( 201 );
	}

	/**
	 * Delete Contact
	 *
	 * Deletes contact from fluent crm database.
	 *
	 * @param Request  $request
	 * @param Response $response
	 */
	public function deleteContact( Request $request, Response $response ): Response {
		$data  = $request->getParsedBody();
		$email = $data['email'] ?? null;

		if ( empty( $email ) ) {
			return $response->withStatus( 400, 'Email is required.' );
		}

			$this->fluentCRMService->deleteContact( $email );
			$response->getBody()->write( json_encode( [ 'message' => 'Contact deleted successfully' ] ) );
			return $response->withHeader( 'Content-Type', 'application/json' )->withStatus( 204 );
	}
}
