<?php

use App\Database\Database;
use DI\Container;
use App\Services\Message\Handlers\CancellationMessageHandler;
use App\Services\Message\Handlers\DisputeMessageHandler;
use App\Services\Message\Handlers\SubscriptionMessageHandler;
use App\Services\Message\Handlers\FirstTimeSubscriptionHandler;
use App\Services\Message\Handlers\LifetimeMessageHandler;
use App\Services\Message\Handlers\PaymentFailedMessageHandler;
use App\Services\Message\Handlers\ReactivationMessageHandler;
use App\Services\Message\MessageService;
use App\Services\Message\Strategies\DatabaseMessageStrategy;
use App\Services\Message\Strategies\MailMessageStrategy;
use App\Services\Message\Templates\MessageTemplateService;
use App\Services\Stripe\StripeAPIService;
use PHPMailer\PHPMailer\PHPMailer;

return function ( Container $container ) {

	$container->set(
		MessageService::class,
		function ( $container ) {
			$databaseStrategy = $container->get( DatabaseMessageStrategy::class );
			$mailStrategy     = $container->get( MailMessageStrategy::class );

			return new MessageService(
				array(
					'database' => $databaseStrategy,
					'mail'     => $mailStrategy,
				)
			);
		}
	);

	$container->set(
		MailMessageStrategy::class,
		function ( $container ) {
			$mailer = $container->get( 'customMailer' );
			return new MailMessageStrategy( $mailer );
		}
	);

	$container->set(
		DatabaseMessageStrategy::class,
		function ( $container ) {
			$db     = $container->get( Database::class );
			$logger = $container->get( 'appLogger' );

			return new DatabaseMessageStrategy( $db, $logger );
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
		SubscriptionMessageHandler::class,
		function ( $container ) {
			$templateService = $container->get( MessageTemplateService::class );
			$messageService  = $container->get( MessageService::class );
			$db              = $container->get( Database::class );

			return new SubscriptionMessageHandler(
				$templateService,
				$messageService,
				$db
			);
		}
	);

	$container->set(
		LifetimeMessageHandler::class,
		function ( Container $container ) {
				$messageTemplateService = $container->get( MessageTemplateService::class );
				$messageService         = $container->get( MessageService::class );
				$stripeApiService       = $container->get( StripeAPIService::class );
				$db                     = $container->get( Database::class );

			return new LifetimeMessageHandler(
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
				$messageTemplateService = $container->get( MessageTemplateService::class );
				$messageService         = $container->get( MessageService::class );

			return new CancellationMessageHandler(
				$messageTemplateService,
				$messageService
			);
		}
	);

	$container->set(
		ReactivationMessageHandler::class,
		function ( Container $container ) {
				$messageTemplateService = $container->get( MessageTemplateService::class );
				$messageService         = $container->get( MessageService::class );

			return new ReactivationMessageHandler(
				$messageTemplateService,
				$messageService
			);
		}
	);

	$container->set(
		PaymentFailedMessageHandler::class,
		function ( Container $container ) {
				$messageTemplateService = $container->get( MessageTemplateService::class );
				$messageService         = $container->get( MessageService::class );

			return new PaymentFailedMessageHandler(
				$messageTemplateService,
				$messageService
			);
		}
	);

	$container->set(
		DisputeMessageHandler::class,
		function ( Container $container ) {
				$messageService = $container->get( MessageService::class );

			return new DisputeMessageHandler(
				$messageService
			);
		}
	);
};
