<?php
$currentErrorReporting = error_reporting();
error_reporting( $currentErrorReporting & ~E_DEPRECATED & ~E_USER_DEPRECATED );

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/parse-arguments.php';

$dotenv = Dotenv\Dotenv::createImmutable( __DIR__ . '/..' );
$dotenv->load();

use App\Config\Config;
use App\Database\Database;
use App\Repositories\SubscriptionRepository;
use App\Services\Stripe\StripeAPIService;
use Stripe\Stripe;

$config     = new Config();
$db         = new Database( $config );
$repository = new SubscriptionRepository( $db );
$stripeApi  = new StripeAPIService( $config );

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

$periodStart = $expired ? date( 'Y-m-d', strtotime( '-31 days' ) ) : date( 'Y-m-d' );
$periodEnd   = $expired ? date( 'Y-m-d', strtotime( '-1 day' ) ) : date( 'Y-m-d', strtotime( '+30 days' ) );

echo "Found subscription:\n\n";
echo json_encode( $stripeSubscription, JSON_PRETTY_PRINT ) . "\n\n";
echo "Subscription ID: {$stripeSubscriptionId}\n";
echo "Resetting subscription to trial with period set to:\n";
echo "{$periodStart} - {$periodEnd}\n\n";

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
		'period_start'            => $periodStart,
		'period_end'              => $periodEnd,
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
