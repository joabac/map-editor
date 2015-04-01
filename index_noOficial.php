<?php
  include("scripts/cargar_mapas.php"); 
  require("loguin/common.php");
  require_authentication();
  
?>

<head>
<meta charset=ISO-8859-1>
<title>Editor de Mapas - IDESF</title>

	<link rel="stylesheet" type="text/css" href="OpenLayers/theme/default/style.css"/>
        <!-- Basic CSS definitions -->
        <link rel="stylesheet" type="text/css" href="css/estilo.css" media="screen" />
        <script src="ext-3.4.0/adapter/ext/ext-base.js" type="text/javascript"></script>
        <script src="ext-3.4.0/ext-all.js"  type="text/javascript"></script>

        <link rel="stylesheet" type="text/css" href="ext-3.4.0/resources/css/ext-all.css"></link>
        <script src="http://maps.google.com/maps/api/js?v=3&amp;sensor=false"></script>
        <script src="OpenLayers/OpenLayers.js" type="text/javascript"></script> 

        <!--jquery UI-->
        <script type="text/javascript" src="js/jquery-ui/external/jquery/jquery.js"></script>
        <link type="text/css" href="js/jquery-ui/jquery-ui.min.css" rel="Stylesheet" />
        <link type="text/css" href="js/jquery-ui/jquery-ui.structure.min.css" rel="Stylesheet" />
        <link type="text/css" href="js/jquery-ui/jquery-ui.theme.min.css" rel="Stylesheet" />

        <!--Geo Ext-->
        <script type="text/javascript" src="GeoExt/script/GeoExt.js"></script>

        <script type="text/javascript" src="pnotify-1.2.0/jquery.pnotify.min.js"></script>
        <link href="pnotify-1.2.0/jquery.pnotify.default.css" media="all" rel="stylesheet" type="text/css" />
        <!-- Include this file if you are using Pines Icons. -->
        <link href="pnotify-1.2.0/style-icons/jquery.pnotify.default.icons.css" media="all" rel="stylesheet" type="text/css" />
        <script type="text/javascript" src="js/utileria.js"></script>
<?php
//primeras estructuras para instaciar el visualizador

                  echo "<script type='text/javascript'> 
                      
                      if (document.location.hostname == 'localhost')
                      {
                          OpenLayers.ProxyHost = '/cgi-bin/proxy.cgi?url=';
                      }
                      // pink tile avoidance
                      OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
                      // make OL compute scale according to WMS spec
                      OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;
                      var format = 'image/png';
                      var datum = 'EPSG:4326';
                      var datumWfs = 'EPSG:3857'
                      var bounds = [ -6763266.2670, -3720661.3167, -6748666.7946, -3705832.5332];
                      var map;
                      var options = {
                          controls: [],
                                  projection: 'EPSG:3857',
                          displayProjection: 'EPSG:3857',
                                  units: 'm'
                      };

                      map = new OpenLayers.Map('map', options);
                      
                      var userName = '".$_SESSION['username']."';       
                      </script>";

                      load_mapas($_SESSION['username']);
                      config_tabs($_SESSION['username']);
                      
                      echo "<script type='text/javascript' src='js/mapa_noOficial.js'></script>";

 ?>
    </head><!--onload="init() -->
    <body >


                <!--<div id="header"><h1>Visualizador de Mapas - IPEC</h1></div> -->
		<div id="desc">
			<div id="desc_precios" class="desc" style="visibility: hidden;">
				<ul>
					<li>
						<a> Filtro:</a>
						</br>
						 //<?php				 
//								include("conn.php");
//								//filtro por mes
//								echo "<select id='filter_anio' style='width:130px'>";
//								$db_handle = pg_connect($strCnx);
//								print("</br>");
//								print("<option value=0>Seleccione año</option>");
//								print("</br>");
//								if ($db_handle) 
//								{
//									//"Connection attempt succeeded.";
//								
//								   $query = "SELECT distinct date_part('year', to_timestamp(pg.fecha,'YYYY-mm-dd')) as anio FROM precios_georeferenciados as pg"; 
//								   $result = pg_query($db_handle,$query); 
//								   while ($row = pg_fetch_row($result))
//								   {
//										print("<option value=".$row[0].">".$row[0]."</option>");
//										print("</br>");
//								   } 
//								} 
//								else {
//									//echo 'Connection attempt failed.';
//								}
//								pg_FreeResult($result);
//								//pg_close($db_handle);
//								echo '</select>';
//								
//								echo "<select id='filter_mes' style='width:130px'>";
//								print("</br>");
//								print("<option value=0>Seleccione mes</option>");
//								print("</br>");
//								if ($db_handle) 
//								{
//									//"Connection attempt succeeded.";
//								
//								   $query = "SELECT distinct date_part('month', to_timestamp(pg.fecha,'YYYY-mm-dd')) as mes FROM precios_georeferenciados as pg"; 
//								   $result = pg_query($db_handle,$query); 
//								   while ($row = pg_fetch_row($result))
//								   {
//										print("<option value=".$row[0].">".$row[0]."</option>");
//										print("</br>");
//								   } 
//								} 
//								else {
//									//echo 'Connection attempt failed.';
//								}
//								pg_FreeResult($result);
//								//pg_close($db_handle);
//								echo '</select>';
//								
//								
//								//filtro por producto
//								echo "<select id='filter_precios' style='width:130px'>";
//								//$db_handle = pg_connect($strCnx);
//								print("</br>");
//								print("<option value=0>Seleccione producto</option>");
//								print("</br>");
//								if ($db_handle) 
//								{
//									//"Connection attempt succeeded.";
//								
//								   $query = 'SELECT id,nombre from "variedad" Where id IN (select distinct variedad_id from precios_georeferenciados)'; 
//								   $result = pg_query($db_handle,$query); 
//								   while ($row = pg_fetch_row($result))
//								   {
//										print("<option value=".$row[0].">".$row[1]."</option>");
//										print("</br>");
//								   } 
//								} 
//								else {
//									//echo 'Connection attempt failed.';
//								}
//								pg_FreeResult($result);
//								pg_close($db_handle);
//								echo '</select>';  
//						?>
                                                <img id="buscar" src="OpenLayers/img/east-mini.png"  onClick="updateFilterPrecios()" title="Aplicar filtro">
                                                <img id="resetFilterButton" src="OpenLayers/theme/default/img/close.gif"  onClick="resetFilterPrecios()" title="Reset filtro"/>
					</li>
				</ul>
			</div>
		  <div id="desc_delitos" class="desc" style="visibility: hidden;">
			
		  </div>
                   <div id="desc_ipcnu" class="desc" style="visibility: hidden;">
                       <ul><li>
                           <a> Area IPCNu:</a></br>
                           <span>
                                <input id="filter_ipcnu" onkeydown="if (event.keyCode == 13) document.getElementById('buscar_ipcnu').click()" type="text" size="with=130px"></input>
                                <img id="resetFilterButton_ipcnu" src="OpenLayers/theme/default/img/close.gif" style="float:right" onClick="resetFilterIpcNu()" title="Reset filtro"/>
                                <img id="buscar_ipcnu" src="OpenLayers/img/east-mini.png" style="float:right" onClick="updateFilteripcnu()" title="Aplicar filtro">
                           </span>
                       </li>
                       </ul>
                   </div>
		</div>
		<div id="info">
			<div id="info_precios" class="info" style="visibility: hidden;">
				<div id="media"></div>
				<div id="cuentaElementos"></div>
				<div id="valorMaximo"></div>
				<div id="valorMinimo"></div>
				<div id="valorNodo"></div>
				
			</div>
                        <div id="info_medidas" class="info" style="visibility: hidden;"></div>
		</div>
		<div id="location"></div>
		
    </body>
</html>
