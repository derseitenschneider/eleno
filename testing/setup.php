<?php
require_once __DIR__ . '/bootstrap.php';

use Tests\Utils\StripeTestManager;
use Tests\Utils\UserManager;

// Now load and use the UserManager
function setup()
{

    $userManager = new UserManager();
    $stripeManager = new StripeTestManager();

    $options = getopt('', [ 'email::', 'password::' ]);
    $email = $options['email'] ?? 'test-' . time() . '@login.com';
    $password = $options['password'] ?? 'testPassword';



    try {
        $user = $userManager->createUser($email, $password);
        $userId =$user['id'];
        $customer = $stripeManager->createCustomer($userId, $email);

        // file_put_contents(
        //     './userinfo.json', json_encode(
        //         array(
        //         'email' => $email,
        //         'password' => $password,
        //         'userId'=> $userId,
        //         'customerId' => $customer->id
        //         )
        //     )
        // );
        // echo $userId . "\n"; // Just output the ID for scripts to capture
        echo "Setup completed\n";
        echo "----------------------------";
        $result =  array(
                'email' => $email,
                'password' => $password,
                'userId'=> $userId,
                'customerId' => $customer->id
                );
        return $result;
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage() . "\n";
        exit(1);
    }
}
