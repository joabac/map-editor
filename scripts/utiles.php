<?php

//TODO reemplazar por un switch
$resultado = $_REQUEST['Parametro'];


if($resultado == 'getUsers')
{
    return getUsers();
}

if($resultado == 'getCapasDisp')
{
    $id = $_REQUEST['id_user'];
    return getCapasDisponibles($id);
}

if($resultado == 'getCapasAsoc')
{
    $id = $_REQUEST['id_user'];
    return getCapasAsociadas($id);
}

if($resultado == 'guardaCapas')
{
    $id = $_REQUEST['id_user'];
    $wfs = array($_REQUEST['wfs']);
    $wms = array($_REQUEST['wms']);
    
    return guardarCapas($id,$wms,$wfs);
    
}

if($resultado == 'getCapasAll')
{
       
    return getCapasAll();
    
}

if($resultado == 'getInfoCapa')
{
    $id_capa = $_REQUEST['id_capa'];
    
    return getInfoCapa($id_capa);
    
}

if($resultado == 'guardaCapaNueva')
{
    return guardaCapaNueva(); 
}

if($resultado == 'guardaCapaEdicion')
{
    return guardaCapaEdicion(); 
}

if($resultado == 'guardaEstilo')
{
    $user_name = $_REQUEST['user_name'];
    $id_capa_estilo = $_REQUEST['id_capa'];
    $estilo = $_REQUEST['estilo'];
    return guardaEstiloEdicion($user_name,$id_capa_estilo,$estilo); 
}

if($resultado == 'getEstilo')
{
    $user_name = $_REQUEST['user_name'];
    $id_capa_estilo = $_REQUEST['id_capa'];
    
    return getEstilo($user_name,$id_capa_estilo); 
}

if($resultado == 'getCapaLimite')
{
    $user_name = $_REQUEST['user_name'];
    $id_capa_estilo = $_REQUEST['id_capa'];
    
    return getCapaLimite($user_name,$id_capa_estilo); 
}

if($resultado == 'borrarCapa')
{
    $id_capa = $_REQUEST['id_capa'];
    return borrarCapa($id_capa); 
}

if($resultado == 'getTipoCapa')
{
    $nombre_capa = $_REQUEST['nombre_capa'];
    return getTipoCapa($nombre_capa); 
}

if($resultado == 'getPerfil')
{
    $user_name = $_REQUEST['user_name'];
    return getPerfil($user_name); 
}

if($resultado == 'setPerfil')
{
    $user_name = $_REQUEST['user_name'];
    $perfil = $_REQUEST['perfil'];
    return setPerfil($user_name,$perfil); 
}
else
   return;


function isAdmin($email){
        if($email == "")
        return;
    
        include("../conn.php");
        $db_handle = pg_connect($strCnx);
        
        if ($db_handle) 
        {

           $query2 = "select admin from usuarios where email like '".$email."';"; 
           $result2 = pg_query($db_handle,$query2);
           if($result2){

                $row2 = pg_fetch_row($result2);
                
                if ($row2){
                    
                    if($row2[0] == 'true')
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                 }
          }
        }
                    
}

function getUnUsuario($email)
{        
        include("../conn.php");
        $db_handle = pg_connect($strCnx_loguin);
        
        $json = Array();
        
        if ($db_handle) 
        {

           $query2 = "SELECT id_usuario FROM usuarios WHERE email like '".$email."';"; 
           $result2 = pg_query($db_handle,$query2);
           if($result2){
 
                while ($row = pg_fetch_row($result2))
                {
                     
                    return $row[0];
                    
                }
          }
          else
          {
              return -1;
          }
        }
}

function getCapasDisponibles($user_id){
    

        include("../conn.php");
        $db_handle = pg_connect($strCnx);
        
        $json = Array();
        
        if ($db_handle) 
        {

           $query2 = "SELECT id_capa, nombre_fantasia FROM atributos_por_capa WHERE id_capa not in (SELECT id_capa from capas_asociadas where id_usuario = ".$user_id.") order by id_capa;"; 
           $result2 = pg_query($db_handle,$query2);
           if($result2){
 
                while ($row = pg_fetch_row($result2))
                {
                     $bus = array(
                        'id_capa' => $row[0],
                        'nombre_capa' => $row[1]
                    );
                    array_push($json, $bus);
                }

                $jsonstring = json_encode($json);
                echo $jsonstring;
          }
          else
          {
              echo "{}";
             
          }
        }
        
       
}

function getCapasAsociadas($user_id){
    
        include("../conn.php");
        $db_handle = pg_connect($strCnx);
        
        $json = Array();
        
        if ($db_handle) 
        {

           $query2 = "SELECT cas.id_capa,cas.protocolo,atpc.nombre_fantasia FROM capas_asociadas as cas, atributos_por_capa as atpc WHERE cas.id_usuario = ".$user_id." and cas.id_capa=atpc.id_capa";
           $result2 = pg_query($db_handle,$query2);
           if($result2){
 
                while ($row = pg_fetch_row($result2))
                {
                     $bus = array(
                        'id_capa' => $row[0],
                        'protocolo' => $row[1],
                        'nombre_capa' => $row[2]
                    );
                    array_push($json, $bus);
                }

                $jsonstring = json_encode($json);
                echo $jsonstring;
          }
          else
          {
              echo "{}";
          }
        }
        
}

function getCapasAll(){
    

        include("../conn.php");
        $db_handle = pg_connect($strCnx);
        
        $json = Array();
        
        if ($db_handle) 
        {

           $query2 = "SELECT id_capa, nombre_fantasia FROM atributos_por_capa order by id_capa;"; 
           $result2 = pg_query($db_handle,$query2);
           if($result2){
 
                while ($row = pg_fetch_row($result2))
                {
                     $bus = array(
                        'id_capa' => $row[0],
                        'nombre_capa' => $row[1]
                    );
                    array_push($json, $bus);
                }

                $jsonstring = json_encode($json);
                echo $jsonstring;
          }
          else
          {
              echo "{}";
          }
        }
        
       
}

function getInfoCapa($id_capa)
{
    include("../conn.php");
        $db_handle = pg_connect($strCnx);
        
        $json = Array();
        
        if ($db_handle) 
        {

           $query2 = 'SELECT id_capa, nombre_capa, url, version_wms, nombre_fantasia, "singleTile", "isBaseLayer", "numZoomLevels", visibility, transparent, nivel_de_arbol, estilo_wms, version_wfs, select_control, estilo_wfs, type FROM atributos_por_capa where id_capa='.$id_capa.';'; 
           $result2 = pg_query($db_handle,$query2);
           if($result2){
               
               $row = pg_fetch_row($result2);
                
                if ($row){
  
                    $bus = array(
                        'id_capa' => $row[0],
                        'nombre_capa' => $row[1],
                        'url'=> $row[2], 
                        'version_wms'=> $row[3], 
                        'nombre_fantasia'=> $row[4], 
                        'singleTile'=> $row[5], 
                        'isBaseLayer'=> $row[6], 
                        'numZoomLevels'=> $row[7], 
                        'visibility'=> $row[8], 
                        'transparent'=> $row[9], 
                        'nivel_de_arbol'=> $row[10], 
                        'estilo_wms'=> $row[11], 
                        'version_wfs'=> $row[12], 
                        'select_control'=> $row[13], 
                        'estilo_wfs'=> $row[14],
                        'type'=> $row[15]
                    );
                    array_push($json, $bus);
                

                $jsonstring = json_encode($json);
                echo $jsonstring;
                
                }
                else {echo '{"success":false}';}
                
          }
          else
          {
              echo '{"success":false}';
          }
        }
    
}

function guardarCapas($id_user,$capasWms,$capasWfs)
{
 
    $wfs_array = json_decode($_REQUEST['wfs']);
    $wms_array = json_decode($_REQUEST['wms']);
//    array_push($json, "wms:".json_encode($capasWms,JSON_UNESCAPED_SLASHES));
//    array_push($json, "wfs:".json_encode($capasWfs,JSON_UNESCAPED_SLASHES));
   
    include("../conn.php");
        $db_handle = @pg_connect($strCnx);

        //metodos implementados aprovechando la ejecucion en bloque de las transaciones
        
        if ($db_handle) 
        {
            
           $query2 = "DELETE FROM capas_asociadas WHERE id_usuario = ".$id_user.";";
           
           foreach ($wms_array as $capa_wms)
           {
                $query2 .=" INSERT INTO capas_asociadas(id_usuario, protocolo, id_capa) VALUES (".$id_user.", 'wms', ".$capa_wms.");";
               
           }
           foreach ($wfs_array as $capa_wfs)
           {
                $query2 .=" INSERT INTO capas_asociadas(id_usuario, protocolo, id_capa) VALUES (".$id_user.", 'wfs', ".$capa_wfs.");";
               
           }
           
           $result2 = @pg_query($db_handle,$query2);
           
           if($result2)
           {
               echo '{"success":true}';
               exit;
           }
           else
           {
                $mensaje = "Error al salvar los cambios.";
                echo '{"success":false,"message":"'.$mensaje.'"}';
                exit;
           }
           
        }
        else
            {
                $mensaje = "Error al conectar con base de datos.";
                echo '{"success":false,"message":"'.$mensaje.'"}';
                exit;
            }
}


//TODO: actualizar estilos en base de datos por capa por usuario
function guardaEstiloEdicion($email,$id_capa_estilo,$estilo)
{

    include("../conn.php");
        $db_handle = @pg_connect($strCnx);
        
        $id_usuario = getUnUsuario($email);

        //metodos implementados aprovechando la ejecucion en bloque de las transaciones
        
        if ($db_handle) 
        {
            
           $query2 = "DELETE FROM estilo_x_capa_x_usuario WHERE id_usuario = ".$id_usuario." and id_capa = ".$id_capa_estilo.";";
           
           
//           $query2 .=" INSERT INTO estilo_x_capa_x_usuario(id_usuario, id_capa,estilo) VALUES (".$id_usuario.", ".$id_capa_estilo.", ".$estilo.");";
           
           $query2 .=" INSERT INTO estilo_x_capa_x_usuario(id_usuario, id_capa,estilo_json) VALUES (".$id_usuario.", ".$id_capa_estilo.",'".$estilo."');";
           $result2 = @pg_query($db_handle,$query2);
           
           if($result2)
           {
               echo '{"success":true}';
               exit;
           }
           else
           {
                $mensaje = "Error al guardar el estilo.";
                echo '{"success":false,"message":"'.$mensaje.'"}';
                exit;
           }
           
        }
        else
            {
                $mensaje = "Error al conectar con base de datos.";
                echo '{"success":false,"message":"'.$mensaje.'"}';
                exit;
            }
}


//get  estilos de la base de datos por capa por usuario
function getEstilo($email,$id_capa_estilo)
{
    
    include("../conn.php"); 
    
        $json = Array();
    
        $db_handle = @pg_connect($strCnx);
        
        $id_usuario = getUnUsuario($email);

        //metodos implementados aprovechando la ejecucion en bloque de las transaciones
        
        if ($db_handle) 
        {
           
           $query2 ="SELECT estilo_json FROM estilo_x_capa_x_usuario WHERE id_usuario = (select id_usuario from usuarios where email like '".$email."') and id_capa=".$id_capa_estilo.";";
           $result2 = @pg_query($db_handle,$query2);
           
           if($result2){
               
               $row = pg_fetch_row($result2);
                
                if ($row){
                    
                        $bus = array(
                            'estilo' => $row[0]
                        );
                        
                        array_push($json, $bus);
                

                        $jsonstring = json_encode($json);
                        echo $jsonstring;
                }
                else 
                {
                    echo '{"success":false}';
                    
                }
                
          }
          else
          {
              echo '{"success":false}';
          }
           
        }
        else
            {
                $mensaje = "Error al conectar con base de datos.";
                echo '{"success":false,"message":"'.$mensaje.'"}';
                exit;
            }
}


//get  estilos de la base de datos por capa por usuario
function getCapaLimite($email,$id_capa_estilo)
{
    
    include("../conn.php"); 
    
        $json = Array();
    
        $db_handle = @pg_connect($strCnx);
        
        $id_usuario = getUnUsuario($email);

        //metodos implementados aprovechando la ejecucion en bloque de las transaciones
        
        if ($db_handle) 
        {
           
           $query2 ="SELECT poligonos_geojson,resolucion_permitida FROM limites_x_capa_x_usuario WHERE id_usuario = (select id_usuario from usuarios where email like '".$email."') and id_capa=".$id_capa_estilo.";";
           $result2 = @pg_query($db_handle,$query2);
           
           if($result2){
               
               $row = pg_fetch_row($result2);
                
                if ($row){
                    
                        $bus = array(
                            'limite' => $row[0],
                            'resolucion_permitida' => $row[1]
                        );
                        
                        array_push($json, $bus);
                

                        $jsonstring = json_encode($json);
                        echo $jsonstring;
                }
                else 
                {
                    $bus = array(
                        'limite' => '',
                        'resolucion_permitida' => -1
                    );

                    array_push($json, $bus);


                    $jsonstring = json_encode($json);
                    echo $jsonstring;
                    
                }
                
          }
          else
          {
              echo '{"success":false}';
          }
           
        }
        else
            {
                $mensaje = "Error al conectar con base de datos.";
                echo '{"success":false,"message":"'.$mensaje.'"}';
                exit;
            }
}

function guardaCapaNueva()
{
        $info_capa = json_decode($_REQUEST['info_capa'],TRUE);
    
        
        if($info_capa['mosaico'] == 1)
            $mosaico = "true";
        else
            $mosaico = "false";
        
        if($info_capa['capa_base'] == 1)
            $capa_base = "true";
        else
            $capa_base = "false";
        
        if($info_capa['visibilidad'] == 1)
            $visibilidad = "true";
        else
            $visibilidad = "false";
        
        if($info_capa['transparente'] == 1)
            $transparente = "true";
        else
            $transparente = "false";
        
        if($info_capa['seleccionable'] == 1)
            $seleccionable = "true";
        else
            $seleccionable = "false";
        
        if($info_capa['seleccionable'] == 1)
            $seleccionable = "true";
        else
            $seleccionable = "false";

        include("../conn.php");
        
        $db_handle = @pg_connect($strCnx);
        
        
        if ($db_handle) 
        {
            
                       
           $query = "SELECT count(id_capa)FROM atributos_por_capa;";          
   
           $result0 = pg_query($db_handle,$query);
           $row0 = pg_fetch_row($result0);
           
           if($result0)
           { 
               if($row0[0] == 0)
               {
                    $query = "INSERT INTO atributos_por_capa(id_capa, nombre_capa, url,version_wms, nombre_fantasia, \"singleTile\",\"isBaseLayer\", \"numZoomLevels\",visibility, transparent, nivel_de_arbol,estilo_wms, version_wfs, select_control, estilo_wfs, type) VALUES (0,'".$info_capa['nombre_capa'] ."', '".$info_capa['url']."', '".$info_capa['version_wms']."', '".$info_capa['nombre_fantasia']."', '".$mosaico."', '".$capa_base."', '".$info_capa['zoom_level']."', '".$visibilidad."', '".$transparente."', '".$info_capa['nivel_arbol']."','".$info_capa['estilo_wms']."','".$info_capa['version_wfs']."', '".$seleccionable."', '".$info_capa['estilo_wfs']."', '".$info_capa['type']."');";          

                    $result = pg_query($db_handle,$query);

                    if($result)
                    {
                        echo '{"success":true}';
                        exit;
                    }
                    else
                    {
                         $mensaje = "Error al guardar la nueva capa.";
                         echo '{"success":false,"message":"'.$mensaje.'"}';
                         exit;
                    }
               }
               else{ 

                     $query2 = "INSERT INTO atributos_por_capa(id_capa, nombre_capa, url,version_wms, nombre_fantasia, \"singleTile\",\"isBaseLayer\", \"numZoomLevels\",visibility, transparent, nivel_de_arbol,estilo_wms, version_wfs, select_control, estilo_wfs, type) VALUES ((SELECT max(id_capa)+1 FROM atributos_por_capa),'".$info_capa['nombre_capa'] ."', '".$info_capa['url']."', '".$info_capa['version_wms']."', '".$info_capa['nombre_fantasia']."', '".$mosaico."', '".$capa_base."', '".$info_capa['zoom_level']."', '".$visibilidad."', '".$transparente."', '".$info_capa['nivel_arbol']."','".$info_capa['estilo_wms']."','".$info_capa['version_wfs']."', '".$seleccionable."', '".$info_capa['estilo_wfs']."', '".$info_capa['type']."');";         

                     $result2 = pg_query($db_handle,$query2);

                     if($result2)
                     {
                         echo '{"success":true}';
                         exit;
                     }
                     else
                     {
                          $mensaje = "Error al guardar la nueva capa.";
                          echo '{"success":false,"message":"'.$mensaje.'"}';
                          exit;
                     }
                }
           
            }
        }
        else
            {
                $mensaje = "Error al conectar con base de datos.";
                echo '{"success":false,"message":"'.$mensaje.'"}';
                exit;
            }
    
}

function guardaCapaEdicion()
{
        $info_capa = json_decode($_REQUEST['info_capa'],TRUE);
        
        if($info_capa['mosaico'] == 1)
            $mosaico = "true";
        else
            $mosaico = "false";
        
        if($info_capa['capa_base'] == 1)
            $capa_base = "true";
        else
            $capa_base = "false";
        
        if($info_capa['visibilidad'] == 1)
            $visibilidad = "true";
        else
            $visibilidad = "false";
        
        if($info_capa['transparente'] == 1)
            $transparente = "true";
        else
            $transparente = "false";
        
        if($info_capa['seleccionable'] == 1)
            $seleccionable = "true";
        else
            $seleccionable = "false";

        include("../conn.php");
        
        $db_handle = @pg_connect($strCnx);
        
        
        if ($db_handle) 
        {
            
           $query2 = "UPDATE atributos_por_capa SET nombre_capa = '".$info_capa['nombre_capa'] ."',url = '".$info_capa['url']."', version_wms = '".$info_capa['version_wms']."', nombre_fantasia = '".$info_capa['nombre_fantasia']."', \"singleTile\" = '".$mosaico."',\"isBaseLayer\" = '".$capa_base."', \"numZoomLevels\" = '".$info_capa['zoom_level']."',visibility = '".$visibilidad."', transparent = '".$transparente."', nivel_de_arbol = '".$info_capa['nivel_arbol']."',estilo_wms = '".$info_capa['estilo_wms']."', version_wfs = '".$info_capa['version_wfs']."', select_control = '".$seleccionable."', estilo_wfs = '".$info_capa['estilo_wfs']."', type = '".$info_capa['type']."' WHERE id_capa = ".$info_capa['id_capa'].";";          
   
           $result2 = pg_query($db_handle,$query2);
           
           if($result2)
           {
               echo '{"success":true}';
               exit;
           }
           else
           {
                $mensaje = "Error al persistir cambios de la capa.";
                echo '{"success":false,"message":"'.$mensaje.'"}';
                exit;
           }
           
        }
        else
            {
                $mensaje = "Error al conectar con base de datos.";
                echo '{"success":false,"message":"'.$mensaje.'"}';
                exit;
            }
    
}

function borrarCapa($id_capa)
{
    include("../conn.php");
        $db_handle = pg_connect($strCnx);
        
        $json = Array();
        
        if ($db_handle) 
        {

           $query2 = 'DELETE FROM atributos_por_capa where id_capa='.$id_capa.';'; 
           $result2 = pg_query($db_handle,$query2);
           if($result2){
               
               $row = pg_fetch_row($result2);
               echo '{"success":true}';  
            }
            else
            {
                $mensaje = "Error al eliminar la capa.";
                echo '{"success":false,"message":"'.$mensaje.'"}';
                exit;
            }
        }else
        {
            $mensaje = "Error al conectar con base de datos.";
            echo '{"success":false,"message":"'.$mensaje.'"}';
            exit;
        }
}


function getTipoCapa($getTipoCapa){
    
        if($getTipoCapa == "")
        return;
    
        include("../$strCnx_layers.php");
        $db_handle = pg_connect($strCnx);
        
        if ($db_handle) 
        {

           $query2 = "SELECT  gc.type FROM geometry_columns as gc where f_table_name = '".$getTipoCapa."';"; 
           $result2 = pg_query($db_handle,$query2);
           if($result2){

                $row2 = pg_fetch_row($result2);
                
                       while ($row2 = pg_fetch_row($result2))
                       {
                            $bus = array(
                               'type' => $row2[0]
                           );
                           array_push($json, $bus);
                       }

                       $jsonstring = json_encode($json);
                       echo $jsonstring;
                    }
                    else
                    {
                        echo "{}";
                    }
        }
}
        
function getPerfil($user_name){
    

        include("../conn.php");
        $db_handle = pg_connect($strCnx);
        
        $json = Array();
        
        if ($db_handle) 
        {


           $query2 = "SELECT nombre,apellido,email,usuario,admin,avatarfile FROM usuarios WHERE email LIKE '".$user_name."'"; 
           $result2 = pg_query($db_handle,$query2);
           if($result2){
 
                while ($row = pg_fetch_row($result2))
                {
                     $bus = array(
                        'nombre' => $row[0],
                        'apellido' => $row[1],
                        'email' => $row[2],
                        'usuario' => $row[3],
                        'admin' => $row[4] ,
                        'avatarfile' => $row[5]
                    );
                    array_push($json, $bus);
                }

                $jsonstring = json_encode($json);
                echo $jsonstring;
          }
          else
          {
              echo '{"success":false,"message":"'.$mensaje.'"}';
              exit;
          }
        }
        
       
}

function setPerfil($user_name,$perfil)
{
        include("../conn.php");
        $db_handle = @pg_connect($strCnx);
        
        $id_usuario = getUnUsuario($user_name);

        //metodos implementados aprovechando la ejecucion en bloque de las transaciones
        
        $perfil_json = json_decode($perfil);
        
        
        if ($db_handle) 
        {
            
           $query2 = "UPDATE usuarios SET nombre='".$perfil_json->nombre."', apellido='".$perfil_json->apellido."', avatarfile='".$perfil_json->avatarfile."' WHERE usuarios.id_usuario=".$id_usuario.";";
           //and id_capa = ".$id_capa_estilo.";";
           
           
//           $query2 .=" INSERT INTO estilo_x_capa_x_usuario(id_usuario, id_capa,estilo) VALUES (".$id_usuario.", ".$id_capa_estilo.", ".$estilo.");";
           
           $result2 = @pg_query($db_handle,$query2);
           
           if($result2)
           {
               echo '{"success":true}';
               exit;
           }
           else
           {
                $mensaje = "Error al guardar el perfil.";
                echo '{"success":false,"message":"'.$mensaje.'"}';
                exit;
           }
           
        }
        else
            {
                $mensaje = "Error al conectar con base de datos.";
                echo '{"success":false,"message":"'.$mensaje.'"}';
                exit;
            }
}
?>
