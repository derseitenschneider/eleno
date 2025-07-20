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
		private FluentCRMService $fluentCRMService
	) {
	}

	/**
	 * Step 1: Handle a new user signup.
	 * Checks if contact exists. If so, updates their lists. If not, creates them.
	 *
	 * @param Request  $request
	 * @param Response $response
	 * @return Response
	 */
	public function handleNewUserSignup( Request $request, Response $response ): Response {
		$body  = $request->getParsedBody();
		$email = $body['email'] ?? null;

		if ( empty( $email ) ) {
			return $response->withStatus( 400, 'Email is required.' );
		}

		$listIdForNewUsers = 13;
		$existingContact   = $this->fluentCRMService->getContactByEmail( $email );

		if ( $existingContact ) {
			$currentListIds = [];
			if ( ! empty( $existingContact['lists'] ) ) {
				$currentListIds = array_map(
					function ( $contactList ) {
						return $contactList['id'];
					},
					$existingContact['lists']
				);
			}

			$updateData = [
				'attach_lists' => [ $listIdForNewUsers ],
				'detach_lists' => $currentListIds,
			];

			$this->fluentCRMService->updateContactById( $existingContact['id'], $updateData );

			$response->getBody()->write(
				json_encode(
					[ 'message' => 'Existing contact has been moved to the new user list.' ]
				)
			);

			return $response->withHeader( 'Content-Type', 'application/json' )->withStatus( 200 );
		} else {
			$this->fluentCRMService->createContact( $email, null, null, [ $listIdForNewUsers ] );
			$response->getBody()->write( json_encode( [ 'message' => 'New contact created.' ] ) );
			return $response->withHeader( 'Content-Type', 'application/json' )->withStatus( 201 );
		}
	}

	/**
	 * Step 2: Update contact with details after onboarding.
	 *
	 * @param Request  $request
	 * @param Response $response
	 * @return Response
	 */
	public function updateContactDetails( Request $request, Response $response ): Response {
		$body  = $request->getParsedBody();
		$email = $body['email'] ?? null;

		if ( empty( $email ) || empty( $body['firstName'] ) || empty( $body['lastName'] ) ) {
			return $response->withStatus( 400, 'Missing required fields: email, firstName, lastName' );
		}

		// Step 1: Get the contact to find their ID
		$contact = $this->fluentCRMService->getContactByEmail( $email );

		if ( ! $contact ) {
			return $response->withStatus( 404, 'Contact not found.' );
		}

		$updateData = [
			'first_name'   => htmlspecialchars( $body['firstName'] ),
			'last_name'    => htmlspecialchars( $body['lastName'] ),
			'attach_lists' => [ 14 ],
			'detach_lists' => [ 13 ],
		];

		// Step 2: Update the contact using their ID
		$updatedContact = $this->fluentCRMService->updateContactById( $contact['id'], $updateData );

		if ( ! $updatedContact ) {
			return $response->withStatus( 500, 'Failed to update contact.' );
		}

		$response->getBody()->write( json_encode( [ 'message' => 'Contact updated successfully.' ] ) );
		return $response->withHeader( 'Content-Type', 'application/json' )->withStatus( 200 );
	}
}
