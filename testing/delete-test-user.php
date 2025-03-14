<?php
require_once __DIR__ . '/../api/tests/Utils/UserManager.php';

$options = getopt( '', [ 'user:' ] );
$userId = $options['user'] ?? null;

if ( ! $userId ) {
    echo "Usage: php delete-test-user.php --user=<user_id>\n";
    exit(1);
}

$userManager = new UserManager();

try {
    $userManager->deleteUser($userId);
    echo "User {$userId} deleted successfully\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
