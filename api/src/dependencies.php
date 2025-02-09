<?php

use DI\Container;
use App\Config\Config;
use App\Services\SupabaseService;
use App\Services\Stripe\StripeAPIService;
use App\Services\Stripe\StripeRepository;
use App\Services\Stripe\WebhookHandler;
use App\Middleware\JWTAuthMiddleware;
use App\Services\Message\Handlers\CancellationMessageHandler;
use App\Services\Message\Handlers\FirstTimeSubscriptionHandler;
use App\Services\Message\Handlers\LifetimeUpgradeHandler;
use App\Services\Message\MessageService;
use App\Services\Message\Strategies\DatabaseMessageStrategy;
use App\Services\Message\Templates\MessageTemplateService;
use App\Services\StripeService;
use Slim\Psr7\Factory\ResponseFactory;

return function ( Container $container ) {
	// Config
	$container->set(
		Config::class,
		function () {
			return Config::getInstance();
		}
	);

	// Response Factory
	$container->set(
		ResponseFactory::class,
		function () {
			return new ResponseFactory();
		}
	);

	// Auth Middleware
	$container->set(
		JWTAuthMiddleware::class,
		function ( $container ) {
			return new JWTAuthMiddleware(
				$container->get( Config::class ),
				$container->get( ResponseFactory::class )
			);
		}
	);

	// Stripe Services
	$container->set(
		StripeAPIService::class,
		function () {
			return new StripeAPIService();
		}
	);

	$container->set(
		StripeRepository::class,
		function ( $container ) {
			return new StripeRepository(
				$container->get( SupabaseService::class ),
				$container->get( FirstTimeSubscriptionHandler::class )
			);
		}
	);

	$container->set(
		WebhookHandler::class,
		function ( $container ) {
			return new WebhookHandler(
				$container->get( StripeRepository::class ),
				$container->get( StripeAPIService::class ),
				$container->get( LifetimeUpgradeHandler::class )
			);
		}
	);

	// Supabase Service
	$container->set(
		SupabaseService::class,
		function ( $container ) {
			return new SupabaseService(
				$container->get( Config::class )
			);
		}
	);

	// Message Service dependencies
	$container->set(
		MessageService::class,
		function ( Container $container ) {
			return new MessageService(
				array(
					'database' => $container->get( DatabaseMessageStrategy::class ),
				)
			);
		}
	);

	$container->set(
		DatabaseMessageStrategy::class,
		function ( Container $container ) {
			return new DatabaseMessageStrategy(
				$container->get( SupabaseService::class )
			);
		}
	);

	$container->set(
		MessageTemplateService::class,
		function ( Container $container ) {
			return new MessageTemplateService(
				$container->get( SupabaseService::class )
			);
		}
	);

	$container->set(
		FirstTimeSubscriptionHandler::class,
		function ( Container $container ) {
			return new FirstTimeSubscriptionHandler(
				$container->get( DatabaseMessageStrategy::class ),
				$container->get( MessageTemplateService::class ),
				$container->get( MessageService::class ),
				$container->get( SupabaseService::class )
			);
		}
	);

	$container->set(
		LifetimeUpgradeHandler::class,
		function ( Container $container ) {
			return new LifetimeUpgradeHandler(
				$container->get( DatabaseMessageStrategy::class ),
				$container->get( MessageTemplateService::class ),
				$container->get( MessageService::class ),
				$container->get( StripeAPIService::class ),
				$container->get( SupabaseService::class )
			);
		}
	);

	$container->set(
		CancellationMessageHandler::class,
		function ( Container $container ) {
			return new CancellationMessageHandler(
				$container->get( DatabaseMessageStrategy::class ),
				$container->get( MessageTemplateService::class ),
				$container->get( MessageService::class ),
			);
		}
	);

	$container->set(
		StripeService::class,
		function ( $container ) {
			return new StripeService(
				$container->get( SupabaseService::class ),
				$container->get( StripeAPIService::class ),
				$container->get( StripeRepository::class ),
				$container->get( WebhookHandler::class ),
				$container->get( CancellationMessageHandler::class )
			);
		}
	);
};
