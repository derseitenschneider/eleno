<?php

use App\Controllers\PerspectiveSignupController;
use Slim\App;
use Slim\Routing\RouteCollectorProxy;

return function ( App $app ) {
	$app->post(
		'/webhooks/perspective-signup',
		[ PerspectiveSignupController::class, 'handleWebhook' ]
	);
};
