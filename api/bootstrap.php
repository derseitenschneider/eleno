<?php
$currentErrorReporting = error_reporting();
error_reporting( $currentErrorReporting & ~E_DEPRECATED & ~E_USER_DEPRECATED );
require_once __DIR__ . '/vendor/autoload.php';

use App\Config\Config;
use App\Database\Database;

$dotenv = Dotenv\Dotenv::createImmutable( __DIR__ );
$dotenv->load();

$config = new Config();
$db     = new Database( $config );

$delete = $db->delete(
	table:'stripe_subscriptions',
	where: array(
		'stripe_subscription_id' => 'test',
	)
);
var_dump( $delete );
