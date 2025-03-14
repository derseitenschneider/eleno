<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

// Load environment variables if not already loaded
if ( empty( $_ENV['SUPABASE_URL'] ) ) {
	// Look for .env in the api root directory
	$envPath = __DIR__ . '/..';

	if ( file_exists( $envPath . '/.env' ) ) {
		$dotenv = Dotenv::createImmutable( $envPath );
		$dotenv->load();
	} else {
		throw new \RuntimeException( "Could not find .env file in {$envPath}" );
	}

	// After loading .env, ensure APP_BASE_URL is set for testing
	// if ( ! isset( $_ENV['APP_BASE_URL'] ) ) {
	// $_ENV['APP_BASE_URL'] = 'http://testing-environment';
	// }
}
