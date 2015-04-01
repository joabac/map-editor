<?php 
 // require("../loguin/common.php");

  //require_authentication();

?>

<head>
<title>Back Office Editor de Mapas - IDESF</title>
<script type="text/javascript" src="../js/jquery-ui/external/jquery/jquery.js"></script>
<link type="text/css" href="../js/jquery-ui/jquery-ui.min.css" rel="Stylesheet" />
<link type="text/css" href="../js/jquery-ui/jquery-ui.structure.min.css" rel="Stylesheet" />
<link type="text/css" href="../js/jquery-ui/jquery-ui.theme.min.css" rel="Stylesheet" />
<script type="text/javascript" src="../js/jquery-ui/jquery-ui.min.js"></script>
<link rel="stylesheet" type="text/css" href="../css/estilo.css" />
<!-- Include this file if you are using Pines Icons. -->
<script src="../ext-3.4.0/adapter/ext/ext-base.js" type="text/javascript"></script>
<link rel="stylesheet" type="text/css" href="../ext-3.4.0/resources/css/ext-all.css"></link>
<script src="../ext-3.4.0/ext-all.js"  type="text/javascript"></script>
<link rel="stylesheet" type="text/css" href="../css/tab-scroller-menu.css" />


<script type="text/javascript" src="../pnotify-1.2.0/jquery.pnotify.min.js"></script>
<link href="../pnotify-1.2.0/jquery.pnotify.default.css" media="all" rel="stylesheet" type="text/css" />
<link href="../pnotify-1.2.0/style-icons/jquery.pnotify.default.icons.css" media="all" rel="stylesheet" type="text/css" />
<script src="../OpenLayers/OpenLayers.js" type="text/javascript"></script> 
<script type="text/javascript" src="../js/utileria.js"></script>

<script src="../js/jquery-validation-1.11.1/dist/jquery.validate.min.js"></script>
<script src="../js/jquery-validation-1.11.1/dist/additional-methods.min.js"></script>

<link type="text/css" href="../css/portal.css" rel="Stylesheet" />
<link type="text/css" href="../css/groupTabs.css" rel="Stylesheet" />

<script type="text/javascript" src="../js/groupTabPanel.js"></script>
<script type="text/javascript" src="../js/groupTab.js"></script>
<script type="text/javascript" src="../js/portal.js"></script>
<script type="text/javascript" src="../js/portalColumn.js"></script>
<script type="text/javascript" src="../js/portlet.js"></script>


<script type="text/javascript" src="../js/admin.js"></script>
</head>
<body>

<div id="abmCapas" style="padding:25px 50px 0px 80px; visibility:hidden">

    <h2 style="padding-top: 1em; padding-bottom: 1em;">Este panel permite dar de alta nuevas capas</h2>
    <div id="left-lista-capas">
        <table>
            <tr>
            <th><h2>Capas disponibles</h2></th>
            </tr>
        </table>

        <ul id="lista_capas">
           
        </ul>
        
        <div class="barra_botones_left" style="width:100%">
            <button id="add_capa" title="agregar una nueva capa al listado" style="margin-top: 3px;">Agrega Capa</button> 
            <button id="del_capa" title="Eliminar una capa seleccionada del listado" style="margin-top: 3px;">Remover Capa</button> 
        </div>
    </div>  
    
<div id="infoCapas">
<!--id_capa integer NOT NULL, -- id unico por capa -->
<form id="datos_edicion" class="cmxform">
    <fieldset class="ui-widget ui-widget-content ui-corner-all">
       <input type="hidden" id="id_capa" disabled="disabled"/>
       <table id="tabla_datos"> 
        <tr>
        <td><label for="nombre_capa">Nombre de capa:</label> </td>
        <td><input name="nombre_capa" type="text" id="nombre_capa"  disabled="disabled"/></td>
        </tr>
        <tr>
        <td><label for="nombre_fantasia">Nombre Fantasia: </label></td>
        <td><input type="text" name="nombre_fantasia" id="nombre_fantasia" disabled="disabled"/></td>
        </tr>
        <tr>
        <td ><label for="url">URL: </label></td>
        <td><input type="text" name="url" id="url" disabled="disabled"/></td>
        </tr>
        <tr>
        <td ><label for="numZoomLevels">Niveles de Zoom:</label> </td>
        <td><input type="text"  name="numZoomLevels" id="numZoomLevels" disabled="disabled"/></td>
        </tr>
        <tr>
        <td ><label for="nivel_de_arbol">Nivel en Arbol: </label></td>
        <td><input  type="text" name="nivel_de_arbol" id="nivel_de_arbol" disabled="disabled"/></td>
        </tr>
        <tr>
        <td><label for="singleTile">Mosaico unico:</label> </td>
        <td><input type="checkbox" name="singleTile" id="singleTile" disabled="disabled"/></td>
        </tr>
        <tr>
        <td><label for="base_layer">Capa base: </label></td>
        <td><input type="checkbox" name="base_layer" id="base_layer" disabled="disabled"/></td>
        </tr>
        <tr>
        <td ><label for="visible">Visible: </label></td>
        <td><input type="checkbox" name="visible" id="visible" disabled="disabled"/></td>
        </tr>
        <tr>
        <td ><label for="transparent">Transparente: </label></td>
        <td><input type="checkbox" name="transparent" id="transparent" disabled="disabled"/></td>
        </tr>
        <tr>
        <td><label for="select_control">Seleccionable: </label></td>
        <td><input type="checkbox" name="select_control" id="select_control" disabled="disabled"/></td>
        </tr>
        <tr>
        <td ><label for="estilo_wms">Estilo WMS: </label></td>
        <td><input  type="text" name="estilo_wms" id="estilo_wms" disabled="disabled"/></td>
        </tr>
        <tr>
        <td ><label for="version_wms">Version WMS: </label></td>
        <td><input  type="text" name="version_wms" id="version_wms" disabled="disabled"/></td>
        </tr>
        <tr>
        <td><label for="wfs_layer_check">Capa WFS: </label></td>
        <td><input type="checkbox" name="wfs_layer_check" id="wfs_layer_check" disabled="disabled"/></td>
        </tr>
        <tr>
        <td ><label for="version_wfs">Version WFS: </label></td>
        <td><input  type="text" name="version_wfs" id="version_wfs" disabled="disabled"/></td>
        </tr>
        <tr>
        <td><label for="estilo_wfs">Estilo WFS:</label> </td>
        <td><input type="text" name="estilo_wfs" id="estilo_wfs" disabled="disabled"/></td>
        </tr>
        <!--tr>        
        <td><label for="tipo_wfs">Tipo de Capa: </label></td>
        <td>
            <fieldset id="feature_type">
                <label for="tipo_wfs"></label>
                <select name="tipo_wfs" id="tipo_wfs">
                    <option value="WMS" selected>WMS</option>
                    <option value="POINT" >PUNTOS</option>
                    <option value="LINESTRING" >POLILINEAS</option>
                    <option value="POLYGON" >POLIGONOS</option>
                </select>  
            </fieldset>
        </td>
        </tr-->
    </table> 
</fieldset>

</form>
    <div class="barra_botones_right">
        <button id="editar_capa" title="Editar capa actual" style="margin-top: 3px;">Editar</button>
        <button id="guarda_capa" title="Guardar cambios realizados" style="margin-top: 3px;">Guardar</button>
    </div>
  </div>
</div>
    
<div id="dualList" style="padding:25px 50px 0px 80px; visibility:hidden">
    
<h2 style="padding-top: 1em; padding-bottom: 1em;">Este panel permite administrar las relaciones capas a usuarios</h2>

<div class="select_usuarios">
    <select id="usuarios"></select>
</div>
<div id="multiselect">
    <div class="left">
        <table>
            <tr>
            <th><h2>Capas disponibles</h2></th>
            </tr>
            <tr>
            <td>Nombre de Capa</td>
            </tr>
        </table>

        <ul id="left-lista">
           
        </ul>
        <a class="btn" id="add" style="margin-top: 3px">Añadir todo</a>
    </div>

    <div class="right">
       
        <table>
            <th><h2>Capas asociadas</h2></th>
            <tr>
                <td>Nombre de Capa</td>
                <td style="padding-left: 60px;">WFS</td>
            </tr>
        </table>
      
        <ul id="right-lista">
            
        </ul>
        <a class="btn" id="remove" style="margin-top: 3px">Quitar todos</a>
        
    </div>

    <div class="barra_botones_right">
        <button id="btn_salvar">Salvar!</button>
    </div>
</div>
    
</div>
    
</body>