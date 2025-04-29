<?php

use DI\Container;
use Monolog\Formatter\LineFormatter;
use Monolog\Handler\RotatingFileHandler;
use Monolog\Handler\StreamHandler;
use Monolog\Level;
use Monolog\Logger;

return function ( Container $container ) {
	$logDirectory = __DIR__ . '/../logs';

	if ( ! is_dir( $logDirectory ) ) {
		mkdir( $logDirectory );
	}

	$output          = "[%datetime%] [%level_name%] %message% | %context% | %extra%\n";
	$dateFormat      = 'Y-m-d, H:i:s';
	$customFormatter = new LineFormatter( $output, $dateFormat );

	$appFileHandler = ( new RotatingFileHandler(
		$logDirectory . '/app.log',
		30,
		Level::Debug,
		true,
		0777,
		false,
		'Y-m-d',
	) )->setFormatter( $customFormatter );

	$requestFileHandler = ( new RotatingFileHandler(
		$logDirectory . '/requests.log',
		30,
		Level::Debug,
		true,
		0777,
		false,
		'Y-m-d',
	) )->setFormatter( $customFormatter );

	$webhookFilehandler = ( new RotatingFileHandler(
		$logDirectory . '/webhooks.log',
		30,
		Level::Debug,
		true,
		0777,
		false,
		'Y-m-d',
	) )->setFormatter( $customFormatter );

	$container->set(
		'appLogger',
		function () use ( $appFileHandler ) {
			$log = new Logger( 'app' );
			$log->pushHandler( $appFileHandler );
			return $log;
		}
	);

	$container->set(
		'requestLogger',
		function () use ( $requestFileHandler ) {
			$log = new Logger( 'requests' );
			$log->pushHandler( $requestFileHandler );
			return $log;
		}
	);

	$container->set(
		'webhookLogger',
		function () use ( $webhookFilehandler ) {
			$log = new Logger( 'webhooks' );
			$log->pushHandler( $webhookFilehandler );
			return $log;
		}
	);
};
