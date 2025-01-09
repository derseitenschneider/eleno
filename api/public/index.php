<?php

use App\Config\Config;
use App\Middleware\CorsMiddleware;
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

// Create Container
$container = new Container();
( require __DIR__ . '/../src/dependencies.php' )( $container );
AppFactory::setContainer( $container );

// Create App
$app = AppFactory::create();

// Body parsing middleware to support raw json post requests.
$app->addBodyParsingMiddleware();

// Add error middleware
$app->addErrorMiddleware( true, true, true );

// Handle preflight
$app->options(
	'/{routes:.+}',
	function ( $request, $response ) {
		return $response;
	}
);

// Add CORS middleware
$app->add( CorsMiddleware::class );

// Add routes
( require __DIR__ . '/../src/routes.php' )( $app );

$app->run();
