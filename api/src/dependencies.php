<?php

use DI\Container;
use App\Config\Config;
use App\Services\SupabaseService;
use App\Services\Stripe\StripeService;
use App\Services\Stripe\StripeAPIService;
use App\Services\Stripe\StripeRepository;
use App\Services\Stripe\WebhookHandler;
use App\Middleware\JWTAuthMiddleware;
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
				$container->get( SupabaseService::class )
			);
		}
	);

	$container->set(
		WebhookHandler::class,
		function ( $container ) {
			return new WebhookHandler(
				$container->get( StripeRepository::class )
			);
		}
	);

	$container->set(
		StripeService::class,
		function ( $container ) {
			return new StripeService(
				$container->get( StripeAPIService::class ),
				$container->get( StripeRepository::class ),
				$container->get( WebhookHandler::class )
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
};
