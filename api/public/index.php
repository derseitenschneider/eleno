<?php

use Slim\Factory\AppFactory;
use DI\Container;
use App\Services\SupabaseService;
use App\Controllers\HomeworkController;

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

// Create App
$app = AppFactory::create();

// Add error middleware
$app->addErrorMiddleware(true, true, true);

// Add routes
(require __DIR__ . '/../src/routes.php')($app);

$app->run();
