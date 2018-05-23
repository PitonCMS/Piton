<?php

// Application entry point for all requests

// Set encoding
mb_internal_encoding('UTF-8');
mb_http_output('UTF-8');

// Define the application root directory
define('ROOT_DIR', dirname(__DIR__) . '/');

// Load the Composer Autoloader
require ROOT_DIR . 'vendor/autoload.php';

// Load the bootstrap file and return $app object to get things started
$app = require ROOT_DIR . 'vendor/pitoncms/engine/config/bootstrap.php';

// And away we go!
$app->run();
