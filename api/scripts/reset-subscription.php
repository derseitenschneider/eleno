<?php

require_once __DIR__ . '/helpers/base.php';
require_once __DIR__ . '/functions.php';
require_once __DIR__ . '/functions/get-profile.php';
require_once __DIR__ . '/functions/delete-messages.php';

$args = parseArguments( $argv );

// User id
if ( isset( $args['userId'] ) ) {
	$userId = $args['userId'];
} else {
	$userId = 'c352cb96-41e4-47ac-81bd-a77bf7865c92';
}

// Dry run
if ( isset( $args['dry'] ) ) {
	$dry = true;
} else {
	$dry = false;
}

// Set subscription to dates in past (expired)
if ( isset( $args['expired'] ) ) {
	$expired = true;
} else {
	$expired = false;
}

if ( null === $userId ) {
	echo "Usage: php reset_user.php <user_id>\n";
	exit( 1 );
}

if ( $dry ) {
	echo "|--------------- START DRY RUN ---------------|\n\n";
}

// 1. Database Reset
echo "Fetching subscription from database.\n";
$stripeSubscription   = $repository->getSubscription( $userId );
$stripeSubscriptionId = $stripeSubscription['stripe_subscription_id'] ?? '';
$stripeCustomerId     = $stripeSubscription['stripe_customer_id'];

echo "Found subscription:\n\n";
echo json_encode( $stripeSubscription, JSON_PRETTY_PRINT ) . "\n\n";
echo "Subscription ID: {$stripeSubscriptionId}\n";
echo "Customer ID: {$stripeCustomerId}\n";
if ( $expired ) {
	expirePeriod( userId: $userId, repo: $repository, dry: $dry );
} else {
	renewPeriod( userId: $userId, repo: $repository, dry: $dry );
}

$userProfile = getProfile( userId: $userId, db: $db );

if ( $dry ) {
	echo "|--------------- END DRY RUN ---------------|\n";
	exit( 1 );
}
// Delete user from stripe
echo 'Deleting stripe customer';
if ( $stripeCustomerId ) {
	try {
		$stripeApi->deleteCustomer( $stripeCustomerId );
	} catch ( \Stripe\Exception\ApiErrorException $e ) {
		echo 'Stripe error: ' . $e->getMessage() . "\n";
		exit( 1 );
	}
}

// Create new stripe customer
echo "Creating new stripe customer\n";
try {
	$newCustomer = $stripeApi->createCustomer( email: $userProfile['email'], userId: $userId );
} catch ( \Stripe\Exception\ApiErrorException $e ) {
	echo 'Stripe error: ' . $e->getMessage() . "\n";
}

echo "New stripe customer created. \n";
echo json_encode( $newCustomer, JSON_PRETTY_PRINT ) . "\n\n";
// Reset user data in subscription table.
if ( $newCustomer->id ) {

	echo "Reset user in database and set new stripe customer id \n";

	$repository->updateSubscription(
		data: array(
			'stripe_subscription_id'  => null,
			'stripe_customer_id'      => $newCustomer->id,
			'stripe_invoice_id'       => null,
			'failed_payment_attempts' => 0,
			'payment_status'          => null,
			'currency'                => null,
			'plan'                    => null,
			'subscription_status'     => 'trial',
		),
		where: array( 'user_id' => $userId )
	);

}
// Delete messages
deleteMessages( userId: $userId, db: $db );

echo "User $userId reset successful!\n";
echo $newCustomer->id;
