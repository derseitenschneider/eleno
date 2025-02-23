<?php

use App\Config\Config;
use App\Controllers\Stripe\CustomerController;
use App\Controllers\Stripe\SessionController;
use App\Controllers\Stripe\SubscriptionController;
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
			$logger         = $container->get( 'appLogger' );

			return new WebhookController( $config, $webhookHandler, $logger );
		}
	);

	$container->set(
		CustomerController::class,
		function ( $container ) {
			$stripeService = $container->get( StripeService::class );
			$logger        = $container->get( 'appLogger' );

			return new CustomerController( $stripeService, $logger );
		}
	);

	$container->set(
		SubscriptionController::class,
		function ( $container ) {
			$stripeService = $container->get( StripeService::class );
			$logger        = $container->get( 'appLogger' );

			return new SubscriptionController( $stripeService, $logger );
		}
	);

	$container->set(
		SessionController::class,
		function ( $container ) {
			$stripeService = $container->get( StripeService::class );
			$config        = $container->get( Config::class );
			$logger        = $container->get( 'appLogger' );

			return new SessionController( $stripeService, $config, $logger );
		}
	);
};
