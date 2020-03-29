# PitonCMS
Designer Friendly and Flexible Content Management System

## Designer Forward CMS
PitonCMS was designed to _Designer Forward_, giving great flexibility to the designer to imagine the art of the possible without requiring additional custom development.

Page structures, custom data, settings, are all easily extensible by modifying project JSON `Definition` files. These files can be checked into version control and pushed to other environments to promote data changes without having to modify remote databases or push code.

## Requirements
* *AMP environment with PHP 7.1 or greater. PitonCMS comes with a [Docker-Compose](https://docs.docker.com/compose/) image ready to run for local development
* [Composer](https://getcomposer.org/) installed on your development environment to install PitonCMS packages

## Install PitonCMS
To install PitonCMS using composer from the command line, change directories (`cd`) to where you want to create your new PitonCMS project directory, and run the composer `create-project` command but update `<my-project-name>` to the desired project name:

```
composer create-project pitoncms/piton <my-project-name>
```

This will create a new instance of PitonCMS in a new folder of the same name. When composer asks if you wish to delete any version control files say yes.

The `create-project` command will automatically run a post create script that:

* Modifies the Docker Compose YAML files and Apache config files with your project name
* Copies the `config/config.default.php` file to `config/config.local.php`, and sets appropriate local _development_ settings
* Updates the project `.gitignore` file to remove the ignore directive on `composer.lock` (so you can version control that file for your project)

## Run PitonCMS Docker Container
If you have a [Docker](https://docs.docker.com/) client installed on your machine from the command line `cd` into the new project folder and run:

```
docker-compose build
```
to build the Docker server. This is a one time step.

To start the container, run:

```
docker-compose up -d
```

To later stop your contaier, run:

```
docker-compose stop
```

If you do not have the Docker client, then run PitonCMS on your local *AMP server.

After starting your development server, open a browser and go to `http://localhost`. The first time you will be directed to the installer script. Enter your name and email address and submit to build the database and add you as an administrative user.

**Note:** The installer script (`public/install.php`) deletes itself after creating the database. If for some reason the self-delete fails, be sure to manually delete this file _before_ your version control initial commit. DO NOT commit `install.php` and/or push to a production environment.

## Login to PitonCMS
PitonCMS does not store passwords. PitonCMS uses a Passwordless Authentication by Email system.

To login, navigate to `/login` and enter the email address you used during the install. You will be sent a one-time use hashed token with a link to login that is good for five minutes. After logging in, you are welcome to delete the login email.

## Inside PitonCMS Administration
After logging in to the PitonCMS administration back end, go ahead and explore. A good first stop is under the `Tools` menu is to review the client controlled site settings. Also review the `Help` documentation for Designer and Client.

## First Project Commit
For your project using PitonCMS, before your first commit you should:
* Make sure that `public/install.php` has been deleted
* Edit `.gitignore` in the root of the project to remove `composer.lock` (which should have been done as part of the automatic install).
* Consider whether to also remove `vendor/` from `.gitignore`

There are various schools of thought on weather to commit `vendor` folders in your project. If you commit your `composer.lock` you _should_ be able to install the same critical files by running `composer install` from the project root on another environment. But committing those same files assures you of maintaining the same file versions as well.

## Backend Configuration Settings
After installing the project, inspect the `config/config.local.php` configuration file (which was copied from `config.default.php` as part of the composer create project step) to ensure the configuration values are set for your environment.

Do not update the `config.default.php` settings directly, make any desired changes in `config.local.php` as those override the default file.

For security reasons, **DO NOT** commit `config.local.php` to your version control system. For any instance of your PitonCMS project, you will need a local  `config.local.php` file to manage local server settings.

### Configuration Setting Options
The `production` configuration setting flag should be set for your local environment. If set to `true` then error details are suppresed and sent to the server logs, not the screen.

This should always be set to `true` in production.
```
/**
 * Production
 * Boolean variable controls debug and environment modes
 * Set to false in config.local.php on a development environment.
 */
$config['site']['production'] = true;
```
If using Docker for your local development environment the database connection credentials should have been set as part of the install process. For production, enter your production database credentials.
```
/**
 * Database
 */
$config['database']['host'] = 'localhost';
$config['database']['dbname'] = '';
$config['database']['username'] = '';
$config['database']['password'] = '';
```
If using Docker for your local development environment the session settings should have been set as part of the install process. For production, be sure to set your desired `cookieName` and a suitably long and complex `salt` hash.
```
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
```

PitonCMS relies by default on your local `mail` client, but if that is not installed or your local ISP blocks port 25 then add your SMTP credentials.
```
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
```
If you have many pages or media files, pagination controls will appear to manage the number of records on screen. Update how many records you wish to see at one time.
```
/**
 * Pagination Row Limits
 */
$config['pagination']['adminPagePagination']['resultsPerPage'] = 6;
$config['pagination']['adminMediaPagination']['resultsPerPage'] = 10;
```

## Updating PitonCMS
The PitonCMS system relies on a vendor package named `pitoncms/engine` which has nearly all of the PitonCMS code and files. To update the core of PitonCMS, from the command line in the root of your project run:

```
composer update pitoncms/engine
```
to get the latest version, and then commit the `composer.lock` file (and possibly commit the `vendor` folder).

The PitonCMS frontend project files above the `vendor` folder are never updated, so your client custom files are never touched.
