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
$config['site']['production'] = true;

/**
 * Database
 */
$config['database']['host'] = 'localhost';
$config['database']['dbname'] = '';
$config['database']['username'] = '';
$config['database']['password'] = '';

/**
 * Sessions
 *
 * Set 'salt' to a long hash.
 */
$config['session']['cookieName'] = 'pitoncms';
$config['session']['checkIpAddress'] = true;
$config['session']['checkUserAgent'] = true;
$config['session']['salt'] = '';
$config['session']['secondsUntilExpiration'] = 7200;

/**
 * Email
 *
 * from:     Send-from email address
 * protocol: 'mail' (default) or 'smtp'
 *
 * These settings below only apply for SMTP connections
 * smtpHost: SMTP server name
 * smtpUser: User name
 * smtpPass: Password
 * smtpPort: Port to use, likely 465
 */
$config['email']['from'] = 'pitoncms@localhost.com';
$config['email']['protocol'] = 'mail';
$config['email']['smtpHost'] = '';
$config['email']['smtpUser'] = '';
$config['email']['smtpPass'] = '';
$config['email']['smtpPort'] = '';
