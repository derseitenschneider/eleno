<?php

use App\Controllers\HomeworkController;
use App\Repositories\LessonRepository;
use DI\Container;

return function ( Container $container ) {
	$container->set(
		HomeworkController::class,
		function ( $container ) {
			$repository = $container->get( LessonRepository::class );
			$logger     = $container->get( 'appLogger' );

			return new HomeworkController( $repository, $logger );
		}
	);
};
