<?php

namespace App\Services;

use Stripe\Stripe;
use Stripe\Checkout\Session;
use Stripe\Exception\ApiErrorException;

class StripeService
{

    public static function initialize()
    {
        Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);
    }

    static function createCheckoutSession(string $priceId)
    {
        try {
            $session = Session::create(
                [
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price' => $priceId,
                    'quantity' => 1,
                ]],
                'mode' => 'subscription',
                'success_url' => 'https://app.eleno.net/success?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => 'https://app.eleno.net/cancel',
                ]
            );

                   return ['id' => $session->id];
        } catch (ApiErrorException $e) {
            return ['error' => $e->getMessage()];
        }    
    }


    // Add more methods as needed for other Stripe operations
}
