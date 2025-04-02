<?php

namespace App\Services\Stripe\DTO;

use Stripe\Checkout\Session;

class StripeCheckoutCompletedDTO {
	/**
	 *  Construct
	 *
	 *  The class constructor.
	 *
	 * @param string      $userId
	 * @param string      $customerId
	 * @param null|string $subscriptionId
	 * @param null|string $invoiceId
	 * @param bool        $isLifetime
	 * @param string      $subscriptionStatus
	 * @param string      $paymentStatus
	 * @param string      $currency
	 * @param string      $locale
	 */
	public function __construct(
		public readonly string $userId,
		public readonly string $customerId,
		public readonly ?string $subscriptionId,
		public readonly ?string $invoiceId,
		public readonly bool $isLifetime,
		public readonly string $subscriptionStatus,
		public readonly string $paymentStatus,
		public readonly string $currency,
		public readonly string $locale
	) {}

	/**
	 * Create
	 *
	 * Create the dto.
	 *
	 * @param Session $session
	 */
	public static function create( Session $session ): self {
		return new self(
			userId: $session->client_reference_id,
			customerId: $session->customer,
			subscriptionId: $session->subscription,
			invoiceId: $session->invoice,
			subscriptionStatus:  'active',
			paymentStatus: $session->payment_status,
			currency: $session->currency,
			isLifetime:empty( $session->subscription ),
			locale: $session->locale
		);
	}
}
