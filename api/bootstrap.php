<?php

// 1. Set up autoloading
require __DIR__ . '/vendor/autoload.php';

ini_set( 'max_execution_time', 180 );
use App\Services\AutoScheduler\AutoSchedulerService;
use DI\Container;

// 2. Load environment variables from your .env file
$dotenv = Dotenv\Dotenv::createImmutable( __DIR__ );
$dotenv->load();

// 3. Create a new DI container
$container = new Container();

// 4. Load only the necessary dependency configurations
// We need 'config.php' because 'autoscheduler.php' depends on it.
( require __DIR__ . '/src/dependencies/config.php' )( $container );
( require __DIR__ . '/src/dependencies/autoscheduler.php' )( $container );

echo "Container configured. Attempting to get AutoSchedulerService...\n";

try {
	// 5. Get the fully configured service from the container
	/** @var AutoSchedulerService $scheduler */
	$scheduler = $container->get( AutoSchedulerService::class );

	echo "Service retrieved successfully. Calling Gemini API...\n\n";

	// 6. Run your test method
	$response = $scheduler->getTestResponse();

	file_put_contents( __DIR__ . '/output.json', $response );
	// 7. Print the result
	if ( $response ) {
		echo "--- Gemini API Response ---\n";
		echo $response;
		echo "\n---------------------------\n";
	} else {
		echo "--- Failed to get a response from the API. ---\n";
	}
} catch ( Exception $e ) {
	echo 'An error occurred: ' . $e->getMessage();
}

echo "\nBootstrap test finished.\n";
