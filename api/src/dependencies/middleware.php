<?php

use App\Config\Config;
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
		RequestLoggerMiddleware::class,
		function ( $container ) {
			$config = $container->get( 'requestLogger' );

			return new RequestLoggerMiddleware( $config );
		}
	);

	$container->set(
		CustomerAccessMiddleware::class,
		function ( $container ) {
			$config               = $container->get( Config::class );
			$responseFactory      = $container->get( ResponseFactory::class );
			$stripeSecurityChecks = $container->get( StripeSecurityChecks::class );
			$logger               = $container->get( 'appLogger' );

			return new CustomerAccessMiddleware(
				$config,
				$responseFactory,
				$stripeSecurityChecks,
				$logger
			);
		}
	);

	$container->set(
		SubscriptionAccessMiddleware::class,
		function ( $container ) {
			$config               = $container->get( Config::class );
			$responseFactory      = $container->get( ResponseFactory::class );
			$stripeSecurityChecks = $container->get( StripeSecurityChecks::class );
			$logger               = $container->get( 'appLogger' );

			return new SubscriptionAccessMiddleware(
				$config,
				$responseFactory,
				$stripeSecurityChecks,
				$logger
			);
		}
	);

	$container->set(
		SessionAccessMiddleware::class,
		function ( $container ) {
			$config               = $container->get( Config::class );
			$responseFactory      = $container->get( ResponseFactory::class );
			$stripeSecurityChecks = $container->get( StripeSecurityChecks::class );
			$logger               = $container->get( 'appLogger' );

			return new SessionAccessMiddleware(
				$config,
				$responseFactory,
				$stripeSecurityChecks,
				$logger
			);
		}
	);
};
