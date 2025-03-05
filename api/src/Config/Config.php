<?php

namespace App\Config;

class Config {

	public readonly string $appBaseUrl;

	public readonly string $supabaseUrl;
	public readonly string $supabaseJwtSecret;
	public readonly string $supabaseHost;
	public readonly string $supabasePort;
	public readonly string $subapaseDbName;
	public readonly string $supabaseUser;
	public readonly string $supabasePassword;

	public readonly string $stripeSecretKey;
	public readonly string $stripeWebhookSignature;

	public readonly string $smtpHost;
	public readonly string $smtpUsername;
	public readonly string $smtpPassword;
	public readonly array $corsAllowedOrigins;

	public function __construct() {
		$required = array(
			'APP_BASE_URL',
			'SUPABASE_URL',
			'SUPABASE_JWT_SECRET',
			'SUPABASE_HOST',
			'SUPABASE_PORT',
			'SUPABASE_DBNAME',
			'SUPABASE_USER',
			'SUPABASE_PASSWORD',
			'STRIPE_SECRET_KEY',
			'STRIPE_SIGNATURE',
			'SMTP_HOST',
			'SMTP_USERNAME',
			'SMTP_PASSWORD',
		);

		foreach ( $required as $var ) {
			if ( ! isset( $_ENV[ $var ] ) ) {
				throw new \RuntimeException( "Missing required environment variable: {$var}" );
			}
		}

		$this->appBaseUrl             = $_ENV['APP_BASE_URL'];
		$this->supabaseUrl            = $_ENV['SUPABASE_URL'];
		$this->supabaseJwtSecret      = $_ENV['SUPABASE_JWT_SECRET'];
		$this->stripeSecretKey        = $_ENV['STRIPE_SECRET_KEY'];
		$this->stripeWebhookSignature = $_ENV['STRIPE_SIGNATURE'];
		$this->supabaseHost           = $_ENV['SUPABASE_HOST'];
		$this->supabasePort           = $_ENV['SUPABASE_PORT'];
		$this->subapaseDbName         = $_ENV['SUPABASE_DBNAME'];
		$this->supabaseUser           = $_ENV['SUPABASE_USER'];
		$this->supabasePassword       = $_ENV['SUPABASE_PASSWORD'];
		$this->smtpPassword           = $_ENV['SMTP_PASSWORD'];
		$this->smtpUsername           = $_ENV['SMTP_USERNAME'];
		$this->smtpHost               = $_ENV['SMTP_HOST'];

		// Load CORS origins from environment or use defaults
		$this->corsAllowedOrigins = isset( $_ENV['CORS_ALLOWED_ORIGINS'] )
		? explode( ',', $_ENV['CORS_ALLOWED_ORIGINS'] )
		: array(
			'https://app.eleno.net',
			'https://dev.eleno.net',
			'http://localhost:5173',
			'http://127.0.0.1:5173',
		);
	}
}
