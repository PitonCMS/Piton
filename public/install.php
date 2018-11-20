<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="author" content="PitonCMS">
    <link rel="icon" href="">

    <title>PitonCMS Installer</title>

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <link href="//cdn.jsdelivr.net/simplemde/latest/simplemde.min.css" rel="stylesheet">
  </head>

  <body>

    <main role="main" class="container">
      <div class="row">
        <div class="col">
          <h1>Install PitonCMS</h1>
          <ul>
            <li>Run Composer Update</li>
            <li>Install Database</li>
            <ul>
              <li>Create MySQL User and Database</li>
              <li>Copy 'config/config.default.php' to config/config.local.php'</li>
              <li>Change '$config['production']' from true to false</li>
              <li>Under database configs, set the dbname, username, password to the values you used when creating the database.</li>
              <li>Set session configs, set the cookieName (lowercase, one word), and add a random hash to 'salt'</li>
              <li>Save config.local.php</li>
            </ul>
            <li>TODO: Optionally create a new theme folder under 'themes', next to 'default'</li>
            <ul>
              <li>Copy any files you wish to change from default to your custom theme</li>
            </ul>
          </ul>
        </div>
      </div>
    </main><!-- /.container -->

    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
  </body>
</html>
