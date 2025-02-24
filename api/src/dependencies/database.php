<?php

use App\Config\Config;
use App\Database\Database;
use DI\Container;

return function ( Container $container ) {

	$container->set(
		Database::class,
		function ( $container ) {
			$config = $container->get( Config::class );
			$logger = $container->get( 'appLogger' );

			return new Database( $config, $logger );
		}
	);
};
