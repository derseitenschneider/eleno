<?php
use Slim\App;
use Slim\Routing\RouteCollectorProxy;
use App\Controllers\HomeworkController;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Services\StripeService;

return function ( App $app ) {
	$app->group(
		'/homework',
		function ( RouteCollectorProxy $group ) {
			$group->get(
				'/{entity_id}/{homework_key}',
				array( HomeworkController::class, 'getHomework' )
			);
		}
	);

	$app->post(
		'/stripe-webhooks',
		array( StripeService::class, 'handleWebhook' )
	);

	$app->delete(
		'/subscriptions/{subscription_id}',
		array( StripeService::class, 'handleDelete' )
	);

	$app->any(
		'{route:.*}',
		function ( Request $request, Response $response ) {
			return $response
				->withHeader( 'Location', 'https://eleno.net' )
				->withStatus( 302 );
		}
	);
};
