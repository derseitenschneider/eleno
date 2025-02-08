<?php

require_once __DIR__ . '/vendor/autoload.php'; // Path to your autoloader

use App\Config\Config;
use App\Services\SupabaseService;

$dotenv = Dotenv\Dotenv::createImmutable( __DIR__ );
$dotenv->load();

$config = Config::getInstance();

$supabase = new SupabaseService( $config );
$status   = $supabase->getSubscriptionStatus( '13c1e634-0906-4c30-8622-c786957553ae' );
var_dump( $status );
