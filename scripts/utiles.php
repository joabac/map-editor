<?php


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

function getUsers()
{        
        include("../conn.php");
        $db_handle = pg_connect($strCnx_loguin);
        
        $json = Array();
        
        if ($db_handle) 
        {

           $query2 = "SELECT id_usuario, email FROM usuarios;"; 
           $result2 = pg_query($db_handle,$query2);
           if($result2){
 
                while ($row = pg_fetch_row($result2))
                {
                     $bus = array(
                        'id_usuario' => $row[0],
                        'email' => $row[1]
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
        

?>
