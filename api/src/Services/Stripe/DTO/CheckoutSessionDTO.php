<?php

namespace App\Services\Stripe\DTO;

use Stripe\Checkout\Session;

class CheckoutSessionDTO {
	/**
	 * Construct
	 *
	 * The class constructor.
	 *
	 * @param string $userId
	 * @param string $stripeCustomerId
	 * @param string $priceId
	 * @param string $mode
	 * @param string $locale
	 * @param string $currency
	 * @param string $cancelUrl
	 * @param string $succesUrl
	 */
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

	/**
	 * Create
	 *
	 * Create the dto.
	 *
	 * @param string $userId
	 * @param string $stripeCustomerId
	 * @param string $priceId
	 * @param string $mode
	 * @param string $locale
	 * @param string $currency
	 * @param string $cancelUrl
	 * @param string $succesUrl
	 * @return CheckoutSessionDTO
	 */
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
