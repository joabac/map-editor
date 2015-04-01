<?php
  $config_json = "{
  \"config\":[{
    \"username\":\"" .$_POST['username']. "\",
    \"password\":\"" .$_POST['password']. "\"
  }]
}";
  file_put_contents('config.json', $config_json);
  echo "{\"success\":true}";
?>