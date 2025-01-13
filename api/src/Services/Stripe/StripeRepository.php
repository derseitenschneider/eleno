<?php

namespace App\Services\Stripe;

use App\Services\Stripe\DTO\StripeCheckoutCompletedDTO;
use App\Services\Stripe\DTO\StripeSubscriptionUpdatedDTO;
use App\Services\SupabaseService;

class StripeRepository {
	public function __construct(
		private SupabaseService $supabase
	) {}

	public function updateSubscriptionStatus( string $subscriptionId, string $status ): array {
		return match ( $status ) {
			'canceled' => $this->supabase->cancelSubscription( $subscriptionId ),
			'active' => $this->supabase->reactivateSubscription( $subscriptionId ),
			default => throw new \InvalidArgumentException( 'Invalid subscription status' )
		};
	}

	public function saveCheckoutSession( StripeCheckoutCompletedDTO $subscription ): array {
		return $this->supabase->updateSubscription(
			query_data: $subscription->userId,
			data: array(
				'stripe_subscription_id' => $subscription->subscriptionId,
				'stripe_invoice_id'      => $subscription->invoiceId,
				'subscription_status'    => $subscription->subscriptionStatus,
				'payment_status'         => $subscription->paymentStatus,
				'amount'                 => $subscription->amount,
				'currency'               => $subscription->currency,
			)
		);
	}
	public function saveSubpscriptionUpdated( StripeSubscriptionUpdatedDTO $subscription ): array {
		return $this->supabase->updateSubscription(
			query_data: $subscription->stripe_customer_id,
			query_field: 'stripe_customer_id',
			data: array(
				'period_start'        => $subscription->period_start,
				'period_end'          => $subscription->period_end,
				'plan'                => $subscription->plan,
				'subscription_status' => $subscription->subscription_status,
			)
		);
	}
}
