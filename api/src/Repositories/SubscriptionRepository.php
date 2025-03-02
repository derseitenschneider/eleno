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
		?string $userId = null,
		?string $customerId = null
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

	/**
	 * Get subscription status
	 *
	 * Retrieves the subscription status from the database.
	 *
	 * @param string $userId
	 */
	public function getSubscriptionStatus( string $userId ): ?string {
		$results = $this->db->query(
			"
            SELECT subscription_status 
            FROM {$this->table} 
            WHERE stripe_customer_id = $1
            ",
			[ $userId ]
		);

		return $results ? $results[0]['subscription_status'] ?? '' : null;
	}

	/**
	 *  Update subscription
	 *
	 * @param array $data
	 * @param array $where
	 */
	public function updateSubscription( array $data, array $where ): bool {
		$response = $this->db->update(
			table: $this->table,
			data: $data,
			where: $where
		);
		return $response;
	}

	/**
	 * Reactivate subscription
	 *
	 * Sets the subscription status to "active".
	 *
	 * @param string $subscription_id
	 */
	public function reactivateSubscription( string $subscription_id ): bool {
		$data  = [ 'subscription_status' => 'active' ];
		$where = [ 'stripe_subscription_id' => $subscription_id ];

		$response = $this->db->update(
			table: $this->table,
			data:  $data,
			where: $where
		);

		return $response;
	}

	/**
	 * Cancel subscription
	 *
	 * Sets the subscription status to "canceled".
	 *
	 * @param string $subscription_id
	 */
	public function cancelSubscription( string $subscription_id ): bool {
		$data  = [ 'subscription_status' => 'canceled' ];
		$where = [ 'stripe_subscription_id' => $subscription_id ];

		$response = $this->db->update(
			table: $this->table,
			data:  $data,
			where: $where
		);

		return $response;
	}

	/**
	 * Save checkout session
	 *
	 * Saves checkout session to the database.
	 *
	 * @param StripeCheckoutCompletedDTO $session
	 */
	public function saveCheckoutSession( StripeCheckoutCompletedDTO $session ): bool {
		$data = array(
			'stripe_subscription_id' => $session->subscriptionId,
			'stripe_invoice_id'      => $session->invoiceId,
			'subscription_status'    => $session->subscriptionStatus,
			'payment_status'         => $session->paymentStatus,
			'currency'               => $session->currency,
		);

		if ( $session->isLifetime ) {
			$data['plan']         = 'lifetime';
			$data['period_start'] = null;
			$data['period_end']   = null;
		}

		return $this->updateSubscription(
			where: [ 'user_id' => $session->userId ],
			data:$data
		);
	}

	/**
	 * Save subscription update
	 *
	 * Saves subscription updates to the database.
	 *
	 * @param StripeSubscriptionUpdatedDTO $subscription
	 * @return bool
	 */
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
	public function bumpFailedPaymentAttempts( string $customer, int $prevValue ): bool {
		$data  = [
			'failed_payment_attempts' => $prevValue + 1,
			'subscription_status'     => 'expired',
		];
		$where = [ 'stripe_customer_id' => $customer ];
		return $this->updateSubscription( data: $data, where:  $where );
	}

	/**
	 * Reset failed payment attempts
	 *
	 * Sets failed payment attempts in the database back to 0.
	 *
	 * @param string $customer
	 */
	public function resetFailedPaymentAttempts( string $customer ): bool {
		return $this->updateSubscription(
			data: [ 'failed_payment_attempts' => 0 ],
			where: [ 'stripe_customer_id' => $customer ]
		);
	}
}
