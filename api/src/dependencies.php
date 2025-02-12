<?php

use DI\Container;
use App\Config\Config;
use App\Services\SupabaseService;
use App\Services\Stripe\StripeAPIService;
use App\Services\Stripe\StripeRepository;
use App\Services\Stripe\WebhookHandler;
use App\Middleware\JWTAuthMiddleware;
use App\Services\Message\Handlers\CancellationMessageHandler;
use App\Services\Message\Handlers\FirstSubHandler;
use App\Services\Message\Handlers\LifetimeUpgradeHandler;
use App\Services\Message\Handlers\PaymentFailedMessageHandler;
use App\Services\Message\Handlers\ReactivationMessageHandler;
use App\Services\Message\MessageService;
use App\Services\Message\Strategies\DatabaseMessageStrategy;
use App\Services\Message\Templates\MessageTemplateService;
use App\Services\StripeService;
use Slim\Psr7\Factory\ResponseFactory;

return function ( Container $container ) {
	// Config
	$container->set( Config::class, Config::getInstance() );

	// Response Factory
	$container->set( ResponseFactory::class, new ResponseFactory() );

	// Auth Middleware
	$container->set(
		JWTAuthMiddleware::class,
		function ( $container ) {
			$config          = $container->get( Config::class );
			$responseFactory = $container->get( ResponseFactory::class );
			return new JWTAuthMiddleware( $config, $responseFactory );
		}
	);

	// Stripe Services
	$container->set( StripeAPIService::class, new StripeAPIService() );

	$container->set(
		StripeRepository::class,
		function ( $container ) {
			$supabaseService = $container->get( SupabaseService::class );
			$firstSubHandler = $container->get( FirstSubHandler::class );
			return new StripeRepository( $supabaseService, $firstSubHandler, );
		}
	);

	$container->set(
		WebhookHandler::class,
		function ( $container ) {
			$stripeRepository           = $container->get( StripeRepository::class );
			$stripeApiService           = $container->get( StripeAPIService::class );
			$paymentFailedMessageHander = $container->get( PaymentFailedMessageHandler::class );
			$lifetimeUpgradeHandler     = $container->get( LifetimeUpgradeHandler::class );

			return new WebhookHandler(
				$stripeRepository,
				$stripeApiService,
				$paymentFailedMessageHander,
				$lifetimeUpgradeHandler
			);
		}
	);

	// Supabase Service
	$container->set(
		SupabaseService::class,
		function ( $container ) {
			$config = $container->get( Config::class );
			return new SupabaseService( $config );
		}
	);

	// Message Service dependencies
	$container->set(
		MessageService::class,
		function ( Container $container ) {
			$strategies = array(
				'database' => $container->get( DatabaseMessageStrategy::class ),
			);

			return new MessageService( $strategies );
		}
	);

	$container->set(
		DatabaseMessageStrategy::class,
		function ( Container $container ) {
			$subapaseService = $container->get( SupabaseService::class );
			return new DatabaseMessageStrategy( $subapaseService );
		}
	);

	$container->set(
		MessageTemplateService::class,
		function ( Container $container ) {
			$subapaseService = $container->get( SupabaseService::class );
			return new MessageTemplateService( $subapaseService );
		}
	);

	$container->set(
		FirstSubHandler::class,
		function ( Container $container ) {
				$dataBaseMessageStrategy = $container->get( DatabaseMessageStrategy::class );
				$messageTemplateService  = $container->get( MessageTemplateService::class );
				$messageService          = $container->get( MessageService::class );
				$supabaseService         = $container->get( SupabaseService::class );

			return new FirstSubHandler(
				$dataBaseMessageStrategy,
				$messageTemplateService,
				$messageService,
				$supabaseService
			);
		}
	);

	$container->set(
		LifetimeUpgradeHandler::class,
		function ( Container $container ) {
				$databaseMessageStrategy = $container->get( DatabaseMessageStrategy::class );
				$messageTemplateService  = $container->get( MessageTemplateService::class );
				$messageService          = $container->get( MessageService::class );
				$stripeApiService        = $container->get( StripeAPIService::class );
				$subapaseService         = $container->get( SupabaseService::class );

			return new LifetimeUpgradeHandler(
				$databaseMessageStrategy,
				$messageTemplateService,
				$messageService,
				$stripeApiService,
				$subapaseService
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

	$container->set(
		StripeService::class,
		function ( $container ) {
				$supabaseService            = $container->get( SupabaseService::class );
				$stripeApiService           = $container->get( StripeAPIService::class );
				$stripeRepository           = $container->get( StripeRepository::class );
				$webhookHander              = $container->get( WebhookHandler::class );
				$cancellationMessageHandler = $container->get( CancellationMessageHandler::class );
				$reactivationMessageHandler = $container->get( ReactivationMessageHandler::class );
				$paymentFailedMessageHander = $container->get( PaymentFailedMessageHandler::class );
			return new StripeService(
				$supabaseService,
				$stripeApiService,
				$stripeRepository,
				$webhookHander,
				$cancellationMessageHandler,
				$reactivationMessageHandler,
				$paymentFailedMessageHander
			);
		}
	);
};
