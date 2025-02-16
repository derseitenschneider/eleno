<?php

use App\Config\Config;
use App\Services\Message\Handlers\CancellationMessageHandler;
use DI\Container;
use App\Services\Stripe\StripeAPIService;
use App\Services\Stripe\StripeRepository;
use App\Services\Stripe\WebhookHandler;
use App\Services\StripeService;
use App\Services\SupabaseService;
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
		StripeRepository::class,
		function ( $container ) {
			$supabase         = $container->get( SupabaseService::class );
			$firstTimeHandler = $container->get( FirstSubHandler::class );

			return new StripeRepository( $supabase, $firstTimeHandler );
		}
	);

	$container->set(
		StripeSecurityChecks::class,
		function ( $container ) {
			$supabase = $container->get( SupabaseService::class );
			$config   = $container->get( Config::class );

			return new StripeSecurityChecks( $supabase, $config );
		}
	);

	$container->set(
		WebhookHandler::class,
		function ( $container ) {
			$stripeRepository       = $container->get( StripeRepository::class );
			$stripeAPIService       = $container->get( StripeAPIService::class );
			$paymentFailedHandler   = $container->get( PaymentFailedMessageHandler::class );
			$lifetimeUpgradeHandler = $container->get( LifetimeMessageHandler::class );

			return new WebhookHandler(
				$stripeRepository,
				$stripeAPIService,
				$paymentFailedHandler,
				$lifetimeUpgradeHandler
			);
		}
	);

	$container->set(
		StripeService::class,
		function ( $container ) {
			$config              = $container->get( Config::class );
			$stripeAPIService    = $container->get( StripeAPIService::class );
			$repository          = $container->get( StripeRepository::class );
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
