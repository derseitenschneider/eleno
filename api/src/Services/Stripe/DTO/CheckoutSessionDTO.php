<?php

namespace App\Services\Stripe\DTO;

use Stripe\Checkout\Session;

class CheckoutSessionDTO {
	public function __construct(
		public readonly string $userId,
		public readonly string $stripeCustomerId,
		public readonly string $priceId,
		public readonly string $mode,
		public readonly string $locale,
		public readonly string $currency,
		public readonly string $cancelUrl,
		public readonly string $succesUrl,
	) {}

	public static function create(
		string $userId,
		string $stripeCustomerId,
		string $priceId,
		string $mode,
		string $locale,
		string $currency,
		string $cancelUrl,
		string $succesUrl,
	): self {
		return new self(
			userId: $userId,
			stripeCustomerId: $stripeCustomerId,
			priceId: $priceId,
			mode: $mode,
			locale: $locale,
			currency: $currency,
			cancelUrl: $cancelUrl,
			succesUrl: $succesUrl,
		);
	}
}
