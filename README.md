# Piton
Simple Content Management System

To install `cd` to where you want to create a new project directory, update `<my-project-name>` to your folder name and run:

```
composer create-project --ignore-platform-reqs pitoncms/piton <my-project-name> "dev-master"
```

When composer asks to delete git files, say no.

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
