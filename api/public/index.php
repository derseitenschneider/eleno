<?php

use Slim\Factory\AppFactory;
use DI\Container;
use App\Services\SupabaseService;
use App\Controllers\HomeworkController;
use App\Services\StripeService;

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../src/functions.php';

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Create Container and add our services
$container = new Container();

// Add settings to the container
$container->set(
    'settings', function () {
        return include __DIR__ . '/../src/Config/settings.php';
    }
);

// Add SupabaseService to the container
$container->set(
    SupabaseService::class, function ($c) {
        $settings = $c->get('settings');
        return new SupabaseService($settings['supabase']);
    }
);

// Add HomeworkController to the container
$container->set(
    HomeworkController::class, function ($c) {
        return new HomeworkController($c->get(SupabaseService::class));
    }
);

AppFactory::setContainer($container);
//
// Initialize Stripe
StripeService::initialize();

// Create App
$app = AppFactory::create();

// Add error middleware
$app->addErrorMiddleware(true, true, true);

// CORS Pre-flight middleware
$app->options(
    '/{routes:.+}', function ($request, $response) {
        return $response;
    }
);

// Add CORS middleware
$app->add(
    function ($request, $handler) {
        $response = $handler->handle($request);
    
        // Get the origin from the request
        $origin = $request->getHeaderLine('Origin');
    
        // List of allowed origins
        $allowedOrigins = [
        'https://app.eleno.net',
        'http://localhost:5173',  
        'http://127.0.0.1:5173'  
        ];
    
        // Check if the origin is in the list of allowed origins
        if (in_array($origin, $allowedOrigins)) {
            return $response
                ->withHeader('Access-Control-Allow-Origin', $origin)
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
(require __DIR__ . '/../src/routes.php')($app);

$app->run();
