<?php
$currentErrorReporting = error_reporting();
error_reporting( $currentErrorReporting & ~E_DEPRECATED & ~E_USER_DEPRECATED );
require_once __DIR__ . '/vendor/autoload.php';

use App\Config\Config;
use App\Database\Database;
use App\Repositories\SubscriptionRepository;

$dotenv = Dotenv\Dotenv::createImmutable( __DIR__ );
$dotenv->load();

$config = new Config();
$db     = new Database( $config );
$repo   = new SubscriptionRepository( $db );

$status = $repo->reactivateSubscription( 'test' );
var_dump( $status );
