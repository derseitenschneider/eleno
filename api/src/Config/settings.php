<?php
declare(strict_types=1);

namespace Config;

class Config {

	private static ?self $instance = null;

	public string $supabaseUrl;
	public string $supabaseAnonKey;
	public string $supabaseServiceRoleKey;
	public string $supabaseReferenceId = 'brhpqxeowknyhrimssxw';
	public string $stripeSecretKey;

	private function __construct() {
		$required = array(
			'SUPABASE_URL',
			'SUPABASE_ANON_KEY',
			'SUPABASE_SERVICE_ROLE_KEY',
			'STRIPE_SECRET_KEY',
		);

		foreach ( $required as $var ) {
			if ( ! isset( $_ENV[ $var ] ) ) {
				throw new \RuntimeException( "Missing required environment variable: {$var}" );
			}
		}

		$this->supabaseUrl            = $_ENV['SUPABASE_URL'];
		$this->supabaseAnonKey        = $_ENV['SUPABASE_ANON_KEY'];
		$this->supabaseServiceRoleKey = $_ENV['SUPABASE_SERVICE_ROLE_KEY'];
		$this->stripeSecretKey        = $_ENV['STRIPE_SECRET_KEY'];
	}

	public static function getInstance(): self {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	// Prevent cloning
	private function __clone() {}

	// Prevent unserialization
	private function __wakeup() {}
}
