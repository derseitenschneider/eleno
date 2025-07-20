<?php

namespace App\Services;

use App\Config\Config;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Monolog\Logger;

class FluentCRMService {

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

	/**
	 * Create a new contact.
	 *
	 * @param string      $email
	 * @param string|null $firstName
	 * @param string|null $lastName
	 * @param int[]       $listIds
	 * @return array|null
	 */
	public function createContact( string $email, ?string $firstName, ?string $lastName, array $listIds = [] ): ?array {
		$payload = [
			'email'      => $email,
			'first_name' => $firstName,
			'last_name'  => $lastName,
			'status'     => 'subscribed',
		];

		if ( ! empty( $listIds ) ) {
			$payload['lists'] = $listIds;
		}

		try {
			$response = $this->client->post( 'subscribers', [ 'json' => $payload ] );
			$body     = json_decode( $response->getBody()->getContents(), true );
			return $body['subscriber'] ?? null;

		} catch ( GuzzleException $e ) {
			$this->logger->error( 'FluentCRM API Error - createContact: ' . $e->getMessage(), [ 'payload' => $payload ] );
			return null;
		}
	}

	/**
	 * Update an existing contact using their ID.
	 *
	 * @param int   $contactId The FluentCRM ID of the contact.
	 * @param array $data      The data to update.
	 * @return bool True on success, false on failure.
	 */
	public function updateContactById( int $contactId, array $data ): bool {
		try {
			// Build the URL with the contact ID: e.g., "subscribers/123"
			$url = 'subscribers/' . $contactId;

			$response = $this->client->put(
				$url,
				[
					'json' => $data,
				]
			);

			// Check for a success status code (200-299) instead of the response body.
			return $response->getStatusCode() >= 200 && $response->getStatusCode() < 300;

		} catch ( GuzzleException $e ) {
			$this->logger->error(
				'FluentCRM API Error - updateContactById: ' . $e->getMessage(),
				[ 'payload' => $data ]
			);
			return false;
		}
	}
}
