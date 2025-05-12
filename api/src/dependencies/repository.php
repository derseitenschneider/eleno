<?php

use App\Database\Database;
use App\Repositories\EntityRepository;
use App\Repositories\LessonRepository;
use App\Repositories\SubscriptionRepository;
use App\Services\Message\Handlers\SubscriptionMessageHandler;
use DI\Container;

return function ( Container $container ) {
	$container->set(
		SubscriptionRepository::class,
		function ( $container ) {
			$db = $container->get( Database::class );

			return new SubscriptionRepository( $db );
		}
	);

	$container->set(
		LessonRepository::class,
		function ( $container ) {
			$db = $container->get( Database::class );

			return new LessonRepository( $db );
		}
	);

	$container->set(
		EntityRepository::class,
		function ( $container ) {
			$db = $container->get( Database::class );

			return new EntityRepository( $db );
		}
	);
};
