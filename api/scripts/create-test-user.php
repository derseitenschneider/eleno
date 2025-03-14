<?php
require_once __DIR__ . '/helpers/base.php';
// Supabase Credentials from .env
$supabaseUrl    = $_ENV['SUPABASE_URL'];
$supabaseApiKey = $_ENV['SUPABASE_SERVICEROLE_KEY'];
$password       = 'securePassword123';

// Dynamic Email Generation
$timestamp = time(); // Get current timestamp in seconds
$email     = "test-{$timestamp}@example.com";

// API Endpoint
$url = $supabaseUrl . '/auth/v1/signup';

// Request Data
$data     = [
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
		'apikey: ' . $supabaseApiKey,
	]
);

// Execute cURL Request
$response = curl_exec( $ch );

// Check for Errors
if ( curl_errno( $ch ) ) {
	echo 'cURL Error: ' . curl_error( $ch );
}

// Close cURL Connection
curl_close( $ch );

// Process Response
$result = json_decode( $response, true );

if ( isset( $result['id'] ) && isset( $result['email'] ) ) {
	echo 'User created and email confirmed successfully: ' . $result['id'] . "\n";
} else {
	echo 'Error creating user: ' . json_encode( $result ) . "\n";
}
