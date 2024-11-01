<?php

namespace App\Services;

use GuzzleHttp\Exception\GuzzleException;
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
            /** @var Invoice $invoice */
            $invoice =  $event->data->object;
            $this->_handleCreatePayment($invoice);
            break;

        case 'checkout.session.completed':
            /** @var Session $chekoutSession */
            $checkoutSession = $event->data->object;
            $this->_handleCheckoutCompleted($checkoutSession);
            break;

        case 'customer.subscription.created':
            /** @var Subscription $subscription */
            $subscription = $event->data->object;
            $this->_handleCreateSubscription($subscription);
            break;
        }
        return $response->withStatus(200);
    }

    /**
     * Handle webhook invoice.paid
     *
     * @param Invoice $invoice 
     */
    private function _handleCreatePayment(Invoice $invoice)
    {
        $this->supabase->createPayment($invoice);
    }

    /**
     * Handle webhook checkout.session.completed
     *
     * @param Session $session 
     */
    private function _handleCheckoutCompleted(Session $session)
    {
        $this->supabase->completeCheckout($session);
    }

    /**
     * Handle webhook customer.subscription.created
     *
     * @param Subscription $subscription 
     */
    private function _handleCreateSubscription(Subscription $subscription)
    {
        $subscription->status = 'pending';
        $this->supabase->createSubscription($subscription);
    }
}
