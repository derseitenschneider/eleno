<?php

use App\Config\Config;
use App\Controllers\FluentCRMController;
use App\Services\FluentCRMService;
use DI\Container;

return function ( Container $container ) {
	$container->set(
		FluentCRMService::class,
		function ( $container ) {
			$config = $container->get( Config::class );
			$logger = $container->get( 'appLogger' );

			return new FluentCRMService( $config, $logger );
		}
	);

	$container->set(
		FluentCRMController::class,
		function ( $container ) {
			$config        = $container->get( Config::class );
			$logger        = $container->get( 'appLogger' );
			$fluentService = $container->get( FluentCRMService::class );

			return new FluentCRMController( $config, $logger, $fluentService );
		}
	);
};
