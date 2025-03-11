<?php

require_once __DIR__ . '/helpers/base.php';
require_once __DIR__ . '/functions.php';

$args = parseArguments($argv);

// User id
if (isset($args['userId'])) {
    $userId = $args['userId'];
} else {
    $userId = 'c352cb96-41e4-47ac-81bd-a77bf7865c92';
}

// Dry run
if (isset($args['dry'])) {
    $dry = true;
} else {
    $dry = false;
}

// Set subscription to dates in past (expired)
if (isset($args['expired'])) {
    $expired = true;
} else {
    $expired = false;
}

if ($userId === null) {
    echo "Usage: php reset_user.php <user_id>\n";
    exit(1);
}

if ($dry) {
    echo "|--------------- START DRY RUN ---------------|\n\n";
}

// 1. Database Reset
echo "Fetching subscription from database.\n";
$stripeSubscription   = $repository->getSubscription($userId);
$stripeSubscriptionId = $stripeSubscription['stripe_subscription_id'] ?? '';
$stripeCustomerId = $stripeSubscription['stripe_customer_id'];

echo "Found subscription:\n\n";
echo json_encode($stripeSubscription, JSON_PRETTY_PRINT) . "\n\n";
echo "Subscription ID: {$stripeSubscriptionId}\n";
echo "Customer ID: {$stripeCustomerId}\n";
if ($expired) {
    expirePeriod(userId: $userId, repo: $repository, dry: $dry);
} else {
    renewPeriod(userId: $userId, repo: $repository, dry: $dry);
}

echo "Fetching profile from database";
$sql = " 
SELECT *
FROM profiles
WHERE id = $1
";
$params = [$userId];
$userProfile = $db->query($sql, $params);

echo "Found user profile\n\n";
echo json_encode($userProfile, JSON_PRETTY_PRINT) . "\n\n";

if ($dry) {
    echo "|--------------- END DRY RUN ---------------|\n";
    exit(1);
}
// Delete user from stripe
echo "Deleting stripe customer";
if ($stripeCustomerId) {
    try {
        $stripeApi->deleteCustomer($stripeCustomerId);
    } catch (\Stripe\Exception\ApiErrorException $e) {
        echo 'Stripe error: ' . $e->getMessage() . "\n";
        exit(1);
    }
}

// Create new user in stripe

// Reset user data in subscription table.
// $repository->updateSubscription(
//     data: array(
//         'stripe_subscription_id'  => null,
//         'stripe_invoice_id'       => null,
//         'failed_payment_attempts' => 0,
//         'payment_status'          => null,
//         'currency'                => null,
//         'plan'                    => null,
//         'subscription_status'     => 'trial',
//     ),
//     where: array( 'user_id' => $userId )
// );

// if ($stripeSubscriptionId) {
//     try {
//         $stripeApi->cancelSubscription($stripeSubscriptionId);
//     } catch (\Stripe\Exception\ApiErrorException $e) {
//         echo 'Stripe error: ' . $e->getMessage() . "\n";
//         exit(1);
//     }
// }
echo "User $userId reset successful!\n";
