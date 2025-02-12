<?php

use App\Controllers\HomeworkController;
use App\Services\SupabaseService;
use DI\Container;

return function ( Container $container ) {
	$container->set(
		HomeworkController::class,
		function ( $container ) {
			$supabaseService = $container->get( SupabaseService::class );

			return new HomeworkController( $supabaseService );
		}
	);
};
