<?php

use App\Config\Config;
use App\Middleware\CorsMiddleware;
use DI\Container;
use App\Middleware\JWTAuthMiddleware;
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
			logDebug( $config );

			return new CorsMiddleware( $config );
		}
	);
};
