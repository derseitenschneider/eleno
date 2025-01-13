<?php

namespace App\Services\Stripe\DTO;

use Stripe\Checkout\Session;

class StripeCheckoutCompletedDTO {
	public function __construct(
		public readonly string $userId,
		public readonly string $customerId,
		public readonly ?string $subscriptionId,
		public readonly ?string $invoiceId,
		public readonly string $subscriptionStatus,
		public readonly string $paymentStatus,
		public readonly int $amount,
		public readonly string $currency
	) {}

	public static function create( Session $session ): self {
		$isLifetime = empty( $session->subscription );

		return new self(
			userId: $session->client_reference_id,
			customerId: $session->customer,
			subscriptionId: $session->subscription,
			invoiceId: $session->invoice,
			subscriptionStatus: $isLifetime ? 'lifetime' : 'active',
			paymentStatus: $session->payment_status,
			amount: $session->amount_total,
			currency: $session->currency
		);
	}
}
