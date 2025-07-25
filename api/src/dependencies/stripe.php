<?php

use App\Config\Config;
use App\Repositories\SubscriptionRepository;
use App\Services\FluentCRMService;
use App\Services\Message\Handlers\CancellationMessageHandler;
use App\Services\Message\Handlers\DisputeMessageHandler;
use DI\Container;
use App\Services\Stripe\StripeAPIService;
use App\Services\Stripe\WebhookHandler;
use App\Services\StripeService;
use App\Services\Message\Handlers\SubscriptionMessageHandler;
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
			$logger     = $container->get( 'appLogger' );

			return new StripeSecurityChecks( $repository, $config, $logger );
		}
	);

	$container->set(
		WebhookHandler::class,
		function ( $container ) {
			$subscriptionRepository = $container->get( SubscriptionRepository::class );
			$stripeAPIService       = $container->get( StripeAPIService::class );
			$fluentCRMService       = $container->get( FluentCRMService::class );
			$firstSubHandler        = $container->get( SubscriptionMessageHandler::class );
			$lifetimeUpgradeHandler = $container->get( LifetimeMessageHandler::class );
			$paymentFailedHandler   = $container->get( PaymentFailedMessageHandler::class );
			$disputeMessageHandler  = $container->get( DisputeMessageHandler::class );
			$logger                 = $container->get( 'webhookLogger' );

			return new WebhookHandler(
				$subscriptionRepository,
				$stripeAPIService,
				$fluentCRMService,
				$firstSubHandler,
				$lifetimeUpgradeHandler,
				$paymentFailedHandler,
				$disputeMessageHandler,
				$logger
			);
		}
	);

	$container->set(
		StripeService::class,
		function ( $container ) {
			$stripeAPIService    = $container->get( StripeAPIService::class );
			$repository          = $container->get( SubscriptionRepository::class );
			$cancellationHandler = $container->get( CancellationMessageHandler::class );
			$reactivationHandler = $container->get( ReactivationMessageHandler::class );

			return new StripeService(
				$stripeAPIService,
				$repository,
				$cancellationHandler,
				$reactivationHandler,
			);
		}
	);
};
