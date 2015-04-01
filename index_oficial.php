<?php
  include("scripts/cargar_mapas.php"); 
  require("loguin/common.php");
  require_authentication();
  
  load_mapas();
?>

<head>
	<meta charset=ISO-8859-1>
        <title>Visualizador de Mapas - IPEC</title>
		<link rel="stylesheet" type="text/css" href="OpenLayers-2.12/theme/default/style.css"/>
        <!-- Basic CSS definitions -->
        <link rel="stylesheet" type="text/css" href="css/estilo.css" media="screen" />
        <script src="ext-3.4.0/adapter/ext/ext-base.js" type="text/javascript"></script>
		<script src="ext-3.4.0/ext-all.js"  type="text/javascript"></script>
		<link rel="stylesheet" type="text/css" href="ext-3.4.0/resources/css/ext-all.css"></link>
		<!--<script src="http://maps.google.com/maps/api/js?v=3&amp;sensor=false"></script>-->
		<script src="OpenLayers-2.12/OpenLayers.js" type="text/javascript"></script>
		
		<script type="text/javascript" src="js/jquery-ui-1.10.2.custom/js/jquery-1.9.1.js"></script>
		
		<link type="text/css" href="js/jquery-ui-1.10.2.custom/css/smoothness/jquery-ui-1.10.2.custom.css" rel="Stylesheet" />
		<script type="text/javascript" src="js/jquery-ui-1.10.2.custom/js/jquery-ui-1.10.2.custom.js"></script>
		<script type="text/javascript" src="js/jquery-ui-1.10.2.custom/js/jquery-ui-1.10.2.custom.min.js"></script>
		
		<script type="text/javascript" src="GeoExt/script/GeoExt.js"></script>
		<script type="text/javascript" src="js/mapa_oficial.js"></script>
		
		<script type="text/javascript" src="pnotify-1.2.0/jquery.pnotify.min.js"></script>
		<link href="pnotify-1.2.0/jquery.pnotify.default.css" media="all" rel="stylesheet" type="text/css" />
		<!-- Include this file if you are using Pines Icons. -->
		<link href="pnotify-1.2.0/style-icons/jquery.pnotify.default.icons.css" media="all" rel="stylesheet" type="text/css" />
		
    </head><!--onload="init() -->
    <body >
		<!--<div id="header"><h1>Visualizador de Mapas - IPEC</h1></div>-->
		<div id="desc" >
          <div id="desc_precios" style="visibility: hidden;">
           <ul>
                <li>
                    <a> Filtro:</a>   
					</br>
                     <?php				 
							include("conn.php");
							//filtro por mes
							echo "<select id='filter_anio' style='width:130px'>";
							$db_handle = pg_connect($strCnx);
							print("</br>");
							print("<option value=0>Seleccione año</option>");
							print("</br>");
							if ($db_handle) 
							{
								//"Connection attempt succeeded.";
							
							   $query = "SELECT distinct date_part('year', to_timestamp(pg.fecha,'YYYY-mm-dd')) as anio FROM precios_georeferenciados as pg"; 
							   $result = pg_query($db_handle,$query); 
							   while ($row = pg_fetch_row($result))
							   {
									print("<option value=".$row[0].">".$row[0]."</option>");
									print("</br>");
							   } 
							} 
							else {
								echo "<script type='text/javascript'> 
										$.pnotify({
											title: 'Error conectividad',
											text: 'Se produjo un error en la conectividad verifique su conectividad',
											icon: 'ui-icon ui-icon-error',
											styling: 'jqueryui',
											sticker: false,
											history: false,
											animation: 'fade'
										}); </script>";
							}
							pg_FreeResult($result);
							//pg_close($db_handle);
							echo '</select>';
							
							echo "<select id='filter_mes' style='width:130px'>";
							print("</br>");
							print("<option value=0>Seleccione mes</option>");
							print("</br>");
							if ($db_handle) 
							{
								//"Connection attempt succeeded.";
							
							   $query = "SELECT distinct date_part('month', to_timestamp(pg.fecha,'YYYY-mm-dd')) as mes FROM precios_georeferenciados as pg"; 
							   $result = pg_query($db_handle,$query); 
							   while ($row = pg_fetch_row($result))
							   {
									print("<option value=".$row[0].">".$row[0]."</option>");
									print("</br>");
							   } 
							} 
							else {
								//echo 'Connection attempt failed.';
							}
							pg_FreeResult($result);
							//pg_close($db_handle);
							echo '</select>';
							
							
							//filtro por producto
							echo "<select id='filter_precios' style='width:130px'>";
							//$db_handle = pg_connect($strCnx);
							print("</br>");
							print("<option value=0>Seleccione producto</option>");
							print("</br>");
							if ($db_handle) 
							{
								//"Connection attempt succeeded.";
							
							   $query = 'SELECT id,nombre from "variedad" Where id IN (select distinct variedad_id from precios_georeferenciados)'; 
							   $result = pg_query($db_handle,$query); 
							   while ($row = pg_fetch_row($result))
							   {
									print("<option value=".$row[0].">".$row[1]."</option>");
									print("</br>");
							   } 
							} 
							else {
								echo "<script type='text/javascript'> 
										$.pnotify({
											title: 'Error conectividad',
											text: 'Se produjo un error en la conectividad verifique su conectividad',
											icon: 'ui-icon ui-icon-error',
											styling: 'jqueryui',
											sticker: false,
											history: false,
											animation: 'fade'
										}); </script>";
							}
							pg_FreeResult($result);
							pg_close($db_handle);
							echo '</select>';  
					?>
					<img id="buscar" src="/geoserver/openlayers/img/east-mini.png" onClick="updateFilterPrecios()" title="Aplicar filtro">
                    <img id="resetFilterButton" src="/geoserver/openlayers/img/cancel.png" onClick="resetFilterPrecios()" title="Reset filter"/>
                </li>
            </ul>
          </div>
		</div>
		<div id="info">
			<div id="info_precios" style="visibility:hidden;">
				<div id="media"></div>
				<div id="cuentaElementos"></div>
				<div id="valorMaximo"></div>
				<div id="valorMinimo"></div>
				<div id="valorNodo"></div>
				
			</div>
		</div>
		<div id="location"></div>
		<div id="buscador">
			<div id="direccion" >
				<?php				 
					include("conn.php");
					//filtro por mes
					echo "<select id='localidadesipec' style='width:130px' name='localidadesipec' onchange='cargaDistritos(this)'>";
					$db_handle = pg_connect($strCnx);
					print("</br>");
					print("<option value=0>Seleccione Departamento</option>");
					print("</br>");
					if ($db_handle) 
					{
						//"Connection attempt succeeded.";
					
					   $query = "Select distinct coddep,nombre_depto FROM distritos;"; 
					   $result = pg_query($db_handle,$query); 
					   while ($row = pg_fetch_row($result))
					   {
							print("<option value=".$row[0].">".$row[1]."</option>");
							print("</br>");
					   } 
					} 
					else {
						echo "<script type='text/javascript'> 
										$.pnotify({
											title: 'Error conectividad',
											text: 'Se produjo un error en la conectividad verifique su conectividad',
											icon: 'ui-icon ui-icon-error',
											styling: 'jqueryui',
											sticker: false,
											history: false,
											animation: 'fade'
										}); </script>";
					}
					pg_FreeResult($result);
					//pg_close($db_handle);
					echo '</select>';
				?>
				<select id="dist" name="dist">
					<option value="0">Seleccione Distrito</option>
				</select>
				<select id="calle" name="calle">
					<option value="0">Seleccione Calle</option>
				</select>
			</div>
		</div>
    </body>
</html>
