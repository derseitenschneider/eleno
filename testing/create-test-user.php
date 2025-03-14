<?php
require_once __DIR__ . '/bootstrap.php';

use Tests\Utils\UserManager;

// Now load and use the UserManager
$userManager = new UserManager();

$options = getopt('', [ 'email::', 'password::' ]);
$email = $options['email'] ?? null;
$password = $options['password'] ?? null;


try {
    $user = $userManager->createUser($email, $password);
    $userId =$user['id'];
    echo $userId . "\n"; // Just output the ID for scripts to capture
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
