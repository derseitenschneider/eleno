<?php

use App\Database\Database;
use App\Repositories\SubscriptionRepository;
use App\Services\Message\Handlers\FirstSubHandler;
use DI\Container;

return function ( Container $container ) {
	$container->set(
		SubscriptionRepository::class,
		function ( $container ) {
			$db = $container->get( Database::class );

			return new SubscriptionRepository( $db );
		}
	);
};
