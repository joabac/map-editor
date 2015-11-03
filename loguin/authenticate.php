<?php 
  function getPasswordForUser($username) {
    $config_file = file_get_contents("config.json");
    $config_array = json_decode($config_file, true);
    return $config_array["config"][0]["password"];
  }
  
  function validate($challenge, $response, $password) {
    
      return md5($challenge . $password) == $response;
      
  }
  
 function authenticateOnDb($challenge,$response,$username,&$mensaje)
{
    include("../conn.php");

try{

    $db_handle = @pg_connect($strCnx_loguin);
        
    if ($db_handle != false) 
    {

       $query = "SELECT password FROM usuarios where email = '".$username."';"; 
       $result = @pg_query($db_handle,$query); 
       
       if($result)
       {
           $row = @pg_fetch_row($result);
           if($row){
                $var_hashed_md5 = md5($challenge . $row[0]);
                
                if($var_hashed_md5 == $response)
                       return true;
               else{
                    $mensaje = 'Datos incorrectos';
                    return false;
                   
                   }
           }
       }
       else{
           $mensaje = 'Error al recuperar datos de usuario';
           return false;
           
       }  
       pg_close($db_handle);
    } 
    else
    {
          $mensaje = 'Error en conexión a DB';
          return false;
    }
    }
    catch(Exception $e)
    {
        $mensaje = 'Error en conexión a DB';
        return false;
    }
}
  
  function authenticate() {
      
    if (isset($_SESSION['challenge']) && isset($_REQUEST['username']) && isset($_REQUEST['response'])) {
      //$password = getPasswordForUser($_REQUEST['username']);
      
      //if (validate($_SESSION['challenge'], $_REQUEST['response'], $password)) {
      $mensaje = 'error';
      $result = authenticateOnDb($_SESSION['challenge'],$_REQUEST['response'],$_REQUEST['username'],$mensaje);
      if($result){
        $_SESSION['authenticated'] = "yes";
        $_SESSION['username'] = $_REQUEST['username'];
        unset($_SESSION['challenge']);
        
      } else {
            
            echo '{"success":false,"message":"'.$mensaje.'"}';
            exit;
      }
    } 
    else {
        
      echo '{"success":false,"message":"Expiró la Sesión"}';
      exit;
    }
  }
  session_start();
  authenticate();
  echo '{"success":true}';
  exit();
?>