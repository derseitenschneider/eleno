<?php
use Slim\App;
use Slim\Routing\RouteCollectorProxy;
use App\Controllers\HomeworkController;
use App\Controllers\Stripe\CustomerController;
use App\Controllers\Stripe\SessionController;
use App\Controllers\Stripe\SubscriptionController;
use App\Controllers\WebhookController;
use App\Middleware\CustomerAccessMiddleware;
use App\Middleware\JWTAuthMiddleware;
use App\Middleware\SessionAccessMiddleware;
use App\Middleware\SubscriptionAccessMiddleware;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Services\StripeService;
use Stripe\Customer;

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
		'/stripe',
		function ( RouteCollectorProxy $group ) {
			// Subscriptions with access middleware.
			$group->group(
				'/subscriptions/{subscription_id}',
				function ( RouteCollectorProxy $group ) {
					$group->post(
						'/cancel',
						array( SubscriptionController::class, 'cancelAtPeriodEnd' )
					);

					$group->post(
						'/reactivate',
						array( SubscriptionController::class, 'handleReactivation' )
					);
				}
			)->add( SubscriptionAccessMiddleware::class );

			// Session with access middleware
			$group->group(
				'/session',
				function ( RouteCollectorProxy $group ) {

					$group->post(
						'/create',
						array( SessionController::class, 'createSession' )
					);
				}
			)->add( SessionAccessMiddleware::class );

			// Customer with access middleware
			$group->group(
				'/customers/{customer_id}',
				function ( RouteCollectorProxy $group ) {

					$group->post(
						'/portal',
						array( CustomerController::class, 'createPortal' )
					);

					$group->post(
						'/invoice',
						array( CustomerController::class, 'getInvoice' )
					);

					$group->delete(
						'',
						array( CustomerController::class, 'deleteCustomer' )
					);
				}
			)->add( CustomerAccessMiddleware::class );
		}
	)->add( JWTAuthMiddleware::class );

	$app->post(
		'/stripe-webhooks',
		array( WebhookController::class, 'handleWebhook' )
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
