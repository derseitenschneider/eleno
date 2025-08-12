<?php

use App\Config\Config;
use App\Middleware\ApiKeyAuthMiddleware;
use App\Middleware\CorsMiddleware;
use App\Middleware\CustomerAccessMiddleware;
use DI\Container;
use App\Middleware\JWTAuthMiddleware;
use App\Middleware\RequestLoggerMiddleware;
use App\Middleware\SessionAccessMiddleware;
use App\Middleware\SubscriptionAccessMiddleware;
use App\Services\Security\StripeSecurityChecks;
use Slim\Psr7\Factory\ResponseFactory;

return function ( Container $container ) {
	$container->set(
		ResponseFactory::class,
		function () {
			return new ResponseFactory();
		}
	);

	$container->set(
		JWTAuthMiddleware::class,
		function ( $container ) {
			$config          = $container->get( Config::class );
			$responseFactory = $container->get( ResponseFactory::class );
			return new JWTAuthMiddleware( $config, $responseFactory );
		}
	);

	$container->set(
		CorsMiddleware::class,
		function ( $container ) {
			$config = $container->get( Config::class );

			return new CorsMiddleware( $config );
		}
	);

	$container->set(
		ApiKeyAuthMiddleware::class,
		function ( $container ) {
			$config = $container->get( Config::class );

			return new ApiKeyAuthMiddleware( $config );
		}
	);

	$container->set(
		RequestLoggerMiddleware::class,
		function ( $container ) {
			$config = $container->get( 'requestLogger' );

			return new RequestLoggerMiddleware( $config );
		}
	);

	$container->set(
		CustomerAccessMiddleware::class,
		function ( $container ) {
			$responseFactory      = $container->get( ResponseFactory::class );
			$stripeSecurityChecks = $container->get( StripeSecurityChecks::class );
			$logger               = $container->get( 'appLogger' );

			return new CustomerAccessMiddleware(
				$responseFactory,
				$stripeSecurityChecks,
				$logger
			);
		}
	);

	$container->set(
		SubscriptionAccessMiddleware::class,
		function ( $container ) {
			$responseFactory      = $container->get( ResponseFactory::class );
			$stripeSecurityChecks = $container->get( StripeSecurityChecks::class );
			$logger               = $container->get( 'appLogger' );

			return new SubscriptionAccessMiddleware(
				$responseFactory,
				$stripeSecurityChecks,
				$logger
			);
		}
	);

	$container->set(
		SessionAccessMiddleware::class,
		function ( $container ) {
			$responseFactory      = $container->get( ResponseFactory::class );
			$stripeSecurityChecks = $container->get( StripeSecurityChecks::class );
			$logger               = $container->get( 'appLogger' );

			return new SessionAccessMiddleware(
				$responseFactory,
				$stripeSecurityChecks,
				$logger
			);
		}
	);
};
