<?php
require_once __DIR__ . '/helpers/base.php';
require_once __DIR__ . '/functions.php';

$args = parseArguments( $argv );

// User id
if ( isset( $args['userId'] ) ) {
	$userId = $args['userId'];
} else {
	$userId = '13c1e634-0906-4c30-8622-c786957553ae';
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

if ( $userId === null ) {
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


echo "Found subscription:\n\n";
echo json_encode( $stripeSubscription, JSON_PRETTY_PRINT ) . "\n\n";
echo "Subscription ID: {$stripeSubscriptionId}\n";
if ( $expired ) {
	expirePeriod( userId: $userId, repo: $repository, dry: $dry );
} else {
	renewPeriod( userId: $userId, repo: $repository, dry: $dry );
}

if ( $dry ) {
	echo "|--------------- END DRY RUN ---------------|\n";
	exit( 1 );
}

// Reset user data in db
$repository->updateSubscription(
	data: array(
		'stripe_subscription_id'  => null,
		'stripe_invoice_id'       => null,
		'failed_payment_attempts' => 0,
		'payment_status'          => null,
		'currency'                => null,
		'plan'                    => null,
		'subscription_status'     => 'trial',
	),
	where: array( 'user_id' => $userId )
);

// 2. Stripe Reset
if ( $stripeSubscriptionId ) {
	try {
		$stripeApi->cancelSubscription( $stripeSubscriptionId );
	} catch ( \Stripe\Exception\ApiErrorException $e ) {
		echo 'Stripe error: ' . $e->getMessage() . "\n";
		exit( 1 );
	}
}
echo "User $userId reset successful!\n";
