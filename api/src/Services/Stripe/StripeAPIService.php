<?php

namespace App\Services\Stripe;

use App\Config\Config;
use App\Services\Stripe\DTO\CheckoutSessionDTO;
use App\Services\Stripe\DTO\StripeCheckoutCompletedDTO;
use App\Services\Stripe\DTO\StripeSessionDTO;
use Stripe\Checkout\Session;
use Stripe\Collection;
use Stripe\PaymentMethod;
use Stripe\StripeClient;
use Stripe\Subscription;

/** @package App\Services\Stripe */
class StripeAPIService
{
    private StripeClient $client;

    /**
     * Sets the stripe client.
     *
     * @param Config $config
     * @return void
     */
    public function __construct(private Config $config)
    {
        $this->client = new StripeClient($this->config->stripeSecretKey);
    }

    public function getInvoiceUrl(string $invoiceId): string
    {
        return $this->client->invoices->retrieve($invoiceId)->hosted_invoice_url ?? '';
    }

    public function createSession(CheckoutSessionDTO $sessionDTO): Session
    {

        $args = array(
            'billing_address_collection' => 'required',
            'cancel_url'                 => $sessionDTO->cancelUrl,
            'consent_collection'         => array(
                'terms_of_service' => 'required',
            ),
            'client_reference_id'        => $sessionDTO->userId,
            'customer'                   => $sessionDTO->stripeCustomerId,
            'currency'                   => $sessionDTO->currency,
            'line_items'                 => array(
                array(
                    'price'    => $sessionDTO->priceId,
                    'quantity' => 1,
                ),
            ),
            'locale'                     => $sessionDTO->locale,
            'mode'                       => $sessionDTO->mode,
            'success_url'                => $sessionDTO->succesUrl,
        );

        if ('payment' === $sessionDTO->mode) {
            $args['invoice_creation'] = array(
                'enabled' => true,
            );
        }

        $session = $this->client->checkout->sessions->create($args);

        return $session;
    }

    public function deleteCustomer(string $customerId)
    {
        $this->client->customers->delete($customerId);
    }

    public function cancelSubscription(string $subscriptionId)
    {
        $this->client->subscriptions->cancel($subscriptionId);
    }

    public function cancelAllSubscriptions(string $customerId)
    {
        $args          = array(
            'customer' => $customerId,
            'status'   => 'active',
        );
        $subscriptions = $this->client->subscriptions->all($args);

        foreach ($subscriptions->data as $subscription) {
            $this->client->subscriptions->cancel($subscription->id,);
        }
    }

    public function updateSubscription(
        string $subscriptionId,
        array $params
    ): Subscription {
        return $this->client->subscriptions->update($subscriptionId, $params);
    }

    public function getSubscription(string $subscriptionId): Subscription
    {
        return $this->client->subscriptions->retrieve($subscriptionId);
    }

    public function createCustomerPortal(
        string $customerId,
        string $locale
    ) {
        $returnUrl = $this->config->appBaseUrl . '/settings/subscription';
        $args      = array(
            'customer'   => $customerId,
            'locale'     => $locale,
            'return_url' => $returnUrl,
        );

        return $this->client->billingPortal->sessions->create($args);
    }
    public function createCustomer($userId, $email)
    {
        $params = array(
            'email' => $email,
            'metadata' => array(
                'uid' => $userId
            )
        );
        $this->client->customers->create($params);
    }
}
