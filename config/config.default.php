<?php
/**
 * Default Configuration Settings
 * DO NOT CHANGE - Define all instance specific settings in config.local.php.
 *
 * Copy this file to config.local.php and set desired configuration settings.
 */

/**
 * Production
 * Boolean variable controls debug and environment modes
 * Set to false in config.local.php on a development environment.
 */
$config['production'] = true;

/**
 * Database
 */
$config['database']['host'] = 'localhost';
$config['database']['dbname'] = '';
$config['database']['username'] = '';
$config['database']['password'] = '';

/**
 * Sessions
 */
$config['session']['cookieName'] = 'pitoncms'; // Name of the cookie
$config['session']['checkIpAddress'] = true;
$config['session']['checkUserAgent'] = true;
$config['session']['salt'] = ''; // Salt key to hash
$config['session']['secondsUntilExpiration'] = 7200;
