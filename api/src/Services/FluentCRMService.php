<?php

namespace App\Services;

use App\Config\Config;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Monolog\Logger;

class FluentCRMService {

	/** @var Client $client The fluentcrm client */
	private Client $client;

	/**
	 * Constructor
	 *
	 * @param Config $config
	 * @param Logger $logger
	 */
	public function __construct(
		private Config $config,
		private Logger $logger
	) {
		$this->client = new Client(
			[
				'base_uri' => $this->config->fluentCRMApiUrl,
				'auth'     => [
					$this->config->fluentCRMUser,
					$this->config->fluentCRMPassword,
				],
				'headers'  => [
					'Content-Type' => 'application/json',
					'Accept'       => 'application/json',
				],
				'timeout'  => 5,
			]
		);
	}


	/**
	 * Create or update a contact in fluent crm.
	 *
	 * @param array $data  An associative array of contact data (e.g., first_name, lists, tags).
	 * @return array|null The created contact data or null on failure.
	 */
	public function createOrUpdateContact( array $data = [] ): ?array {

		try {
			$response = $this->client->post( 'subscribers', [ 'json' => $data ] );
			$body     = json_decode( $response->getBody()->getContents(), true );
			return $body['subscriber'] ?? null;
		} catch ( GuzzleException $e ) {
			$this->logger->error(
				'FluentCRM API Error - createContact: ' . $e->getMessage(),
				[ 'payload' => $data ]
			);
			return null;
		}
	}

	/**
	 * Delete contact from fluent crm database.
	 *
	 * @param string $email  The email of the contact to delete.
	 * @return array|null The created contact data or null on failure.
	 */
	public function deleteContact( string $email ): ?array {

		try {
			$contact   = $this->getContactByEmail( $email );
			$contactId = $contact['id'];
			$response  = $this->client->delete( "subscribers/{$contactId}" );
			$body      = json_decode( $response->getBody()->getContents(), true );
			return $body['subscriber'] ?? null;
		} catch ( GuzzleException $e ) {
			$this->logger->error(
				'FluentCRM API Error - deleteContact: ' . $e->getMessage(),
				[ 'fluent_crm_id' => $contactId ]
			);
			return null;
		}
	}
	/**
	 * Get a contact by email
	 *
	 * @param string $email
	 * @return array|null The contact data or null if not found.
	 */
	public function getContactByEmail( string $email ): ?array {
		try {
			// CORRECTED: Use the 'subscribers/0' path and 'get_by_email' query parameter.
			$response = $this->client->get(
				'subscribers/0',
				[
					'query' => [ 'get_by_email' => $email ],
				]
			);

			$body = json_decode( $response->getBody()->getContents(), true );

			// CORRECTED: The API returns the object under the 'subscriber' key.
			return $body['subscriber'] ?? null;

		} catch ( GuzzleException $e ) {
			// If the contact is not found, FluentCRM returns a 404, which Guzzle treats as an exception.
			// We can log this but still return null as intended.
			$this->logger->info(
				'Contact not found via email, or API error.',
				[
					'email' => $email,
					'error' => $e->getMessage(),
				]
			);
			return null;
		}
	}
}
