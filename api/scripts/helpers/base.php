<?php
$currentErrorReporting = error_reporting();
error_reporting( $currentErrorReporting & ~E_DEPRECATED & ~E_USER_DEPRECATED );
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/parse-arguments.php';

$dotenv = Dotenv\Dotenv::createImmutable( __DIR__ . '/../..' );
$dotenv->load();

use App\Config\Config;
use App\Database\Database;
use App\Repositories\SubscriptionRepository;
use App\Services\Stripe\StripeAPIService;
use Stripe\Stripe;

$config     = new Config();
$db         = new Database( $config );
$repository = new SubscriptionRepository( $db );
$stripeApi  = new StripeAPIService( $config );
