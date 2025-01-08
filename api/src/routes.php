<?php
use Slim\App;
use Slim\Routing\RouteCollectorProxy;
use App\Controllers\HomeworkController;
use App\Middleware\JWTAuthMiddleware;
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

	$app->group(
		'',
		function ( RouteCollectorProxy $group ) {

			$group->delete(
				'/subscriptions/{subscription_id}',
				array( StripeService::class, 'handleCancelation' )
			);

			$group->patch(
				'/subscriptions/{subscription_id}',
				array( StripeService::class, 'handleReactivation' )
			);

			$group->get(
				'/customers/{customer_id}/payment-methods',
				array( StripeService::class, 'paymentMethods' )
			);
		}
	)->add( JWTAuthMiddleware::class );

	$app->post(
		'/stripe-webhooks',
		array( StripeService::class, 'handleWebhook' )
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
