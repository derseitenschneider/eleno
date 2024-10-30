<?php

namespace App\Services;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Stripe\Checkout\Session;
use Stripe\Stripe;
use Stripe\Event;
use Stripe\Invoice;
use Stripe\Subscription;

class StripeService
{

    public function __construct(private SupabaseService $supabase)
    {
    }

    public static function initialize()
    {
        Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);
    }

    public function handleWebhook(Request $request, Response $response)
    {

        $payload = @file_get_contents('php://input');
        $event = null;

        try {
            $event = Event::constructFrom(
                json_decode($payload, true)
            );
        } catch (\UnexpectedValueException $e) {
            echo 'Webhook error while parsing basic request.' . $e->getMessage();
            http_response_code(400);
            exit();
        }

        switch ($event->type) {
        case 'invoice.paid':
            /**
             * @var Invoice $invoice 
              */
            $invoice =  $event->data->object;
            $this->_handleCreatePayment($invoice);
            break;

        // case 'checkout.session.completed':
        //     $checkoutSession = new Session($event->data->object);
        //     $this->_handleCreateStripeCustomer($checkoutSession);
        //
        //     if ('subscription' === $checkoutSession->mode) {
        //         $this->_handleCreateSubscription($checkoutSession);
        //     }
        //     break;
        case 'customer.subscription.created':
            /**
 * @var Subscription $subscription 
*/
            $subscription = $event->data->object;
            $this->_handleCreateSubscription($subscription);
            break;
        }
        return $response->withStatus(200);
    }

    private function _handleCreatePayment(Invoice $invoice)
    {
        $this->supabase->createPayment($invoice);
    }

    private function _handleCreateStripeCustomer(Session $session)
    {
        $user_id = $session->client_reference_id;
        $stripe_customer_id = $session->customer;

        $this->supabase->createStripeCustomer($user_id, $stripe_customer_id);
    }

    private function _handleCreateSubscription(Subscription $subscription)
    {
        $subscription->status = 'pending';
        $this->supabase->createSubscription($subscription);
    }
}
