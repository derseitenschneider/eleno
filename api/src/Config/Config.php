<?php

namespace App\Config;

class Config {
	public readonly string $appBaseUrl;
	public readonly string $supabaseUrl;
	public readonly string $supabaseAnonKey;
	public readonly string $supabaseServiceRoleKey;
	public readonly string $supabaseJwtSecret;
	public readonly string $stripeSecretKey;
	public readonly string $stripeWebhookSignature;
	public readonly array $corsAllowedOrigins;
	public readonly string $priceIdMonthly;
	public readonly string $priceIdYearly;
	public readonly string $priceIdLifetime;

	public function __construct() {
		$required = array(
			'APP_BASE_URL',
			'SUPABASE_URL',
			'SUPABASE_ANON_KEY',
			'SUPABASE_SERVICE_ROLE_KEY',
			'SUPABASE_JWT_SECRET',
			'STRIPE_SECRET_KEY',
			'STRIPE_SIGNATURE',
		);

		foreach ( $required as $var ) {
			if ( ! isset( $_ENV[ $var ] ) ) {
				throw new \RuntimeException( "Missing required environment variable: {$var}" );
			}
		}

		$this->appBaseUrl             = $_ENV['APP_BASE_URL'];
		$this->supabaseUrl            = $_ENV['SUPABASE_URL'];
		$this->supabaseAnonKey        = $_ENV['SUPABASE_ANON_KEY'];
		$this->supabaseServiceRoleKey = $_ENV['SUPABASE_SERVICE_ROLE_KEY'];
		$this->supabaseJwtSecret      = $_ENV['SUPABASE_JWT_SECRET'];
		$this->stripeSecretKey        = $_ENV['STRIPE_SECRET_KEY'];
		$this->stripeWebhookSignature = $_ENV['STRIPE_SIGNATURE'];

		// Load CORS origins from environment or use defaults
		$this->corsAllowedOrigins = isset( $_ENV['CORS_ALLOWED_ORIGINS'] )
			? explode( ',', $_ENV['CORS_ALLOWED_ORIGINS'] )
			: array(
				'https://app.eleno.net',
				'http://localhost:5173',
				'http://127.0.0.1:5173',
			);
	}
}
