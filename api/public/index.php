<?php

use App\Config\Config;
use App\Middleware\JWTAuthMiddleware;
use App\Services\Stripe\StripeAPIService;
use App\Services\Stripe\StripeRepository;
use App\Services\Stripe\WebhookHandler;
use Slim\Factory\AppFactory;
use DI\Container;
use App\Services\SupabaseService;
use App\Services\StripeService;
use Slim\Psr7\Factory\ResponseFactory;
use Supabase\CreateClient;

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../src/functions.php';

$dotenv = Dotenv\Dotenv::createImmutable( __DIR__ . '/..' );
$dotenv->load();

$container = new Container();

$container->set(
	Config::class,
	function () {
		return Config::getInstance();
	}
);

$container->set(
	ResponseFactory::class,
	function () {
		return new ResponseFactory();
	}
);

$container->set(
	JWTAuthMiddleware::class,
	function ( $container ) {
		return new JWTAuthMiddleware(
			$container->get( Config::class ),
			$container->get( ResponseFactory::class )
		);
	}
);

$container->set(
	SupabaseService::class,
	function ( $container ) {
		return new SupabaseService( $container->get( Config::class ) );
	}
);

$container->set(
	StripeAPIService::class,
	function () {
		return new StripeAPIService();
	}
);

$container->set(
	StripeRepository::class,
	function ( $container ) {
		return new StripeRepository(
			$container->get( SupabaseService::class )
		);
	}
);

$container->set(
	WebhookHandler::class,
	function ( $container ) {
		return new WebhookHandler(
			$container->get( StripeRepository::class )
		);
	}
);

$container->set(
	StripeService::class,
	function ( $container ) {
		return new StripeService(
			$container->get( StripeAPIService::class ),
			$container->get( StripeRepository::class ),
			$container->get( WebhookHandler::class )
		);
	}
);

StripeAPIService::initialize();

AppFactory::setContainer( $container );

// Initialize Stripe

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
