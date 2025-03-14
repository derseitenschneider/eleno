<?php
require_once __DIR__ . '/../api/tests/Utils/UserManager.php';

$options = getopt( '', [ 'email::' ] );
$email = $options['email'] ?? null;

$userManager = new UserManager();

try {
    $userId = $userManager->createUser($email);
    echo $userId . "\n"; // Just output the ID for scripts to capture
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
