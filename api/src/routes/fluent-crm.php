<?php

use App\Controllers\FluentCRMController;
use Slim\App;
use Slim\Routing\RouteCollectorProxy;

return function ( App $app ) {
	$app->group(
		'/fluent-crm',
		function ( RouteCollectorProxy $group ) {
			$group->post(
				'/contact',
				[ FluentCRMController::class, 'createOrUpdateContact' ]
			);

			$group->delete(
				'/contact',
				[ FluentCRMController::class, 'deleteContact' ]
			)->add( JWTAuthMiddleware::class );
		}
	);
};
