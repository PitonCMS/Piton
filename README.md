# Piton
Simple Content Management System

## Install
To install `cd` to where you want to create a new project directory, update `<my-project-name>` to your folder name and run:

```
composer create-project --ignore-platform-reqs pitoncms/piton <my-project-name> "dev-master"
```

When composer asks to delete git files, say no.

Copy the `config/config.default.php` file to `config/config.local.php`, and then update any configuration settings that vary from default (and feel free to delete the default ones that do not change).

## While in Development Mode
To get piton and engine updates, use git to pull the latest files from the master branch.

For piton updates, from the root of the project:

```
git pull origin master
```

For engine updates, cd into `vendor/pitoncms/engine` and also run:

```
git pull origin master
```

Once we have stable releases semantic versioned tags will be added to simplify updates.


### Elements

#### text

Markdown editor for basic content. No external linking necessary.

#### hero

Hero Image for a page. Can add a title, text and a link to an image. External link necessary.

#### mediaGroup

Think gallery of images, or similar items. Will need to create the 'gallery' before this can be created.

#### media

Add a link to a media item i.e. image, youtube video. Need the external reference before.

#### contactForm

Add a contact form with title and blurb to a page. No external link required.

#### calendar

Add a calendar to a page. No external link required.
