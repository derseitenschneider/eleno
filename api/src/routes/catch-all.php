<?php
use Slim\App;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

return function ( App $app ) {
	// Catch all route redirecting to landing page.
	$app->any(
		'{route:.*}',
		function ( Request $request, Response $response ) {
			return $response
				->withHeader( 'Location', 'https://eleno.net' )
				->withStatus( 302 );
		}
	);
};
