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
				[ FluentCRMController::class, 'handleNewUserSignup' ]
			);

			$group->put(
				'/contact',
				[ FluentCRMController::class, 'updateContactDetails' ]
			);
		}
	);
};
