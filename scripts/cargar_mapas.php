<?php

function load_mapas($email){
    
    if($email == "")
        return;
    
        include("./conn.php");
        $db_handle = pg_connect($strCnx);
        

        if ($db_handle) 
        {
           $query = "SELECT id_capa,protocolo FROM capas_asociadas WHERE id_usuario = (select id_usuario from usuarios where email like '".$email."');"; 
           $result = pg_query($db_handle,$query); 
           
           echo '<script type="text/javascript"> var array_capas = new Array();';
           
           while ($row = pg_fetch_row($result))
           {
                 if($row[1] == 'wms')
                 {
                       $capa_conformada = wms_layer($row[0],$row[1]);
                       if($capa_conformada != "{}")
                       {
                           echo 'array_capas.push('.$capa_conformada.');';
                       }
                       
                 }
                 else{
                     $capa_conformada = wfs_layer($row[0],$row[1]);
                     if($capa_conformada != "{}")
                     {
                           echo 'array_capas.push('.$capa_conformada.');';
                     }
                  }
           } 
           pg_FreeResult($result);
           
           echo '</script>';
           
           
           
        } 
        else {
                 echo '</script>';//echo 'Connection attempt failed.'
        }
                                           
}

function config_tabs($email)
{

    if($email == "")
        return;
    
        include("./conn.php");
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
                        echo '<script type="text/javascript"> var tab_items = new Array();';
                        echo "tab_items.push(new Object({title:'Usuario',baseCls:'config_panel'}));";
                        echo "tab_items.push(new Object({title:'Gestion de Usuarios',baseCls:'config_panel'}));";
                        echo "tab_items.push(new Object({title:'Gestion de Capas',baseCls:'config_panel',autoLoad:{url:'scripts/layerAdmin.php', params:'user=".$email."' }}));";
                        echo '</script>';
                        
                    }
                    else
                        {
                         return;
                        }

                }
                
                 return;
                
                
           }
           
            return;
           
            
        
        }
    
}
    
    function wms_layer($id_capa,$protocolo)
    {
        if($id_capa == "")
            return;
        
        include("./conn.php");
        $db_handle = pg_connect($strCnx);

        if ($db_handle) 
        {
           //"Connection attempt succeeded.";

           $query = 'SELECT nombre_fantasia,url, nombre_capa, version_wms, transparent , "singleTile","isBaseLayer", "numZoomLevels", visibility,nivel_de_arbol,estilo_wms FROM atributos_por_capa WHERE id_capa = '.$id_capa.';'; 
           $result = pg_query($db_handle,$query); 
           if($result){
            
               $row = pg_fetch_row($result);
           
                if ($row){
                     $capa_wms = ' {nombre_fantasia : "'.$row[0].'",
                     url : "'.$row[1].'",
                     nombre_capa : "'.$row[2].'",
                     version_wms : "'.$row[3].'",
                     transparent : '.$row[4].',
                     singleTile : '.$row[5].',
                     isBaseLayer : '.$row[6].',
                     numZoomLevels : '.$row[7].',
                     visibility : '.$row[8].',
                     protocolo : "'.$protocolo.'",
                     nivel_de_arbol: "'.$row[9].'",
                     estilo_wms: "'.$row[10].'",
                     id_capa: "'.$id_capa.'"}';
                     return $capa_wms;
                }
           }
       
        } 
        else {
                return "{}";//echo 'Connection attempt failed.';
        }
        pg_FreeResult($result);
        
        return "{}";
        
    }
    
    function wfs_layer($id_capa,$protocolo)
    {
        
         if($id_capa == "")
            return;
         
        include("./conn.php");
        $db_handle = pg_connect($strCnx);

        if ($db_handle) 
        {
           //"Connection attempt succeeded.";

           $query = 'SELECT nombre_fantasia,url, nombre_capa, version_wfs, transparent , "singleTile","isBaseLayer", "numZoomLevels", visibility,nivel_de_arbol,estilo_wfs,select_control,"featureNS" FROM atributos_por_capa WHERE id_capa = '.$id_capa.';'; 
           $result = pg_query($db_handle,$query); 
           if($result){
            
               $row = pg_fetch_row($result);
           
                if ($row){
                     $capa_wfs = ' {nombre_fantasia : "'.$row[0].'",
                     url : "'.$row[1].'",
                     nombre_capa : "'.$row[2].'",
                     version_wfs : "'.$row[3].'",
                     transparent : '.$row[4].',
                     singleTile : '.$row[5].',
                     isBaseLayer : '.$row[6].',
                     numZoomLevels : '.$row[7].',
                     visibility : '.$row[8].',
                     protocolo : "'.$protocolo.'",
                     nivel_de_arbol: "'.$row[9].'",
                     estilo_wfs: "'.$row[10].'",
                     select_control: '.$row[11].',
                     featureNS:"'.$row[12].'",
                     id_capa: "'.$id_capa.'"}';

                     return $capa_wfs;
                }
           }
       
        } 
        else {
                return "{}";//echo 'Connection attempt failed.';
        }
        pg_FreeResult($result);
        
        return "{}";
        
    }
?>
