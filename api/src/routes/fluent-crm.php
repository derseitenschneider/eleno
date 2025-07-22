<?php

use App\Controllers\FluentCRMController;
use App\Middleware\ApiKeyAuthMiddleware;
use App\Middleware\JWTAuthMiddleware;
use Slim\App;
use Slim\Routing\RouteCollectorProxy;

return function ( App $app ) {
	$app->group(
		'/fluent-crm',
		function ( RouteCollectorProxy $group ) {
			// This route only gets triggered by supabase functions. Therefore
			// we check for an internal API key via Middleware.
			$group->post(
				'/contact',
				[ FluentCRMController::class, 'createOrUpdateContact' ]
			)->add( ApiKeyAuthMiddleware::class );

			// These routes is specifically for in app operations like from the
			// onboarding screen. Thats why we add the JWTAuthMiddleware.
			$group->put(
				'/contact',
				[ FluentCRMController::class, 'createOrUpdateContact' ]
			)->add( JWTAuthMiddleware::class );

			$group->delete(
				'/contact',
				[ FluentCRMController::class, 'deleteContact' ]
			)->add( JWTAuthMiddleware::class );
		}
	);
};
