<?php
namespace Tests\Utils;

require_once __DIR__ . '/../bootstrap.php';

use App\Config\Config;
use App\Database\Database;
use App\Services\Stripe\StripeAPIService;
use Stripe\Customer;
use Stripe\Exception\ApiErrorException;

class StripeTestManager {

	/** @var StripeAPIService $stripeApi */
	private $stripeApi;

	/** @var Database $db */
	private $db;

	/**
	 * @return void
	 */
	public function __construct() {
		$config          = new Config();
		$this->stripeApi = new StripeAPIService( $config );
		$this->db        = new Database( $config );
	}

	/**
	 * @param string $userId
	 * @param string $email
	 * @return Customer
	 * @throws ApiErrorException Stripe Error/Exception.
	 */
	public function createCustomer( string $userId, string $email ) {
		echo "Creating stripe test customer with email: {$email}...\n";
		$customer = $this->stripeApi->createCustomer( userId: $userId, email: $email );
		echo "Stripe test customer created!\n";

		// $this->createSubscriptionRow( customer: $customer, userId: $userId );

		return $customer;
	}

	/**
	 * @param string $customerId
	 * @return true
	 * @throws ApiErrorException Stripe Error/Exception.
	 */
	public function deleteCustomer( string $customerId ) {
		echo "Deleting stripe test customer with id: {$customerId}\n";
		$this->stripeApi->deleteCustomer( $customerId );
		echo "Stripe test customer deleted!\n";
		return true;
	}

	/**
	 * @param Customer $customer
	 * @param string   $userId
	 * @return void
	 */
	private function createSubscriptionRow( Customer $customer, string $userId ) {
		echo "Creating stripe_subscription row for test user with id: {$userId}\n";
		$periodStart = date( 'Y-m-d' );
		$periodEnd   = date( 'Y-m-d', strtotime( '+30 days' ) );

		$data = array(
			'user_id'             => $userId,
			'stripe_customer_id'  => $customer->id,
			'period_start'        => $periodStart,
			'period_end'          => $periodEnd,
			'subscription_status' => 'trial',
		);
		try {

			$this->db->insert(
				table: 'stripe_subscriptions',
				data: $data
			);
			echo "Creating stripe_subscription row for test user with id: {$userId}\n";
		} catch ( \Exception $e ) {
			echo "Error creating stripe_subscription row for test user with id {$userId}:\n
			$e\n";
		}
	}
}
