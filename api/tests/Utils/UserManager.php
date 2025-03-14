<?php
require __DIR__ . '/../../vendor/autoload.php';
use App\Config\Config;
use App\Database\Database;

$dotenv = Dotenv\Dotenv::createImmutable( __DIR__ . '/../..' );
$dotenv->load();

class UserManager {
	private $_supabaseUrl;
	private $_supabaseApiKey;
	private $_db;

	/**
	 * @return void
	 */
	public function __construct() {
		$config                = new Config();
		$this->_supabaseUrl    = $_ENV['SUPABASE_URL'];
		$this->_supabaseApiKey = $_ENV['SUPABASE_SERVICEROLE_KEY'];
		$this->_db             = $db ?? new Database( $config );
	}

	public function createUser( $email = null, $password = 'securePassword123' ) {
		// Generate unique email if not provided
		$email = $email ?? 'test-' . time() . '@example.com';

		// API Endpoint
		$url = $this->_supabaseUrl . '/auth/v1/signup';

		// Request Data
		$data = [
			'email'    => $email,
			'password' => $password,
			'options'  => [
				'email_confirm' => true,
			],
		];

		$jsonData = json_encode( $data );

		// Initialize cURL
		$ch = curl_init( $url );

		// Set cURL Options
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
		curl_setopt( $ch, CURLOPT_POST, true );
		curl_setopt( $ch, CURLOPT_POSTFIELDS, $jsonData );
		curl_setopt(
			$ch,
			CURLOPT_HTTPHEADER,
			[
				'Content-Type: application/json',
				'apikey: ' . $this->_supabaseApiKey,
			]
		);

		// Execute cURL Request
		$response = curl_exec( $ch );

		// Check for Errors
		if ( curl_errno( $ch ) ) {
			throw new Exception( 'cURL Error: ' . curl_error( $ch ) );
		}

		// Close cURL Connection
		curl_close( $ch );

		// Process Response
		$result = json_decode( $response, true );

		if ( isset( $result['id'] ) && isset( $result['email'] ) ) {
			return $result['id']; // Return user ID
		} else {
			throw new Exception( 'Error creating user: ' . json_encode( $result ) );
		}
	}

	public function deleteUser( $userId ) {
		// Delete user from Supabase
		$url = $this->_supabaseUrl . '/auth/v1/admin/users/' . $userId;

		$ch = curl_init( $url );
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
		curl_setopt( $ch, CURLOPT_CUSTOMREQUEST, 'DELETE' );
		curl_setopt(
			$ch,
			CURLOPT_HTTPHEADER,
			[
				'Authorization: Bearer ' . $this->_supabaseApiKey,
				'apikey: ' . $this->_supabaseApiKey,
			]
		);

		$response = curl_exec( $ch );

		if ( curl_errno( $ch ) ) {
			throw new Exception( 'cURL Error: ' . curl_error( $ch ) );
		}

		curl_close( $ch );

		return true;
	}
}
