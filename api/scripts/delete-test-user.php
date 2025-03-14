<?php
require_once __DIR__ . '/helpers/base.php';
$supabaseUrl    = $_ENV['SUPABASE_URL'];
$supabaseApiKey = $_ENV['SUPABASE_SERVICEROLE_KEY'];

if ( $argc < 2 ) {
	die( "Usage: php delete_user.php <uuid>\n" );
}

$uuid = $argv[1];

// API Endpoint
$url = $supabaseUrl . '/auth/v1/admin/users/' . $uuid;

// Initialize cURL
$ch = curl_init( $url );

// Set cURL Options
curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
curl_setopt( $ch, CURLOPT_CUSTOMREQUEST, 'DELETE' );
curl_setopt(
	$ch,
	CURLOPT_HTTPHEADER,
	[
		'apikey: ' . $supabaseApiKey,
		'Authorization: Bearer ' . $supabaseApiKey,
	]
);

// Execute cURL Request
$response = curl_exec( $ch );

// Check for Errors
if ( curl_errno( $ch ) ) {
	die( 'cURL Error: ' . curl_error( $ch ) . "\n" );
}

// Close cURL Connection
curl_close( $ch );

// Process Response
$httpCode = curl_getinfo( $ch, CURLINFO_HTTP_CODE );

if ( 200 === $httpCode ) {
	echo "User with UUID $uuid deleted successfully.\n";
} else {
	echo "Error deleting user (HTTP $httpCode): " . $response . "\n";
}
