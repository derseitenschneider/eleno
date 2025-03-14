<?php
/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind a different classes or traits.
|
*/

// pest()->extend(Tests\TestCase::class)->in('Feature');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/


expect()->extend(
	'toBeOne',
	function () {
		return $this->toBe( 1 );
	}
);

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

use Stripe\Customer;
use Tests\Helpers\TestUsers;

/**
 * @param string $email
 * @return mixed $user
 */
function createTestUser( $email = null ) {
	return TestUsers::createUser( $email );
}

/**
 * @param string $userId
 * @return true
 */
function deleteTestUser( string $userId ) {
	return TestUsers::deleteUser( $userId );
}

/**
 * @param string $email
 * @param string $userId
 *
 * @return Customer
 */
function createStripeCustomer( string $email, string $userId ) {
	return TestUsers::createStripeCustomer( email: $email, userId: $userId );
}

/**
 * @param string $customerId
 *
 * @return true
 */
function deleteStripeCustomer( string $customerId ) {
	return TestUsers::deleteStripeCustomer( customerId: $customerId );
}

/**
 * @param string $name
 * @param string $customerId
 * @param string $userId
 * @param string $locale
 * @return void
 */
function runFixture(
	string $name,
	string $customerId,
	string $userId,
	string $locale
) {
		$fixtureFilePath = __DIR__ . "/stripe-fixtures/{$name}.json";

		// Construct the Stripe CLI command with environment variables
		$command = sprintf(
			'CUSTOMER_ID=%s USER_ID=%s LOCALE=%s stripe fixtures %s',
			escapeshellarg( $customerId ),
			escapeshellarg( $userId ),
			escapeshellarg( $locale ),
			escapeshellarg( $fixtureFilePath )
		);

		// Execute the command
		$output     = [];
		$returnCode = 0;
		exec( $command, $output, $returnCode );

		// Handle the output
	if ( 0 === $returnCode ) {
		echo "Stripe CLI fixture executed successfully!\n";
		foreach ( $output as $line ) {
			echo $line . "\n";
		}
	} else {
		echo 'Stripe CLI fixture execution failed with code: ' . $returnCode . "\n";
		foreach ( $output as $line ) {
			echo $line . "\n";
		}
	}
}
