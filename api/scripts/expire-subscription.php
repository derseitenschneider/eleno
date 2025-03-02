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

if ( $userId === null ) {
	echo "Usage: php reset_user.php <user_id>\n";
	exit( 1 );
}

if ( $dry ) {
	echo "|--------------- START DRY RUN ---------------|\n\n";
}

// 1. Database Reset
echo "Fetching subscription from database.\n";
$stripeSubscription = $repository->getSubscription( $userId );


echo "Found subscription:\n\n";
echo json_encode( $stripeSubscription, JSON_PRETTY_PRINT ) . "\n\n";

expirePeriod( userId: $userId, repo: $repository, dry: $dry );

if ( $dry ) {
	echo "|--------------- END DRY RUN ---------------|\n";
	exit( 1 );
}

echo "Subscription of user {$userId} expired successfully";
