<?php

namespace App\Services\AutoScheduler;

use Gemini\Client; // <-- Note the import
use Gemini\Enums\ModelType;
use Exception;
use ValueError;

class AutoSchedulerService {

	/**
	 * The Gemini SDK client, injected via DI.
	 *
	 * @var Client
	 */
	private Client $client;

	/**
	 * The constructor now asks for the Client object directly.
	 * PHP-DI will provide this automatically based on our definitions.
	 *
	 * @param Client $client A fully configured Gemini SDK client.
	 */
	public function __construct( Client $client ) {
		$this->client = $client;
	}

	/**
	 * @param string $prompt
	 * @return null|string
	 * @throws ValueError Throws a value error.
	 */
	public function getTestResponse(
		string $prompt = 'Hello Gemini! Please write a short, encouraging message for a music teacher using the Eleno app.'
	): ?string {
		try {
			$preload = file_get_contents( __DIR__ . '/prompt-preload.txt' );
			$data    = file_get_contents( __DIR__ . '/test-data.json' );
			$prompt  = $preload . "\n" . $data;

			$response = $this->client->generativeModel( model: 'gemini-1.5-pro' )->generateContent( $prompt );

			return $response->text();
			// return json_encode( $this->client->models()->list()->toArray() );
		} catch ( Exception $e ) {
			error_log( 'Gemini SDK Error: ' . $e->getMessage() );
			return null;
		}
	}
}
