<?php

namespace App\Services;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Stripe\Checkout\Session;
use Stripe\Stripe;
use Stripe\Event;
use Stripe\Invoice;
use Stripe\PaymentIntent;
use Stripe\Service\Checkout\CheckoutServiceFactory;

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
             * The invoice object.
               *
             * @var Invoice $invoice 
              */
            $invoice =  $event->data->object;
            $this->_handleCreatePayment($invoice);
            break;

        case 'checkout.session.completed':
            $checkoutSession = new Session($event->data->object);
            $this->_handleCreateStripeCustomer($checkoutSession);

            if ('subscription' === $checkoutSession->mode) {
                $this->_handleCreateSubscription($checkoutSession);
            }
            break;
        }


        return $response->withStatus(200);
    }

    private function _handleCreatePayment(Invoice $invoice)
    {
        logDebug($invoice->customer);
        // Update table payments
        $attrs = array(
        'stripe_customer_id' => $invoice->customer,
        'stripe_invoice_id' => $invoice->lines->data[0]->invoice,
        'stripe_product_id' => $invoice->lines->data[0]->price->product,
        'amount' => $invoice->amount_paid,
        'currency' => $invoice->currency,
        'status' => $invoice->status
        );

        $this->supabase->createPayment(...$attrs);
    }

    private function _handleCreateStripeCustomer(Session $session)
    {
        $user_id = $session->client_reference_id;
        $stripe_customer_id = $session->customer;

        $this->supabase->createStripeCustomer($user_id, $stripe_customer_id);
    }

    private function _handleCreateSubscription(Session $session)
    {
        $attrs = array(
        'user_id' => $session->client_reference_id,
        'stripe_subscription_id' => $session->subscription,
        'status' => $session->status,
        'current_period_start' => $session->created,
        'current_period_end' => $session->after_expiration
        );
    }
}
