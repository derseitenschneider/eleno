<?php
$currentErrorReporting = error_reporting();
error_reporting( $currentErrorReporting & ~E_DEPRECATED & ~E_USER_DEPRECATED );

require_once __DIR__ . '/../vendor/autoload.php';
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

$userId = $argv[1] ?? '13c1e634-0906-4c30-8622-c786957553ae';

if ( $userId === null ) {
	echo "Usage: php reset_user.php <user_id>\n";
	exit( 1 );
}

// 1. Database Reset

$stripeSubscription   = $repository->getSubscription( $userId );
$stripeSubscriptionId = $stripeSubscription[0]['stripe_subscription_id'] ?? '';

// Reset user data in db
$repository->updateSubscription(
	data: array(
		'stripe_subscription_id'  => null,
		'stripe_invoice_id'       => null,
		'failed_payment_attempts' => 0,
		'period_start'            => date( 'Y-m-d' ),
		'period_end'              => date( 'Y-m-d', strtotime( '+30 days' ) ),
		'payment_status'          => null,
		'currency'                => null,
		'plan'                    => null,
		'is_lifetime'             => false,
		'subscription_status'     => 'trial',
	),
	where: array( 'user_id' => $userId )
);

if ( empty( $stripeSubscriptionId ) ) {
	echo "User {$userId} reset successfully.\nNo subscription found therefore no stripe action required.";
	exit;
}

// 2. Stripe Reset
try {
	$stripeApi->cancelSubscription( $stripeSubscriptionId );
} catch ( \Stripe\Exception\ApiErrorException $e ) {
	echo 'Stripe error: ' . $e->getMessage() . "\n";
	exit( 1 );
}

echo "User $userId reset successfully.\n";
