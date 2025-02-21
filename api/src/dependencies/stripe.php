<?php

use App\Config\Config;
use App\Repositories\SubscriptionRepository;
use App\Services\Message\Handlers\CancellationMessageHandler;
use DI\Container;
use App\Services\Stripe\StripeAPIService;
use App\Services\Stripe\WebhookHandler;
use App\Services\StripeService;
use App\Services\Message\Handlers\FirstSubHandler;
use App\Services\Message\Handlers\LifetimeMessageHandler;
use App\Services\Message\Handlers\PaymentFailedMessageHandler;
use App\Services\Message\Handlers\ReactivationMessageHandler;
use App\Services\Security\StripeSecurityChecks;

return function ( Container $container ) {

	$container->set(
		StripeAPIService::class,
		function ( $container ) {
			$config = $container->get( Config::class );

			return new StripeAPIService( $config );
		}
	);

	$container->set(
		StripeSecurityChecks::class,
		function ( $container ) {
			$repository = $container->get( SubscriptionRepository::class );
			$config     = $container->get( Config::class );

			return new StripeSecurityChecks( $repository, $config );
		}
	);

	$container->set(
		WebhookHandler::class,
		function ( $container ) {
			$subscriptionRepository = $container->get( SubscriptionRepository::class );
			$stripeAPIService       = $container->get( StripeAPIService::class );
			$firstSubHandler        = $container->get( FirstSubHandler::class );
			$lifetimeUpgradeHandler = $container->get( LifetimeMessageHandler::class );
			$paymentFailedHandler   = $container->get( PaymentFailedMessageHandler::class );
			$logger                 = $container->get( 'webhookLogger' );

			return new WebhookHandler(
				$subscriptionRepository,
				$stripeAPIService,
				$firstSubHandler,
				$lifetimeUpgradeHandler,
				$paymentFailedHandler,
				$logger
			);
		}
	);

	$container->set(
		StripeService::class,
		function ( $container ) {
			$config              = $container->get( Config::class );
			$stripeAPIService    = $container->get( StripeAPIService::class );
			$repository          = $container->get( SubscriptionRepository::class );
			$webhookHandler      = $container->get( WebhookHandler::class );
			$cancellationHandler = $container->get( CancellationMessageHandler::class );
			$reactivationHandler = $container->get( ReactivationMessageHandler::class );

			return new StripeService(
				$config,
				$stripeAPIService,
				$repository,
				$webhookHandler,
				$cancellationHandler,
				$reactivationHandler,
			);
		}
	);
};
