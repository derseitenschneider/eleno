<?php

use Tests\Utils\SubscriptionStates;

beforeEach(
	function () {
		// Create a test user for each test
		$this->userEmail = 'webhook-test-' . uniqid() . '@example.com';

		$this->user           = createTestUser( $this->userEmail );
		$this->stripeCustomer = createStripeCustomer(
			email: $this->userEmail,
			userId: $this->user['id']
		);
	}
);

it(
	'correctly processes checkout.completed  webhook for monthly subscription',
	function () {
		runFixture(
			customerId: $this->stripeCustomer->id,
			userId: $this->user['id'],
			name: 'monthly-subscription',
			locale: 'de'
		);
		// // Wait for webhook processing (could be improved with polling)
		sleep( 2 );
		//
		// // Verify database state updated correctly
		expect( SubscriptionStates::verify( $this->user['id'], 'monthly-active' ) )->toBeTrue();
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

afterEach(
	function () {
		// deleteStripeCustomer( $this->stripeCustomer->id );
		// deleteTestUser( $this->user['id'] );
	}
);
