<?php

/*
|--------------------------------------------------------------------------
| StripeService
|--------------------------------------------------------------------------
|
| This file contains the StripeService class, which provides a service for
| interacting with the Stripe API and the stripe_subscription table in the
| database.
|
*/

namespace App\Services;

use App\Repositories\SubscriptionRepository;
use App\Services\Message\Handlers\CancellationMessageHandler;
use App\Services\Message\Handlers\ReactivationMessageHandler;
use App\Services\Stripe\DTO\CheckoutSessionDTO;
use App\Services\Stripe\StripeAPIService;
use App\Services\Stripe\StripeRepository;
use InvalidArgumentException;
use Stripe\BillingPortal\Session as BillingPortalSession;
use Stripe\Checkout\Session;
use Stripe\Exception\ApiErrorException;

class StripeService
{
    /**
     * Sets up all dependencies.
     *
     * @param StripeAPIService           $stripeAPI                  Service to connect to the stripe API.
     * @param SubscriptionRepository     $repository                 Repository to connect to the subscription table in the database.
     * @param CancellationMessageHandler $cancellationMessageHandler Handler for cancellation message.
     * @param ReactivationMessageHandler $reactivationMessageHandler Handler for reactivation message.
     * @return void
     */
    public function __construct(
        private StripeAPIService $stripeAPI,
        private SubscriptionRepository $repository,
        private CancellationMessageHandler $cancellationMessageHandler,
        private ReactivationMessageHandler $reactivationMessageHandler,
    ) {
    }

    /**
     * Gets the invoice url for given invoice id.
     *
     * @param string $invoiceId The invoice id provided by stripe.
     *
     * @return string $invoiceUrl
     * @throws ApiErrorException Stripe exception when failed.
     */
    public function getInvoiceUrl(string $invoiceId): string
    {
        $invoiceUrl = $this->stripeAPI->getInvoiceUrl($invoiceId);
        return $invoiceUrl;
    }

    /**
     * Cancels all subscriptions and deletes the customer.
     *
     * @param string $customerId Stripe customer ID.
     *
     * @return void
     * @throws ApiErrorException Stripe exception when failed.
     */
    public function deleteCustomer(string $customerId): void
    {
        $this->stripeAPI->cancelAllSubscriptions($customerId);
        $this->stripeAPI->deleteCustomer($customerId);
    }

    /**
     * Creates a checkout session.
     *
     * @param CheckoutSessionDTO $sessionDTO DTO created from the CheckoutSession.
     *
     * @return Session
     * @throws ApiErrorException Stripe exception when failed.
     */
    public function createCheckoutSession(CheckoutSessionDTO $sessionDTO): Session
    {
        return $this->stripeAPI->createSession($sessionDTO);
    }

    /**
     * Creates a customer portal session.
     *
     * @param string $customerId Stripe customer id.
     * @param string $userLocale User locale received from the app.
     *
     * @return BillingPortalSession
     * @throws ApiErrorException Stripe exception when failed.
     */
    public function createCustomerPortal(
        string $customerId,
        string $userLocale
    ): BillingPortalSession {
            return $this->stripeAPI->createCustomerPortal($customerId, $userLocale);
    }

    /**
     * Cancels the subscription at the end of the period, updates the database
     * and sends the user a confirmation message.
     *
     * @param string $subscriptionId Stripe subscription ID.
     * @param string $userId         User ID from database.
     * @param string $firstName      Users first name.
     *
     * @return void
     * @throws ApiErrorException When stripe request fails.
     * @throws InvalidArgumentException Invalid arguments.
     */
    public function cancelAtPeriodEnd(
        string $subscriptionId,
        string $userId,
        string $firstName
    ): void {
        $this->stripeAPI->updateSubscription(
            $subscriptionId,
            array( 'cancel_at_period_end' => true )
        );

        $this->repository->cancelSubscription($subscriptionId);

        $this->cancellationMessageHandler->handle(
            userId: $userId,
            firstName:$firstName
        );
    }

    /**
     * Handle the reactivation after a cancelation.
     *
     * @param string $subscriptionId Stripe subscription ID.
     * @param string $userId         User ID from database.
     * @param string $firstName      Users first name.
     *
     * @return void
     * @throws ApiErrorException Exception for API errors.
     * @throws InvalidArgumentException Exception for missing arguments.
     */
    public function handleReactivation(
        string $subscriptionId,
        string $userId,
        string $firstName
    ) {
        $this->stripeAPI->updateSubscription(
            $subscriptionId,
            array( 'cancel_at_period_end' => false )
        );

        $this->repository->reactivateSubscription($subscriptionId);

        $this->reactivationMessageHandler->handle(
            userId: $userId,
            firstName: $firstName
        );
    }
}
