<?php

use Slim\Factory\AppFactory;
use DI\Container;
use App\Services\SupabaseService;
use App\Services\StripeService;
use Supabase\CreateClient;

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../src/functions.php';

$dotenv = Dotenv\Dotenv::createImmutable( __DIR__ . '/..' );
$dotenv->load();

$container = new Container();

$container->set(
	'settings',
	function () {
		return include __DIR__ . '/../src/Config/settings.php';
	}
);

$container->set(
	SupabaseService::class,
	function ( $c ) {
		$settings = $c->get( 'settings' );
		return new SupabaseService( $settings['supabase'] );
	}
);

$container->set(
	'db',
	function ( $c ) {
		$settings = $c->get( 'settings' );
		return new CreateClient( $settings['service_role_key'], $settings['reference_id'] );
	}
);

AppFactory::setContainer( $container );

// Initialize Stripe
StripeService::initialize();

// Create App
$app = AppFactory::create();


// Add error middleware
$app->addErrorMiddleware( true, true, true );

// CORS Pre-flight middleware
$app->options(
	'/{routes:.+}',
	function ( $request, $response ) {
		return $response;
	}
);

// Add CORS middleware
$app->add(
	function ( $request, $handler ) {
		$response = $handler->handle( $request );

		// Get the origin from the request
		$origin = $request->getHeaderLine( 'Origin' );

		// List of allowed origins
		$allowedOrigins = array(
			'https://app.eleno.net',
			'http://localhost:5173',
			'http://127.0.0.1:5173',
		);

		// Check if the origin is in the list of allowed origins
		if ( in_array( $origin, $allowedOrigins, true ) ) {
			return $response
				->withHeader( 'Access-Control-Allow-Origin', $origin )
				->withHeader(
					'Access-Control-Allow-Headers',
					'X-Requested-With, Content-Type, Accept, Origin, Authorization'
				)
				->withHeader(
					'Access-Control-Allow-Methods',
					'GET, POST, PUT, DELETE, PATCH, OPTIONS'
				);
		}

		return $response;
	}
);

// Add routes
( require __DIR__ . '/../src/routes.php' )( $app );

$app->run();
