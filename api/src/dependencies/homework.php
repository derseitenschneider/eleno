<?php

use App\Controllers\HomeworkController;
use App\Repositories\EntityRepository;
use App\Repositories\LessonRepository;
use DI\Container;

return function ( Container $container ) {
	$container->set(
		HomeworkController::class,
		function ( $container ) {
			$lessonRepository = $container->get( LessonRepository::class );
			$entityRepository = $container->get( EntityRepository::class );
			$logger           = $container->get( 'appLogger' );

			return new HomeworkController( $lessonRepository, $entityRepository, $logger );
		}
	);
};
