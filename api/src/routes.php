<?php
use Slim\App;
use Slim\Routing\RouteCollectorProxy;
use App\Controllers\HomeworkController;
use App\Controllers\StripeController;
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

			// Cancel at period end
			$group->post(
				'/subscriptions/{subscription_id}/cancel',
				array( StripeController::class, 'cancelAtPeriodEnd' )
			);

			// Reactivate subscription
			$group->post(
				'/subscriptions/{subscription_id}/reactivate',
				array( StripeController::class, 'handleReactivation' )
			);

			// // Checkout Sessions
			$group->post(
				'/sessions/create/payment-session',
				array( StripeService::class, 'createPaymentSession' )
			);

			// Customer portal
			$group->post(
				'/customers/{customer_id}/portal',
				array( StripeController::class, 'createCustomerPortal' )
			);

			// Invoice link
			$group->post(
				'/customers/{customer_id}/invoice',
				array( StripeController::class, 'getInvoice' )
			);

			// Delete customer
			$group->delete(
				'/customers/{customer_id}',
				array( StripeService::class, 'deleteCustomer' )
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
