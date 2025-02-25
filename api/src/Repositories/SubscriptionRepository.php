<?php
namespace App\Repositories;

use App\Database\Database;
use App\Services\Stripe\DTO\StripeCheckoutCompletedDTO;
use App\Services\Stripe\DTO\StripeSubscriptionUpdatedDTO;
use Exception;

class SubscriptionRepository {
	private $table = 'stripe_subscriptions';

	public function __construct(
		private Database $db,
	) {
	}

	/**
	 * Get subscription
	 *
	 * Takes either the userId or the customerId and returns the subscription
	 * or null.
	 *
	 * @param string|null $userId The database user_id.
	 * @param string|null $customerId The stripe customer id.
	 *
	 * @return array|null The subscription object or null.
	 * @throws Exception
	 */
	public function getSubscription(
		string $userId = null,
		string $customerId = null
	) {
		if ( $userId === null && $customerId === null ) {
			throw new \Exception( 'Must provide userId or customerId' );
		}

		$sql     = "SELECT * FROM {$this->table} WHERE ";
		$sql    .= $userId ? 'user_id = $1' : 'stripe_customer_id = $1';
		$results = $this->db->query( $sql, [ $userId ?? $customerId ] );

		if ( count( $results ) > 0 ) {
			$subscription = $results[0];
			return $subscription;
		} else {
			return null;
		}
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
				'period_start'        => $subscription->period_start,
				'period_end'          => $subscription->period_end,
				'plan'                => $subscription->plan,
				'subscription_status' => $subscription->subscription_status,
			)
		);
	}

	/**
	 * Bump failed payment attempts
	 *
	 * Bumps the failed payment attempts in the database and sets the
	 * subscrition status to "expired".
	 *
	 * @param string $customer
	 * @param int    $prevValue
	 */
	public function bumpFailedPaymentAttempts( string $customer, int $prevValue ) {
		$newValue = $prevValue + 1;
		$result   = $this->updateSubscription(
			data: [
				'failed_payment_attempts' => $newValue ,
				'subscription_status'     => 'expired',
			],
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
