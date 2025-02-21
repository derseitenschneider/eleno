<?php

use App\Controllers\HomeworkController;
use Slim\App;
use Slim\Routing\RouteCollectorProxy;

return function ( App $app ) {
	$app->group(
		'/homework',
		function ( RouteCollectorProxy $group ) {
			$group->get(
				'/{entity_id}/{homework_key}',
				[ HomeworkController::class, 'getHomework' ]
			);
		}
	);
};
