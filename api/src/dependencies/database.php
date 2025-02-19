<?php

use App\Config\Config;
use App\Database\Database;
use DI\Container;
use App\Services\SupabaseService;

return function ( Container $container ) {
	$container->set(
		SupabaseService::class,
		function ( $container ) {
			$config = $container->get( Config::class );

			return new SupabaseService( $config );
		}
	);

	$container->set(
		Database::class,
		function ( $container ) {
			$config = $container->get( Config::class );

			return new Database( $config );
		}
	);
};
