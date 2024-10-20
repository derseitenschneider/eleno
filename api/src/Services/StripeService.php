<?php

namespace App\Services;

use Psr\Http\Message\ResponseInterface as Response;
use Stripe\Stripe;
use Stripe\Event;

class StripeService
{

    public static function initialize()
    {
        Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);
    }

    public static function handleWebhook(Response $response)
    {

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

        logDebug($event);


        return $response->withStatus(200);
    }



    // Add more methods as needed for other Stripe operations
}
