<?php

namespace App\Repositories;

use App\Config\Config;
use Exception;
use Monolog\Logger;

class UserRepository {
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
	}

	/**
	 * Create a new user and send an invite link.
	 *
	 * @param string $email The user's email.
	 * @param string $fullName The user's full name.
	 * @return array The newly created user data.
	 * @throws Exception If user creation fails.
	 */
	public function createUserWithInvite( string $email, string $fullName ): array {
		$inviteUrl      = "{$this->config->supabaseUrl}/auth/v1/invite";
		$serviceRoleKey = $this->config->supabaseServiceRoleKey;

		$nameParts = explode( ' ', $fullName, 2 );
		$firstName = $nameParts[0];
		$lastName  = $nameParts[1] ?? '';

		// Invite data includes the user_metadata for the profile trigger
		$postData = json_encode(
			[
				'email' => $email,
				'data'  => [
					'from_funnel' => true,
					'full_name'   => $fullName,
					'firstName'   => $firstName,
					'lastName'    => $lastName,
				],
			]
		);

		$ch = curl_init( $inviteUrl );
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
		curl_setopt( $ch, CURLOPT_POST, true );
		curl_setopt( $ch, CURLOPT_POSTFIELDS, $postData );
		curl_setopt(
			$ch,
			CURLOPT_HTTPHEADER,
			[
				'Content-Type: application/json',
				"apikey: {$serviceRoleKey}", // Invite is an admin action
				"Authorization: Bearer {$serviceRoleKey}",
			]
		);

		$response = curl_exec( $ch );
		$httpcode = curl_getinfo( $ch, CURLINFO_HTTP_CODE );
		curl_close( $ch );

		if ( $httpcode >= 400 ) {
			$this->logger->error( 'Supabase user invite failed.', [ 'response' => $response ] );
			$errorDetails = json_decode( $response, true );
			$errorMessage = $errorDetails['msg'] ?? 'Failed to invite user.';
			throw new Exception( $errorMessage );
		}

		return json_decode( $response, true );
	}
}
