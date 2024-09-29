<?php
use Slim\App;
use Slim\Routing\RouteCollectorProxy;
use App\Controllers\HomeworkController;

return function (App $app) {
    $app->group(
        '/homework', function (RouteCollectorProxy $group) {
            $group->get('/{entity_id}/{homework_key}', [HomeworkController::class, 'getHomework']);
        }
    );

    // Add more route groups here as needed
};
