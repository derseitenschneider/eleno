<?php

use App\Config\Config;
use App\Controllers\Stripe\CustomerController;
use App\Controllers\WebhookController;
use App\Services\Stripe\WebhookHandler;
use App\Services\StripeService;
use DI\Container;
use Monolog\Logger;

return function ( Container $container ) {
	$container->set(
		WebhookController::class,
		function ( $container ) {
			$config         = $container->get( Config::class );
			$webhookHandler = $container->get( WebhookHandler::class );

			return new WebhookController( $config, $webhookHandler );
		}
	);

	$container->set(
		CustomerController::class,
		function ( $container ) {
			$stripeService = $container->get( StripeService::class );
			$logger        = $container->get( 'logger' );

			return new CustomerController( $stripeService, $logger );
		}
	);
};
