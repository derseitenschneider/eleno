<?php
namespace App\Repositories;

use App\Database\Database;

class SubscriptionRepository {
	private $table = 'stripe_subscriptions';

	public function __construct( private Database $db ) {
	}

	public function getSubscriptionStatus( string $userId ) {
		$results = $this->db->query(
			"
            SELECT subscription_status 
            FROM {$this->table} 
            WHERE user_id = $1
            ",
			array( $userId )
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
		$data  = array( 'subscription_status' => 'active' );
		$where = array( 'stripe_subscription_id' => $subscription_id );

		$response = $this->db->update(
			table: $this->table,
			data:  $data,
			where: $where
		);

		return $response;
	}

	public function cancelSubscription( string $subscription_id ) {
		$data  = array( 'subscription_status' => 'canceled' );
		$where = array( 'stripe_subscription_id' => $subscription_id );

		$response = $this->db->update(
			table: $this->table,
			data:  $data,
			where: $where
		);

		return $response;
	}
}
