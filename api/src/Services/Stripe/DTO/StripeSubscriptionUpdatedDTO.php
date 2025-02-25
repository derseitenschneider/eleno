<?php

namespace App\Services\Stripe\DTO;

use Stripe\Subscription;
use Stripe\SubscriptionItem;

class StripeSubscriptionUpdatedDTO {
	public function __construct(
		public readonly string $period_start,
		public readonly string $period_end,
		public readonly string $stripe_customer_id,
		public readonly string $plan,
		public readonly string $subscription_status,
	) {
	}

	public static function create( Subscription $subscription ): self {
		return new self(
			period_start: date( 'Y-m-d H:i:s', $subscription->current_period_start ),
			period_end: date( 'Y-m-d H:i:s', $subscription->current_period_end ),
			stripe_customer_id: $subscription->customer,
			plan: $subscription->plan->interval,
			subscription_status: $subscription->status,
		);
	}
}
