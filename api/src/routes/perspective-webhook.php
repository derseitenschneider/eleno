<?php

use Slim\App;
use Slim\Routing\RouteCollectorProxy;

return function ( App $app ) {
	$app->post(
		'/webhooks/perspective-signup',
		[ WebhookController::class, 'handleWebhook' ]
	);
};
