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
				'timeout'  => 5, // 5-second timeout
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
			$response = $this->client->get(
				'api/contacts',
				[
					'query' => [ 'email' => $email ],
				]
			);

			$body = json_decode( $response->getBody()->getContents(), true );

			// The API returns a 'data' array. If it's empty, the contact doesn't exist.
			return empty( $body['data'] ) ? null : $body['data'][0];

		} catch ( GuzzleException $e ) {
			$this->logger->error( 'FluentCRM API Error - getContactByEmail: ' . $e->getMessage() );
			return null; // Treat errors as "not found" to be safe
		}
	}

	/**
	 * Create a new contact and add them to a list.
	 *
	 * @param string $email
	 * @param string $firstName
	 * @param string $lastName
	 * @param int[]  $listIds Array of list IDs to add the contact to.
	 * @return array|null The created contact data or null on failure.
	 */
	public function createContact( string $email, string $firstName, string $lastName, array $listIds = [] ): ?array {
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
			$response = $this->client->post(
				'api/contacts',
				[
					'json' => $payload,
				]
			);

			$body = json_decode( $response->getBody()->getContents(), true );
			return $body['contact'] ?? null;

		} catch ( GuzzleException $e ) {
			$this->logger->error( 'FluentCRM API Error - createContact: ' . $e->getMessage(), [ 'payload' => $payload ] );
			return null;
		}
	}
}
