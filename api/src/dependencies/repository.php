<?php

use App\Database\Database;
use App\Repositories\SubscriptionRepository;
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
