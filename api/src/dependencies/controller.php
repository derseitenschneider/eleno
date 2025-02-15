<?php

use App\Config\Config;
use App\Controllers\WebhookController;
use App\Services\Stripe\WebhookHandler;
use DI\Container;

return function ( Container $container ) {
	$container->set(
		WebhookController::class,
		function ( $container ) {
			$config         = $container->get( Config::class );
			$webhookHandler = $container->get( WebhookHandler::class );

			return new WebhookController( $config, $webhookHandler );
		}
	);
};
