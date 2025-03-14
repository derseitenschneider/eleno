<?php
require_once __DIR__ . '/../api/vendor/autoload.php';

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../api');
$dotenv->load();
