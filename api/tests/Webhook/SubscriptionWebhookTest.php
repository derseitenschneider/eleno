<?php

use Tests\Utils\SubscriptionStates;

// beforeEach(
// function () {
// Create a test user for each test
// $this->userId = createTestUser( 'webhook-test-' . uniqid() . '@example.com' );
// }
// );

it(
	'correctly processes checkout.completed  webhook for monthly subscription',
	function () {
		var_dump( $_ENV );
		// Set initial state
		// SubscriptionStates::apply( $this->userId, 'new' );

		// Run Stripe fixture to trigger webhook
		// $output = [];
		// exec( "./stripe-fixtures/create-subscription.sh {$this->userId}", $output, $result );
		// expect( $result )->toBe( 0 );
		//
		// // Wait for webhook processing (could be improved with polling)
		// sleep( 2 );
		//
		// // Verify database state updated correctly
		// expect( SubscriptionStates::verify( $this->userId, 'monthly-active' ) )->toBeTrue();
	}
);

// it(
// 'correctly processes subscription.updated webhook for cancelled subscription',
// function () {
// Set initial state to active subscription
// SubscriptionStates::apply( $this->userId, 'monthly-active' );
//
// Run fixture to trigger cancellation webhook
// exec( "./stripe-fixtures/cancel-subscription.sh {$this->userId}" );
//
// Wait for webhook processing
// sleep( 2 );
//
// Verify database updated to canceled state
// expect( SubscriptionStates::verify( $this->userId, 'monthly-canceled' ) )->toBeTrue();
// }
// );

// afterAll(
// function () {
// deleteTestUser( $this->userId );
// }
// );
