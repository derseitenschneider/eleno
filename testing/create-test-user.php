<?php
require_once __DIR__ . '/bootstrap.php';

use Tests\Utils\UserManager;

// Now load and use the UserManager
$userManager = new UserManager();

$options = getopt( '', [ 'email::' ] );
$email = $options['email'] ?? null;


try {
    $userId = $userManager->createUser($email);
    echo $userId . "\n"; // Just output the ID for scripts to capture
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
