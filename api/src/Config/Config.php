<?php

namespace App\Config;

class Config {

	/** @var string $appBaseUrl Base url of the webapp */
	public readonly string $appBaseUrl;

	/** @var string $supabaseUrl */
	public readonly string $supabaseUrl;

	/** @var string $supabaseJwtSecret  */
	public readonly string $supabaseJwtSecret;

	/** @var string $supabaseServiceRoleKey  */
	public readonly string $supabaseServiceRoleKey;

	/** @var string $supabaseHost  */
	public readonly string $supabaseHost;

	/** @var string $supabasePort  */
	public readonly string $supabasePort;

	/** @var string $subapaseDbName */
	public readonly string $subapaseDbName;

	/** @var string $supabaseUser  */
	public readonly string $supabaseUser;

	/** @var string $supabasePassword  */
	public readonly string $supabasePassword;


	/** @var string $stripeSecretKey  */
	public readonly string $stripeSecretKey;

	/** @var string $stripeWebhookSignature  */
	public readonly string $stripeWebhookSignature;


	/** @var string $smtpHost  */
	public readonly string $smtpHost;

	/** @var string $smtpUsername  */
	public readonly string $smtpUsername;

	/** @var string $smtpPassword  */
	public readonly string $smtpPassword;

	/** @var string $fluentCRMApiUrl  */
	public readonly string $fluentCRMApiUrl;

	/** @var string $fluentCRMUser  */
	public readonly string $fluentCRMUser;

	/** @var string $fluentCRMPassword  */
	public readonly string $fluentCRMPassword;

	/** @var string $fluentCMRInternalApiKey  */
	public readonly string $fluentCMRInternalApiKey;

	/** @var string $perspectiveWebhookToken  */
	public readonly string $perspectiveWebhookToken;

	/** @var array $corsAllowedOrigins  */
	public readonly array $corsAllowedOrigins;

	/**
	 * Constructor
	 *
	 * @throws \RuntimeException Runtime exception if requried env vars missing.
	 */
	public function __construct() {
		$required = array(
			'APP_BASE_URL',
			'SUPABASE_URL',
			'SUPABASE_JWT_SECRET',
			'SUPABASE_SERVICEROLE_KEY',
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
			'FLUENTCRM_API_URL',
			'FLUENTCRM_USERNAME',
			'FLUENTCRM_PASSWORD',
			'FLUENTCRM_INTERNAL_API_KEY',
			'PERSPECTIVE_WEBHOOK_TOKEN',
		);

		foreach ( $required as $var ) {
			if ( ! isset( $_ENV[ $var ] ) ) {
				throw new \RuntimeException( "Missing required environment variable: {$var}" );
			}
		}

		// Basic config
		$this->appBaseUrl             = $_ENV['APP_BASE_URL'];
		$this->supabaseUrl            = $_ENV['SUPABASE_URL'];
		$this->supabaseJwtSecret      = $_ENV['SUPABASE_JWT_SECRET'];
		$this->supabaseServiceRoleKey = $_ENV['SUPABASE_SERVICEROLE_KEY'];

		// Stripe
		$this->stripeSecretKey        = $_ENV['STRIPE_SECRET_KEY'];
		$this->stripeWebhookSignature = $_ENV['STRIPE_SIGNATURE'];

		// Supabase database connection
		$this->supabaseHost     = $_ENV['SUPABASE_HOST'];
		$this->supabasePort     = $_ENV['SUPABASE_PORT'];
		$this->subapaseDbName   = $_ENV['SUPABASE_DBNAME'];
		$this->supabaseUser     = $_ENV['SUPABASE_USER'];
		$this->supabasePassword = $_ENV['SUPABASE_PASSWORD'];

		// SMTP credentials
		$this->smtpPassword = $_ENV['SMTP_PASSWORD'];
		$this->smtpUsername = $_ENV['SMTP_USERNAME'];
		$this->smtpHost     = $_ENV['SMTP_HOST'];

		// FluentCRM credentials
		$this->fluentCRMApiUrl         = $_ENV['FLUENTCRM_API_URL'];
		$this->fluentCRMUser           = $_ENV['FLUENTCRM_USERNAME'];
		$this->fluentCRMPassword       = $_ENV['FLUENTCRM_PASSWORD'];
		$this->fluentCMRInternalApiKey = $_ENV['FLUENTCRM_INTERNAL_API_KEY'];

		// Perspective Funnel
		$this->perspectiveWebhookToken = $_ENV['PERSPECTIVE_WEBHOOK_TOKEN'];

		// Load CORS origins from environment or use defaults
		$this->corsAllowedOrigins = isset( $_ENV['CORS_ALLOWED_ORIGINS'] )
		? explode( ',', $_ENV['CORS_ALLOWED_ORIGINS'] )
		: array(
			'https://app.eleno.net',
			'https://dev.eleno.net',
			'http://localhost:5173',
			'http://localhost:5000',
			'http://localhost:5001',
			'http://127.0.0.1:5173',
			'http://127.0.0.1:5000',
			'http://127.0.0.1:5001',
		);
	}
}
