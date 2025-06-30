<?php

use GuzzleHttp\Client as GuzzleClient; // <-- Import the Guzzle client
use Gemini\Client;
use App\Config\Config;
use App\Services\AutoScheduler\AutoSchedulerService;
use DI\Container;

return function ( Container $container ) {

	$container->set(
		AutoSchedulerService::class,
		function ( $container ) {
			$apiKey       = $container->get( Config::class )->geminiApiKey;
			$guzzleClient = new GuzzleClient(
				[
					'timeout' => 120, // Set timeout to 120 seconds (2 minutes)
				]
			);
			$client       = Gemini::client( $apiKey );
			// $client = Gemini::factory()
			// ->withApiKey( $apiKey )
			// ->withHttpClient( $guzzleClient ) // <-- The correct method is withHttpClient()
			// ->make();

			return new AutoSchedulerService( $client );
		}
	);
};
