<?php

use DI\Container;
use Monolog\Handler\StreamHandler;
use Monolog\Level;
use Monolog\Logger;

return function ( Container $container ) {
	$logDirectory = __DIR__ . '/../logs';
	if ( ! is_dir( $logDirectory ) ) {
		throw new Error( 'Log directory not found: ' . $logDirectory );
	}

	$container->set(
		'logger',
		function () use ( $logDirectory ) {
			$log = new Logger( 'base' );
			$log->pushHandler( new StreamHandler( $logDirectory . '/app.log', Level::Debug ) );
			return $log;
		}
	);

	$container->set(
		'requestLogger',
		function () use ( $logDirectory ) {
			$log = new Logger( 'requests' );
			$log->pushHandler( new StreamHandler( $logDirectory . '/requests.log', Level::Debug ) );
			return $log;
		}
	);

	$container->set(
		'webhookLogger',
		function () use ( $logDirectory ) {
			$log = new Logger( 'webhooks' );
			$log->pushHandler( new StreamHandler( $logDirectory . '/webhooks.log', Level::Debug ) );
			return $log;
		}
	);
};
