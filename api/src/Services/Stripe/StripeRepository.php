<?php

namespace App\Services\Stripe;

use App\Services\Stripe\DTO\StripeSubscriptionDTO;
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

	public function saveCheckoutSession( StripeSubscriptionDTO $subscription ): array {
		return $this->supabase->updateSubscription(
			$subscription->userId,
			array(
				'stripe_customer_id'     => $subscription->customerId,
				'stripe_subscription_id' => $subscription->subscriptionId,
				'stripe_invoice_id'      => $subscription->invoiceId,
				'payment_type'           => $subscription->paymentType,
				'subscription_status'    => $subscription->subscriptionStatus,
				'payment_status'         => $subscription->paymentStatus,
				'amount'                 => $subscription->amount,
				'currency'               => $subscription->currency,
				'updated_at'             => date( 'Y-m-d H:i:s' ),
			)
		);
	}
	public function saveSubpscriptionUpdate( StripeSubscriptionDTO $subscription ): array {
		return $this->supabase->updateSubscription(
			$subscription->userId,
			array(
				'stripe_subscription_id' => $subscription->subscriptionId,
				'stripe_invoice_id'      => $subscription->invoiceId,
				'payment_type'           => $subscription->paymentType,
				'subscription_status'    => $subscription->subscriptionStatus,
				'payment_status'         => $subscription->paymentStatus,
				'amount'                 => $subscription->amount,
				'currency'               => $subscription->currency,
				'updated_at'             => date( 'Y-m-d H:i:s' ),
			)
		);
	}
}
