<?php
use Slim\App;
use Slim\Routing\RouteCollectorProxy;
use App\Controllers\HomeworkController;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Services\StripeService;
use Stripe\Event;

return function (App $app) {
    $app->group(
        '/homework', function (RouteCollectorProxy $group) {
            $group->get(
                '/{entity_id}/{homework_key}',
                [HomeworkController::class, 'getHomework']
            );
        }
    );

    $app->post(
        '/create-checkout-session', function ( $request, $response) {
            $data = $request->getParsedBody();
            $priceId = $data['priceId'] ?? '';

            if (empty($priceId)) {
                return $response
                    ->withStatus(400)
                    ->withJson(['error' => 'Price ID is required']);
            }

            $result = StripeService::createCheckoutSession($priceId);

            if (isset($result['error'])) {
                return $response->withStatus(500)->withJson($result);
            }

            return $response->withJson($result);
        }
    );

    $app->post(
        '/stripe-webhooks', function (Request $request, Response $response) {
            $payload = @file_get_contents('php://input');
            $event = null;
            try{
                $event = Event::constructFrom(
                    json_decode($payload, true)
                );
            } catch(\UnexpectedValueException $e){
                http_response_code(400);
                exit();
            }

            lv($event);


            return $response->withStatus(200);
        }
    );

    // Catch all route
    $app->any(
        '{route:.*}', function (Request $request, Response $response) {
            return $response
                ->withHeader('Location', 'https://eleno.net')
                ->withStatus(302);
        }
    );

};
