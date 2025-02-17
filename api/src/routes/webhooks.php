<?php

use App\Controllers\WebhookController;
use Slim\App;

return function ( App $app ) {
	$app->post(
		'/stripe-webhooks',
		array( WebhookController::class, 'handleWebhook' )
	);
};
