<?php

use Tests\Utils\SubscriptionStates;

require_once __DIR__ . '/bootstrap.php';


// Now load and use the UserManager

$options = getopt('', [ 'state:', 'user:' ]);
$state = $options['state'] ?? null;
$userId = $options['user'] ?? null;

if (!$state || !$userId) {
    echo "Usage: php set-subscription-state.php --state=<state> --user=<user_id>\n";
    exit(1);
}

try {
    SubscriptionStates::apply($userId, $state);
    echo "Successfully applied state '{$state}' to user {$userId}\n";
    exit(0);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
