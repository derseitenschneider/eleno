<?php

require_once './setup.php';
$data = setup();

$output = shell_exec('stripe fixtures ./stripe-fixtures/monthly-subscription.json');
echo $output;

