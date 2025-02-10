<?php

namespace App\Services\Stripe;

use App\Services\Message\Handlers\FirstTimeSubscriptionHandler;
use App\Services\Message\Handlers\PaymentFailedMessageHandler;
use App\Services\Stripe\DTO\StripeCheckoutCompletedDTO;
use App\Services\Stripe\DTO\StripeSubscriptionUpdatedDTO;
use App\Services\SupabaseService;

/** @package App\Services\Stripe */
class StripeRepository {
	public function __construct(
		private SupabaseService $supabase,
		private FirstTimeSubscriptionHandler $firstTimeSubscriptionHandler,
		private PaymentFailedMessageHandler $paymentFailedMessageHandler
	) {}

	public function handlePaymentFailed( string $stripeCustomer, string $firstName ) {
		$data   = $this->supabase->get(
			endpoint:'stripe_subscriptions',
			query: array(
				'select'             => 'user_id',
				'stripe_customer_id' => 'eq.' . $stripeCustomer,
			)
		);
		$userId = $data['data'][0]['user_id'];

		$this->paymentFailedMessageHandler->handle( $userId, $firstName );
	}

	public function saveCheckoutSession( StripeCheckoutCompletedDTO $session ): array {
		$statusBeforeUpdate = $this->supabase->getSubscriptionStatus( $session->userId );

		// Handle first time subscription.
		if ( $statusBeforeUpdate === 'trial' ) {
			$this->firstTimeSubscriptionHandler->handle( $session );
		}

		return $this->supabase->updateSubscription(
			query: array(
				'user_id' => 'eq.' . $session->userId,
			),
			data: array(
				'stripe_subscription_id' => $session->subscriptionId,
				'stripe_invoice_id'      => $session->invoiceId,
				'subscription_status'    => $session->subscriptionStatus,
				'payment_status'         => $session->paymentStatus,
				'currency'               => $session->currency,
				'is_lifetime'            => $session->isLifetime,
			)
		);
	}
	public function saveSubpscriptionUpdated( StripeSubscriptionUpdatedDTO $subscription ): array {
		return $this->supabase->updateSubscription(
			query: array(
				'stripe_customer_id' => 'eq.' . $subscription->stripe_customer_id,
			),
			data: array(
				'period_start'         => $subscription->period_start,
				'period_end'           => $subscription->period_end,
				'plan'                 => $subscription->plan,
				'subscription_status'  => $subscription->subscription_status,
				'cancel_at_period_end' => $subscription->cancel_at_period_end,
			)
		);
	}
}
