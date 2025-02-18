<?php
$currentErrorReporting = error_reporting();
error_reporting( $currentErrorReporting & ~E_DEPRECATED & ~E_USER_DEPRECATED );

require_once __DIR__ . '/../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable( __DIR__ . '/..' );
$dotenv->load();

use App\Config\Config;
use App\Services\Stripe\StripeAPIService;
use App\Services\SupabaseService;
use Stripe\Stripe;

// Load configuration (adapt to your config loading method)
$config    = new Config();
$supabase  = new SupabaseService( $config );
$stripeApi = new StripeAPIService( $config );

// Get user ID (you might want to pass this as a command-line argument)
$userId = $argv[1] ?? '13c1e634-0906-4c30-8622-c786957553ae';

if ( $userId === null ) {
	echo "Usage: php reset_user.php <user_id>\n";
	exit( 1 );
}

// 1. Supabase Reset

// Find the user's stripe subscription id
$stripeSubscription = $supabase->get(
	endpoint: 'stripe_subscriptions',
	query: array(
		'select'  => 'stripe_subscription_id',
		'user_id' => 'eq.' . $userId,
	)
);

$stripeSubscriptionId = $stripeSubscription['data'][0]['stripe_subscription_id'];
echo "Retrieved subscriptionId: {$stripeSubscriptionId}\n";

// Reset user data in Supabase
$supabase->patch(
	endpoint: 'stripe_subscriptions', // The table where user data is stored
	data: array(
		'stripe_subscription_id' => null,
		'stripe_invoice_id'      => null,
		'payment_status'         => null,
		'currency'               => null,
		'plan'                   => null,
		'cancel_at_period_end'   => false,
		'is_lifetime'            => false,
		'subscription_status'    => 'trial',
	),
	query: array( 'user_id' => 'eq.' . $userId ) // Assuming 'id' is your user ID column
);

if ( empty( $stripeSubscriptionId ) ) {
	echo "User {$userId} reset successfully.\n No subscription found therefore no stripe action required.";
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
