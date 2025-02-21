<?php

use App\Config\Config;
use App\Middleware\CorsMiddleware;
use App\Middleware\JWTAuthMiddleware;
use App\Middleware\RequestLoggerMiddleware;
use App\Services\Stripe\StripeAPIService;
use App\Services\Stripe\WebhookHandler;
use Slim\Factory\AppFactory;
use DI\Container;
use App\Services\SupabaseService;
use App\Services\StripeService;
use Slim\Psr7\Factory\ResponseFactory;

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../src/functions.php';

$dotenv = Dotenv\Dotenv::createImmutable( __DIR__ . '/..' );
$dotenv->load();

// Create Container
$container = new Container();
( require __DIR__ . '/../src/dependencies/config.php' )( $container );
( require __DIR__ . '/../src/dependencies/controller.php' )( $container );
( require __DIR__ . '/../src/dependencies/database.php' )( $container );
( require __DIR__ . '/../src/dependencies/logger.php' )( $container );
( require __DIR__ . '/../src/dependencies/message.php' )( $container );
( require __DIR__ . '/../src/dependencies/middleware.php' )( $container );
( require __DIR__ . '/../src/dependencies/repository.php' )( $container );
( require __DIR__ . '/../src/dependencies/stripe.php' )( $container );
AppFactory::setContainer( $container );

// Create App
$app = AppFactory::create();

$app->addRoutingMiddleware();

$app->add( RequestLoggerMiddleware::class );

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
$app->add( $container->get( CorsMiddleware::class ) );

// Add routes
( require __DIR__ . '/../src/routes/homework.php' )( $app );
( require __DIR__ . '/../src/routes/stripe.php' )( $app );
( require __DIR__ . '/../src/routes/webhooks.php' )( $app );
( require __DIR__ . '/../src/routes/catch-all.php' )( $app );

$app->run();
