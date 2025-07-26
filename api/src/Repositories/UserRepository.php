<?php

namespace App\Repositories;

use App\Config\Config;
use Exception;
use Monolog\Logger;

class UserRepository {
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
		private Logger $logger
	) {
	}

	/**
	 * Create a new user from the Perspective webhook.
	 * This relies on Supabase triggers to create the associated profile.
	 *
	 * @param string $email The user's email.
	 * @param string $fullName The user's full name.
	 * @return array The newly created user data.
	 * @throws Exception If user creation fails.
	 */
	public function createUserFromFunnel( string $email, string $fullName ): array {
		$authAdminUrl   = "{$this->config->supabaseUrl}/auth/v1/admin/users";
		$serviceRoleKey = $this->config->supabaseServiceRoleKey;

		$nameParts = explode( ' ', $fullName, 2 );
		$firstName = $nameParts[0];
		$lastName  = $nameParts[1] ?? '';

		$postData = json_encode(
			array(
				'email'         => $email,
				'email_confirm' => true,
				'user_metadata' => array(
					'from_funnel' => true,
					'full_name'   => $fullName,
					'first_name'  => $firstName,
					'last_name'   => $lastName,
				),
			)
		);

		$ch = curl_init( $authAdminUrl );
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
		curl_setopt( $ch, CURLOPT_POST, true );
		curl_setopt( $ch, CURLOPT_POSTFIELDS, $postData );
		curl_setopt(
			$ch,
			CURLOPT_HTTPHEADER,
			array(
				'Content-Type: application/json',
				"apikey: {$serviceRoleKey}",
				"Authorization: Bearer {$serviceRoleKey}",
			)
		);

		$response = curl_exec( $ch );
		$httpcode = curl_getinfo( $ch, CURLINFO_HTTP_CODE );
		curl_close( $ch );

		if ( $httpcode >= 400 ) {
			$this->logger->error( 'Supabase Auth user creation failed.', array( 'response' => $response ) );
			$errorDetails = json_decode( $response, true );
			$errorMessage = $errorDetails['msg'] ?? 'Failed to create authentication user.';
			throw new Exception( $errorMessage );
		}

		return json_decode( $response, true );
	}
}
