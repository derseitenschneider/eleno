<?php

namespace App\Controllers;

use App\Config\Config;
use App\Services\FluentCRMService;
use Monolog\Logger;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class FluentCRMController {

	/**
	 * Constructor
	 *
	 * @param Config           $config
	 * @param Logger           $logger
	 * @param FluentCRMService $fluentCRMService
	 */
	public function __construct(
		private Config $config,
		private Logger $logger,
		private FluentCRMService $fluentCRMService // Inject the service
	) {
	}

	/**
	 * Create contact if it does not exist.
	 *
	 * Checks if a contact exists by email. If not, creates it and adds
	 * it to the 'new-users' list.
	 *
	 * @param Request  $request
	 * @param Response $response
	 * @return Response
	 *
	 * @throws \Exception Throws when something goes wrong with the fluent crm integration.
	 */
	public function createContact(
		Request $request,
		Response $response,
	): Response {
		$body = $request->getParsedBody();

		// Basic validation
		if ( empty( $body['email'] ) || empty( $body['firstName'] ) || empty( $body['lastName'] ) ) {
			return $response->withStatus( 400, 'Missing required fields: email, firstName, lastName' );
		}

		$email     = filter_var( $body['email'], FILTER_SANITIZE_EMAIL );
		$firstName = htmlspecialchars( $body['firstName'] );
		$lastName  = htmlspecialchars( $body['lastName'] );

		try {
			// 1. Check if contact already exists
			$existingContact = $this->fluentCRMService->getContactByEmail( $email );

			if ( $existingContact ) {
				$this->logger->info( 'Contact already exists in FluentCRM.', [ 'email' => $email ] );
				$response->getBody()->write( json_encode( [ 'message' => 'Contact already exists.' ] ) );
				return $response->withHeader( 'Content-Type', 'application/json' )->withStatus( 200 );
			}

			$newListId = 14;

			// 2. If not, create the new contact
			$newContact = $this->fluentCRMService->createContact( $email, $firstName, $lastName, [ $newListId ] );

			if ( ! $newContact ) {
				throw new \Exception( 'Failed to create contact in FluentCRM.' );
			}

			$this->logger->info(
				'New contact created in FluentCRM',
				[
					'email'      => $email,
					'contact_id' => $newContact['id'],
				]
			);
			$response->getBody()->write(
				json_encode(
					[
						'message' => 'Contact created successfully.',
						'contact' => $newContact,
					]
				)
			);
			return $response->withHeader( 'Content-Type', 'application/json' )->withStatus( 201 );

		} catch ( \Exception $e ) {
			$this->logger->error(
				'Error in createContact flow for FluentCRM',
				[
					'error' => $e->getMessage(),
					'email' => $email,
				]
			);
			return $response->withStatus( 500, 'An internal error occurred.' );
		}
	}
}
