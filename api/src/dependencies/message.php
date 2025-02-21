<?php

use App\Database\Database;
use DI\Container;
use App\Services\Message\Handlers\CancellationMessageHandler;
use App\Services\Message\Handlers\FirstSubHandler;
use App\Services\Message\Handlers\FirstTimeSubscriptionHandler;
use App\Services\Message\Handlers\LifetimeMessageHandler;
use App\Services\Message\Handlers\PaymentFailedMessageHandler;
use App\Services\Message\Handlers\ReactivationMessageHandler;
use App\Services\Message\MessageService;
use App\Services\Message\Strategies\DatabaseMessageStrategy;
use App\Services\Message\Templates\MessageTemplateService;
use App\Services\Stripe\StripeAPIService;

return function ( Container $container ) {

	$container->set(
		MessageService::class,
		function ( $container ) {
			$databaseStrategy = $container->get( DatabaseMessageStrategy::class );

			return new MessageService( array( 'database' => $databaseStrategy ) );
		}
	);

	$container->set(
		DatabaseMessageStrategy::class,
		function ( $container ) {
			$db = $container->get( Database::class );

			return new DatabaseMessageStrategy( $db );
		}
	);

	$container->set(
		MessageTemplateService::class,
		function ( $container ) {
			$db = $container->get( Database::class );

			return new MessageTemplateService( $db );
		}
	);

	// Message Handlers (Example - adapt for others)
	$container->set(
		FirstSubHandler::class,
		function ( $container ) {
			$databaseStrategy = $container->get( DatabaseMessageStrategy::class );
			$templateService  = $container->get( MessageTemplateService::class );
			$messageService   = $container->get( MessageService::class );
			$db               = $container->get( Database::class );

			return new FirstSubHandler(
				$databaseStrategy,
				$templateService,
				$messageService,
				$db
			);
		}
	);

	$container->set(
		LifetimeMessageHandler::class,
		function ( Container $container ) {
				$databaseMessageStrategy = $container->get( DatabaseMessageStrategy::class );
				$messageTemplateService  = $container->get( MessageTemplateService::class );
				$messageService          = $container->get( MessageService::class );
				$stripeApiService        = $container->get( StripeAPIService::class );
				$db                      = $container->get( Database::class );

			return new LifetimeMessageHandler(
				$databaseMessageStrategy,
				$messageTemplateService,
				$messageService,
				$stripeApiService,
				$db
			);
		}
	);

	$container->set(
		CancellationMessageHandler::class,
		function ( Container $container ) {
				$databaseMessageStrategy = $container->get( DatabaseMessageStrategy::class );
				$messageTemplateService  = $container->get( MessageTemplateService::class );
				$messageService          = $container->get( MessageService::class );

			return new CancellationMessageHandler(
				$databaseMessageStrategy,
				$messageTemplateService,
				$messageService
			);
		}
	);

	$container->set(
		ReactivationMessageHandler::class,
		function ( Container $container ) {
				$databaseMessageStrategy = $container->get( DatabaseMessageStrategy::class );
				$messageTemplateService  = $container->get( MessageTemplateService::class );
				$messageService          = $container->get( MessageService::class );

			return new ReactivationMessageHandler(
				$databaseMessageStrategy,
				$messageTemplateService,
				$messageService
			);
		}
	);

	$container->set(
		PaymentFailedMessageHandler::class,
		function ( Container $container ) {
				$databaseMessageStrategy = $container->get( DatabaseMessageStrategy::class );
				$messageTemplateService  = $container->get( MessageTemplateService::class );
				$messageService          = $container->get( MessageService::class );

			return new PaymentFailedMessageHandler(
				$databaseMessageStrategy,
				$messageTemplateService,
				$messageService
			);
		}
	);
};
