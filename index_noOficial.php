<?php
  include("scripts/cargar_mapas.php"); 
  require("loguin/common.php");
  require_authentication();
  
?>

<head>
<meta charset="UTF-8">
<title>Editor de Mapas - IDESF</title>
        
	<link rel="stylesheet" type="text/css" href="OpenLayers/theme/default/style.css"/>
        <!-- Basic CSS definitions -->
        <link rel="stylesheet" type="text/css" href="css/estilo.css" media="screen" />
        <script src="ext-3.4.0/adapter/ext/ext-base.js" type="text/javascript"></script>
        <script src="ext-3.4.0/ext-all.js"  type="text/javascript"></script>
        <script src="ext-3.4.0/adapter/ext/StatusBar.js" type="text/javascript"></script>
        <link rel="stylesheet" type="text/css" href="ext-3.4.0/resources/css/visual/statusbar.css"></link>
        <link rel="stylesheet" type="text/css" href="ext-3.4.0/resources/css/ext-all.css"></link>
        <link rel="stylesheet" type="text/css" href="ext-3.4.0/resources/css/xtheme-sf_theme.css"></link>
        <script src="OpenLayers/OpenLayers.debug.js" type="text/javascript"></script> 

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
        

        <link href="js/gxp/git/src/theme/all.css" media="all" rel="stylesheet" type="text/css" />
        <!--<script type="text/javascript" src="js/gxp/gxp.js"></script>-->
        <script type="text/javascript" src="js/gxp/git/src/script/loader.js"></script>
        <script src="OpenLayers/lib/UndoRedo.js" type="text/javascript"></script>

<?php
//primeras estructuras para instaciar el visualizador
                  echo "<script type='text/javascript'> 
                      
//                      if (document.location.hostname == 'localhost')
//                      {
//                          OpenLayers.ProxyHost = '/cgi-bin/proxy.cgi?url=';
//                      }
                      // pink tile avoidance
                      OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
                      OpenLayers.Renderer.SVG.prototype.MAX_PIXEL = Number.MAX_VALUE
                      // make OL compute scale according to WMS spec
                      //OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;
                      var format = 'image/png';
                      var datum = 'EPSG:4326';
                      var datumWfs = 'EPSG:4326'
                      var bounds = [ -66.6826171875,-35.67939453125,-54.8173828125,-26.67060546875 ];
                      var map;
                      var options = {
                          controls: [],
                                  projection: 'EPSG:4326',
                                  displayProjection: 'EPSG:4326',
                                  units: 'degrees',
                                  maxResolution: 'auto',
                                  minResolution: 'auto'
                      };

                      map = new OpenLayers.Map('map', options);
                      
                      var userName = '".$_SESSION['username']."';   
                      
                      </script>";
                      
//                  cargo las capas a ser procesadas por el usuario
                  
                      load_mapas($_SESSION['username']);
                      config_tabs($_SESSION['username']);                      
                      
                      echo "<script type='text/javascript' src='js/mapa_noOficial.js'></script>";
                      
                      
 ?>
    </head><!--onload="init() -->
    <body >
        
                <div id="editor"></div>
                <!--<div id="header"><h1>Visualizador de Mapas - IPEC</h1></div> -->
		<div id="desc">
			<div id="desc_precios" class="desc" style="visibility: hidden;">
				
			</div>
		</div>
		<div id="info">
			
                        <div id="info_medidas" class="info" style="visibility: hidden;"></div>
		</div>
		<div id="location"></div>
		
                <div id="divIdMousePosition"></div>
                

    <script src="js/javascript.util.js" type="text/javascript"></script>
    <script src="js/jsts.js" type="text/javascript"></script> <!--     libreria de computo de geometrias-->
    </body>
</html>
