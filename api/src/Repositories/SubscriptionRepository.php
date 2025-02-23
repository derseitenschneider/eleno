<?php
namespace App\Repositories;

use App\Database\Database;
use App\Services\Stripe\DTO\StripeCheckoutCompletedDTO;
use App\Services\Stripe\DTO\StripeSubscriptionUpdatedDTO;

class SubscriptionRepository {
	private $table = 'stripe_subscriptions';

	public function __construct(
		private Database $db,
	) {
	}

	public function getSubscription( string $userId ) {
		$results = $this->db->query(
			"
            SELECT *
            FROM {$this->table}
            WHERE user_id = $1
            ",
			[ $userId ]
		);

		return $results;
	}

	public function getSubscriptionStatus( string $userId ) {
		$results = $this->db->query(
			"
            SELECT subscription_status 
            FROM {$this->table} 
            WHERE stripe_customer_id = $1
            ",
			[ $userId ]
		);

		return $results ? $results[0]['subscription_status'] ?? '' : '';
	}

	public function updateSubscription( array $data, array $where ) {
		$response = $this->db->update(
			table: $this->table,
			data: $data,
			where: $where
		);
		return $response;
	}

	public function reactivateSubscription( string $subscription_id ) {
		$data  = [ 'subscription_status' => 'active' ];
		$where = [ 'stripe_subscription_id' => $subscription_id ];

		$response = $this->db->update(
			table: $this->table,
			data:  $data,
			where: $where
		);

		return $response;
	}

	public function cancelSubscription( string $subscription_id ) {
		$data  = [ 'subscription_status' => 'canceled' ];
		$where = [ 'stripe_subscription_id' => $subscription_id ];

		$response = $this->db->update(
			table: $this->table,
			data:  $data,
			where: $where
		);

		return $response;
	}

	public function saveCheckoutSession( StripeCheckoutCompletedDTO $session ): bool {

		return $this->updateSubscription(
			where: [ 'user_id' => $session->userId ],
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

	public function saveSubpscriptionUpdated( StripeSubscriptionUpdatedDTO $subscription ): bool {
		return $this->updateSubscription(
			where:[ 'stripe_customer_id' => $subscription->stripe_customer_id ],
			data: array(
				'period_start'         => $subscription->period_start,
				'period_end'           => $subscription->period_end,
				'plan'                 => $subscription->plan,
				'subscription_status'  => $subscription->subscription_status,
				'cancel_at_period_end' => $subscription->cancel_at_period_end,
			)
		);
	}

	public function bumpFailedPaymentAttempts( string $customer, int $prevValue ) {
		$this->updateSubscription(
			data: [ 'failed_payment_attempts' => $prevValue++ ],
			where: [ 'stripe_customer_id' => $customer ]
		);
	}

	public function resetFailedPaymentAttempts( string $customer ) {
		$this->updateSubscription(
			data: [ 'failed_payment_attempts' => null ],
			where: [ 'stripe_customer_id' => $customer ]
		);
	}
}
