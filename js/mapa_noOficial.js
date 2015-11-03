/**
 * Copyright (c) 2014
 * IDESF 2014
 */

var mapPanel,tree;
var filter,filterStrategy;
var mostrar_mensajes= false;
var activeLayer = "";
var editingLayer = null;
var layer_limite = null;
var saveStrategy = null;
var seleccionSimpleCapaEditada = null;
var seleccionLimites = null;
var hoverLayer, rule;
var extentSF = new OpenLayers.Bounds(-63.599853515625,  -35.557250976563,  -58.18359375,  -26.240844726563);
//capas

var capas = new Array();


var stores = new Array();
var layerLists = new Array();
var nodos = new Array();
var LayerNodeUI;  //estilo para nodos

//map toolbar

var actions = {}, toolbarItems = [];
var toggleGroup = "controles de medida";
var toogleDrawGroup = "controles de dibujo";
var seleccionGroup = "grupo herramientas seleccion";
//nombre de capas

var pureCoverage = false;
var highlightCtrl;
var selectCtrl = new Array();
	
array_capas.forEach(cargarCapas);

var grilla;
var gridMenu;
var stylerPopup;
var statusbarItems;
var escala_permitida = -1; //setear nivel minimo de edicion.
var editor_estilos_activo = false;
var editor_estilo;
var SnapWin;
var controlSnap;
var undoRedo;
var undoRedoOnDo;
var csz = document.createEvent('KeyboardEvents');
var icono_estado = 'x-status-valid';
var settingsDialog;
var original_feature;
var perfil;
var form;
var perfil_usuario;
Ext.namespace('Ext.avatars');
Ext.avatars.files = [
    ['avatar 1', 'avatar-1.png'],
    ['avatar 2', 'avatar-2.png'],
    ['avatar 3', 'avatar-3.png'],
    ['avatar 4', 'avatar-4.png'],
    ['avatar 5', 'avatar-5.png'],
    ['avatar 6', 'avatar-6.png'],
    ['avatar 7', 'avatar-7.png'],
    ['avatar 8', 'avatar-8.png'],
    ['avatar 9', 'avatar-9.png'],
    ['avatar 10', 'avatar-10.png'],
    ['avatar 11', 'avatar-11.png'],
    ['avatar 12', 'avatar-12.png'],
    ['avatar 13', 'avatar-13.png'],
    ['avatar 14', 'avatar-14.png'],
    ['avatar 15', 'avatar-15.png'],
    ['avatar 16', 'avatar-16.png'],
    ['avatar 17', 'avatar-17.png'],
    ['avatar 18', 'avatar-18.png']
    
];
var store = new Ext.data.ArrayStore({
    fields: ['nombre', 'file'],
    data : Ext.avatars.files
});

var winHelp;


csz.initKeyboardEvent(
           'keydown', 
           true,     // key down events bubble 
           true,     // and they can be cancelled 
           document.defaultView,  // Use the default view 
           true,        // ctrl 
           false,       // alt
           true,        //shift
           false,       //meta key 
           90,          // keycode
           0
          );

//variable global para gestion de eliminacion de features
//es global porque la utilizan todos los tipos de capas vector
var DeleteFeature = OpenLayers.Class(OpenLayers.Control, {
    initialize: function(layer, options) {
        OpenLayers.Control.prototype.initialize.apply(this, [options]);
        this.layer = editingLayer;
        this.handler = new OpenLayers.Handler.Feature(this, layer, {click: this.clickFeature});
    },
    clickFeature: function(feature) {
        // if feature doesn't have a fid, destroy it
            Ext.Msg.show({
                           title : 'Atención',
                           msg : '¿Desea eliminar este objeto geográfico? </br> El proceso es irreversible!',
                           buttons : Ext.Msg.YESNO,

                           fn : function(btn,text,opt) {
                                            
                                if (btn == 'yes' ) { 
                               
                                        var editLayer = editingLayer;
                                        if(feature.fid == undefined) {
                                            editLayer.destroyFeatures([feature]);
                                        } else {
                                            editLayer.drawFeature(feature,{display: "none"}) ;
                                            feature.state = OpenLayers.State.DELETE;
                                            //editLayer.removeFeatures(feature);
                                            editLayer.events.triggerEvent("afterfeaturemodified", {feature: feature});
                                            
                                            //feature.renderIntent = "select";
                                        }
                                }
                           },
                           icon : Ext.MessageBox.QUESTION
               });
    },
    setMap: function(map) {
        this.handler.setMap(map);
        OpenLayers.Control.prototype.setMap.apply(this, arguments);
    },
    CLASS_NAME: "OpenLayers.Control.DeleteFeature"
});

OpenLayers.Handler.Feature.prototype.clickTolerance = 10;

//carga la capa que define las regiones habilitadas para dibujar que tiene asignadas el usuario
function cargarGeometriasLimite(nombreCapa)
{
   
                        var temporary_style = new OpenLayers.Style( {
                                    cursor: "inherit",
                                    fillColor: "#ddf3e5",
                                    fillOpacity: 0.4,
                                    fontColor: "#000000",
                                    hoverFillColor: "#ffffff",
                                    hoverFillOpacity: 0,
                                    hoverPointRadius: 1,
                                    hoverPointUnit: "%",
                                    hoverStrokeColor: "#ff0000",
                                    hoverStrokeOpacity: 1,
                                    hoverStrokeWidth: 0.2,
                                    label:"",
                                    labelAlign: "cm",
                                    labelOutlineColor: "#ffffff",
                                    labelOutlineWidth: 3,
                                    pointRadius: 6,
                                    pointerEvents: "visiblePainted",
                                    strokeColor: "#ff0000",
                                    strokeDashstyle: "dash",
                                    strokeDashstyle:"5 10 5 10",
                                    strokeLinecap: "round",
                                    strokeOpacity: 1,
                                    strokeWidth: 3
                                });

                        // strokeColor	{String} Color for line stroke.
                        // strokeOpacity	{Number} Stroke opacity (0-1).
                        // strokeWidth	{Number} Pixel stroke width.
                        // strokeLinecap	{String} Stroke cap type (“butt”, “round”, or “square”).
                        // strokeDashstyle	{String} Stroke dash style according to the SLD spec.
                        // fillColor	{String} RGB hex fill color (e.g.
                        // fillOpacity

                        var id_capa = parseInt(array_capas.buscar_por_nombre(nombreCapa).id_capa);
                        var parametros = {Parametro:'getCapaLimite',id_capa:id_capa,user_name:userName};
                        var limite = '';
                        
                        $.ajax({
                                type: "POST",
                                async: false,
                                url: "scripts/utiles.php",
                                dataType: "json",
                                success: function(msg) {
                                    
                                    if(msg.length  > 0)
                                    {
                                        limite = msg[0].limite;
                                        escala_permitida = msg[0].resolucion_permitida; //siempre cargo la escala 
                                    }
                                    else //no hay limite definido
                                    {
                                        limite = '';
                                        escala_permitida = -1; //siempre cargo la escala 
                                    }
                                },
                                error: function() { //error de transaccion

                                    mensajeError("Error", "Error al recuperar el limite para la capa");
                                    escala_permitida = -1;
                                },
                                data: parametros
                        });

                        if(limite !== '')
                        {
                            
                                if(parseInt(escala_permitida) > map.getScale())
                                {
                                        var geoJSON_limite = new OpenLayers.Format.GeoJSON();

                                        var features = geoJSON_limite.read(limite);

                                        if(features) {

                                                if(features.constructor != Array) {
                                                    features = [features];
                                                }
                                                mensajeInformativo('Capa limites','Se cargo correctamente la capa de regiones habilitadas.');

                                                layer_limite = new OpenLayers.Layer.Vector('Region Habilitada' ,
                                                                                {
                                                                                    visibility: true,
                                                                                    isBaseLayer: false,
                                                                                    displayInLayerSwitcher: true,

                                                                                    styleMap: new OpenLayers.StyleMap({default: temporary_style})
                                                                                });

                                                mapPanel.map.addLayer(layer_limite);
                                                mapPanel.map.setLayerIndex(layer_limite,0);
                                                layer_limite.addFeatures(geoJSON_limite.read(limite));
                                        }
                                        else
                                        {
                                            escala_permitida = -1;
                                            mensajeError('Error en Capa limites','No se pudo cargar la capa de regiones habilitadas, refresque la página o contacte al administrador.');
                                        }
                                    
                                }
                                else
                                {
                                    escala_permitida = -1;
                                    mensajeError('Error','Escala de dibujo no permtida.');
                                }
                                return true;

                        }
                        else//capa sin limites definidos
                        {
                            
                            return false;

                        }    
}

function cargarCapas(objetoCapa)
{
    if(objetoCapa.protocolo === 'wms')
    {
                     //nombre_fantasia,url, nombre_capa, 
                     //version_wms, transparent , "singleTile",
                     //"isBaseLayer", "numZoomLevels", visibility
                    
                       var estilo = objetoCapa.estilo_wms;
                       if(estilo == null)
                       { estilo = ""}
                       
                       capas.push( new OpenLayers.Layer.WMS(
                                        objetoCapa.nombre_fantasia, objetoCapa.url,
                                        {
                                            LAYERS:[objetoCapa.nombre_capa], //armo grupo de capas separadas por criterio
                                            version: objetoCapa.version_wms,
                                            format: format,
                                            transparent: objetoCapa.transparent,
                                            srsName: datum,
                                            styles: estilo
                                        },
                                        {
//                                            tileOptions: {
                                                    eventListeners: {
                                                            'loadend': function(evt) {
                                                                if($(".olImageLoadError").size() > 0){
                                                                    mensajeError("Error al cargar capas", "error al cargar la capa: " + objetoCapa.nombre_fantasia +", "+$(".olImageLoadError").size()+" zocalos no pudieron ser cargados.");
                                                                    Ext.getCmp('basic-statusbar').setStatus({text:'Errores en la carga de capas.', iconCls:'x-status-error'}); 
                                                                }
                                                            }
                                                    }
//                                            }
                                            ,
                                            singleTile: objetoCapa.singleTile,
                                            displayInLayerSwitcher: false,  //oculta del listado de capas estandar
                                            isBaseLayer: objetoCapa.isBaseLayer,
                                            numZoomLevels: objetoCapa.numZoomLevels,
                                            visibility:objetoCapa.visibility
                                        } 
                                    ) 
                          );
    }
    else{//capas WFS
                     
                     var estilo_grafico = objetoCapa.estilo_wfs;
                     var estilo_json = getEstilos(objetoCapa.id_capa);
                     var estilo_inicial;
                     var symbolizer;
                     var symbolizerText;
                     var sldConfig;
                     var sld;
                     var simbolizer_temporal;
                     
                if(estilo_json != null){
                    
                        if(typeof estilo_json.Point != 'undefined')
                        {                                
                                symbolizer = new OpenLayers.Symbolizer.Point(estilo_json.Point);
                                            
                                estilo_inicial = {
                                                strokeColor : estilo_json.Point.strokeColor,
                                                strokeOpacity : estilo_json.Point.strokeOpacity,
                                                strokeWidth : estilo_json.Point.strokeWidth,
                                                strokeLinecap : estilo_json.Point.strokeLinecap,
                                                strokeDashstyle : estilo_json.Point.strokeDashstyle,
                                                fillColor:estilo_json.Point.fillColor,
                                                fillOpacity: estilo_json.Point.fillOpacity ,
                                                pointRadius:estilo_json.Point.pointRadius,
                                                graphicName:estilo_json.Point.graphicName,
                                                rotation:estilo_json.Point.rotation,
                                                
                                                    //se puede agregar la opcion del grafico
                                            };
                                                //strokeColor	{String} Color for line stroke.
                                                //strokeOpacity	{Number} Stroke opacity (0-1).
                                                //strokeWidth	{Number} Pixel stroke width.
                                                //strokeLinecap	{String} Stroke cap type (“butt”, “round”, or “square”).
                                                //strokeDashstyle	{String} Stroke dash style according to the SLD spec.
                                                //fillColor	{String} RGB hex fill color (e.g.
                                                //fillOpacity	{Number} Fill opacity (0-1).
                                                //pointRadius	{Number} Pixel point radius.
                                                //externalGraphic	{String} Url to an external graphic that will be used for rendering points.
                                                //graphicWidth	{Number} Pixel width for sizing an external graphic.
                                                //graphicHeight	{Number} Pixel height for sizing an external graphic.
                                                //graphicOpacity	{Number} Opacity (0-1) for an external graphic.
                                                //graphicXOffset	{Number} Pixel offset along the positive x axis for displacing an external graphic.
                                                //graphicYOffset	{Number} Pixel offset along the positive y axis for displacing an external graphic.
                                                //rotation	{Number} The rotation of a graphic in the clockwise direction about its center point (or any point off center as specified by graphicXOffset and graphicYOffset).
                                                //graphicName
                                                
                                simbolizer_temporal = {"Point":symbolizer,"Text":{}};
                                                          
                        }
                        
                        if(typeof estilo_json.Line != 'undefined')
                        {
                                symbolizer = new OpenLayers.Symbolizer.Line( estilo_json.Line);
                                estilo_inicial = {
                                                strokeColor : estilo_json.Line.strokeColor,
                                                strokeOpacity : estilo_json.Line.strokeOpacity,
                                                strokeWidth : estilo_json.Line.strokeWidth,
                                                strokeLinecap : estilo_json.Line.strokeLinecap,
                                                strokeDashstyle : estilo_json.Line.strokeDashstyle
                                              
                                            };
//                                strokeColor	{String} Color for line stroke.
//                                strokeOpacity	{Number} Stroke opacity (0-1).
//                                strokeWidth	{Number} Pixel stroke width.
//                                strokeLinecap	{String} Stroke cap type (“butt”, “round”, or “square”).
//                                strokeDashstyle
                                  
                                  simbolizer_temporal = {"Line":symbolizer,"Text":{}};
                        }

                        if(typeof estilo_json.Polygon != 'undefined')
                        {                                
                                symbolizer = new OpenLayers.Symbolizer.Polygon(estilo_json.Polygon);
                                
                                estilo_inicial = {
                                                strokeColor : estilo_json.Polygon.strokeColor,
                                                strokeOpacity : estilo_json.Polygon.strokeOpacity,
                                                strokeWidth : estilo_json.Polygon.strokeWidth,
                                                strokeLinecap : estilo_json.Polygon.strokeLinecap,
                                                strokeDashstyle : estilo_json.Polygon.strokeDashstyle,
                                                fillColor : estilo_json.Polygon.fillColor,
                                                fillOpacity : estilo_json.Polygon.fillOpacity
                                            };
                                            
//                                            strokeColor	{String} Color for line stroke.
//                                            strokeOpacity	{Number} Stroke opacity (0-1).
//                                            strokeWidth	{Number} Pixel stroke width.
//                                            strokeLinecap	{String} Stroke cap type (“butt”, “round”, or “square”).
//                                            strokeDashstyle	{String} Stroke dash style according to the SLD spec.
//                                            fillColor	{String} RGB hex fill color (e.g.
//                                            fillOpacity
                                simbolizer_temporal = {"Polygon":symbolizer,"Text":{}};
                        }

                        if(typeof estilo_json.Text != 'undefined')
                        {
                                symbolizerText = new OpenLayers.Symbolizer.Text(estilo_json.Text);
                                            
                                estilo_inicial.fontColor = estilo_json.Text.fontColor;
                                estilo_inicial.fontOpacity = estilo_json.Text.fontOpacity;
                                estilo_inicial.fontSize = estilo_json.Text.fontSize;
                                estilo_inicial.label = estilo_json.Text.label;
                                estilo_inicial.fontFamily = estilo_json.Text.fontFamily;
                                estilo_inicial.zIndex = estilo_json.Text.zIndex;  
                         
                                simbolizer_temporal.Text = symbolizerText;
                                
                        }
                        else
                        {
                            if(typeof estilo_json.Line != 'undefined' || typeof estilo_json.Point != 'undefined'||typeof estilo_json.Polygon != 'undefined'){
                                simbolizer_temporal.Text = new OpenLayers.Symbolizer.Text({CLASS_NAME: "OpenLayers.Symbolizer.Text",graphicName: "circle",rotation: 0,vendorOptions: {},zIndex: 0 });
                            }
                        }
                        
                        var temporary_style = new OpenLayers.Style( {
                                    cursor: "inherit",
                                    fillColor: "#F5D223",
                                    fillOpacity: 0.4,
                                    fontColor: "#000000",
                                    hoverFillColor: "#ffffff",
                                    hoverFillOpacity: 0.8,
                                    hoverPointRadius: 1,
                                    hoverPointUnit: "%",
                                    hoverStrokeColor: "#ff0000",
                                    hoverStrokeOpacity: 1,
                                    hoverStrokeWidth: 0.2,
                                    label:"",
                                    labelAlign: "cm",
                                    labelOutlineColor: "#ffffff",
                                    labelOutlineWidth: 3,
                                    pointRadius: 6,
                                    pointerEvents: "visiblePainted",
                                    strokeColor: "#FF7700",
                                    strokeDashstyle: "solid",
                                    strokeLinecap: "round",
                                    strokeOpacity: 1,
                                    strokeWidth: 2
                                });
                        var selected_style = new OpenLayers.Style({
                                    cursor: "pointer",
                                    fillColor: "#0033ff",
                                    fillOpacity: 0.4,
                                    fontColor: "#000000",
                                    hoverFillColor: "#ffffff",
                                    hoverFillOpacity: 0.8,
                                    hoverPointRadius: 1,
                                    hoverPointUnit: "%",
                                    hoverStrokeColor: "#ff0000",
                                    hoverStrokeOpacity: 1,
                                    hoverStrokeWidth: 0.2,
                                    label:"",
                                    labelAlign: "cm",
                                    labelOutlineColor: "#ffffff",
                                    labelOutlineWidth: 3,
                                    pointRadius: 6,
                                    pointerEvents: "visiblePainted",
                                    strokeColor: "#003377",
                                    strokeDashstyle: "solid",
                                    strokeLinecap: "round",
                                    strokeOpacity: 1,
                                    strokeWidth: 2
                                });
                  
                        if(typeof estilo_json.minScaleDenominator != 'undefined')
                                minScaleDenominator =estilo_json.minScaleDenominator;
                        else
                        {
                            minScaleDenominator= null;
                        }
                        
                        if(typeof estilo_json.maxScaleDenominator != 'undefined')
                                maxScaleDenominator = estilo_json.maxScaleDenominator;
                        else
                        {
                           maxScaleDenominator = null; 
                        }

                        var estiloMapa = new OpenLayers.StyleMap({
                                                                'default': new OpenLayers.Style(
                                                                    estilo_inicial,
                                                                    {
                                                                    defaultsPerSymbolizer: false,
                                                                    description: "estilo por defecto",
                                                                    isDefault: true,
                                                                    layerName: objetoCapa.nombre_capa,
                                                                    name: "default",
                                                                    rules: [
                                                                            new OpenLayers.Rule({
                                                                                    title : estilo_json.title,
                                                                                    context: null,
                                                                                    description: null,
                                                                                    elseFilter: false,
                                                                                    filter: null,
                                                                                    maxScaleDenominator: maxScaleDenominator,
                                                                                    minScaleDenominator: minScaleDenominator,
                                                                                    name: null,
                                                                                    symbolizer: simbolizer_temporal
                                                                                })  
                                                                    ]
                                                                }),
                                                                'temporary':temporary_style,
                                                                'select': selected_style
                                                                
                                                        });
                                                        
                                                        
                        var schemaURI = objetoCapa.url + '/DescribeFeatureType?version='+objetoCapa.version_wfs+'&typename='+objetoCapa.nombre_capa;
                        var layer = new OpenLayers.Layer.Vector(objetoCapa.nombre_fantasia,  
                        {
                                    protocol: new OpenLayers.Protocol.WFS({
                                            version: objetoCapa.version_wfs,
                                            srsName: datumWfs ,
                                            url: objetoCapa.url,
                                            featureType: objetoCapa.nombre_capa,
                                            featureNS: objetoCapa.featureNS,//'nombre exacto de geoserver para el name space',
                                            geometryName: "the_geom",
                                            renderers: ['SVG','Canvas'],
                                            schema: schemaURI
                                    }),
                                    isBaseLayer: false,
                                    visibility: objetoCapa.visibility,
                                    displayInLayerSwitcher: false,
                                    strategies: [new OpenLayers.Strategy.BBOX()],
                                    styleMap: estiloMapa
                                            
                        });
                     
                        capas.push(layer);
                    }
                    else  //capa sin estilo base definido
                    {
    
                        var schemaURI = objetoCapa.url + '/DescribeFeatureType?version='+objetoCapa.version_wfs+'&typename='+objetoCapa.nombre_capa;
                        var layer = new OpenLayers.Layer.Vector(objetoCapa.nombre_fantasia,  
                            {
                                    protocol: new OpenLayers.Protocol.WFS({
                                            version: objetoCapa.version_wfs,
                                            srsName: datumWfs ,
                                            url: objetoCapa.url,
                                            featureType: objetoCapa.nombre_capa,
                                            featureNS: objetoCapa.featureNS,//'nombre exacto de geoserver para el name space',
                                            geometryName: "the_geom",
                                            renderers: ['SVG','Canvas'],
                                            schema: schemaURI
                                    }),
                                    isBaseLayer: false,
                                    visibility: objetoCapa.visibility,
                                    displayInLayerSwitcher: false,
                                    strategies: [new OpenLayers.Strategy.BBOX()]
                                            
                                });
                     
                        capas.push(layer);
                    }

                 }
}



// "creaPopup" function
 function creaPopup(feature,capa,selectControl) {
     
       
        var schema = new GeoExt.data.AttributeStore({
                data: getSchema(capa)//[{name: "foo", type: "xsd:string"}, {name: "altitude", type: "xsd:int"}, {name: "startdate", type: "xsd:date"}]
        });
        
        popup = new gxp.FeatureEditPopup({
            editorPluginConfig: {ptype: "gxp_editorform", labelWidth: 50, defaults: {width: 100}, bodyStyle: "padding: 5px 5px 0"},
            feature: feature,
            width: 200,
            height: 150,
            collapsible: true,
            schema: schema,
            listeners: {
                close: function(){
//                    // unselect feature when the popup is closed
//                    if(capa.selectedFeatures.indexOf(this.feature) > -1) {
//                        selectControl.unselect(this.feature);
//                    }
                }
            }
        });
        popup.show();
    }

//opciones para radio button
function loadOpciones(node)
{
    
      alert('radio selected');
}

    for (var i=map.layers.length-1; i>=0; --i) {
		map.layers[i].animationEnabled = this.checked;
	}
    
    // build up all controls
    map.addControl(new OpenLayers.Control.PanZoomBar({
        position: new OpenLayers.Pixel(2, 15)
    }));
    
    map.addControl(new OpenLayers.Control.Navigation());
    //map.addControl(new OpenLayers.Control.MousePosition());

//    var optionsCtrlMousePosition = {
//                            div: 'divIdMousePosition',
//                            id:'divIdMousePosition',
//                            formatOutput: function(lonLat){
//                                return "Lat.: "+lonLat.lat+" - Long.:"+lonLat.lon+" (<a target='_blank'" +
//                                "href='http://spatialreference.org/ref/epsg/4326/'>" +
//                                "EPSG:4326</a>)";
//                            }
//
//                        };
//    var ctrlMousePosition = new OpenLayers.Control.MousePosition(optionsCtrlMousePosition);
    
    map.events.register("mousemove", map, function (e) {
        var position = map.getLonLatFromViewPortPx(e.xy);
        $("#divIdMousePosition").html("<label>Lat: " + position.lat + "</label><label> Long: " + position.lon +" </label> <a target='_blank'" +
                                "href='http://spatialreference.org/ref/epsg/4326/'>" +
                                "EPSG:4326</a>");
    });

//    map.addControl(ctrlMousePosition);
    
    map.addControl(new OpenLayers.Control.ZoomBox({alwaysZoom:true}));
    // wire up the option button
    options = document.getElementById("options");

    //proxy para casos donde se usa www en otro server que el de geoserver
    OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";
    
//    map.events.register("mousemove", map, function(e) {
//    				
//	try
//        {
//            var latlon = map.getLonLatFromViewPortPx(e.xy);
//            var lat = latlon.lat;
//            var lon = latlon.lon;
//            document.getElementById("location").innerHTML ="Lon: "+lon + "</br>"+"Lat: " +lat+"</br>Datum:"+map.projection;
//        }
//        catch(e)
//        {
//             document.getElementById("location").innerHTML ="Out of Bounds</br>Datum:"+map.projection;
//        }
//    });

   
    
//bucle basico de agregado de capas
// aqui se podra incorporar las opciones de alta de elementos en el arbol de capas
function loadCapas(layer)
{
    map.addLayer(layer);
    parsear_niveles_crear_nodos(layer);
    map.zoomToExtent(extentSF);
}

//definicion de funcion busqueda sobre una array
//busca una capa por su nombre de fantasia y retrona su indice
Array.prototype.buscar=function(cadena)
{
  for (i=0;i<this.length;i++)
  {
        if(this[i].nombre_fantasia === cadena)
            return i;
  }
  
  return -1;
};

//definicion de funcion busqueda sobre una array
//busca una capa por su nombre de fantasia y retrona su indice
Array.prototype.buscar_por_nombre=function(cadena)
{
  for (i=0;i<this.length;i++)
  {
        if(this[i].nombre_capa.toUpperCase() === cadena.toUpperCase())
            return this[i];
  }
  
  return -1;
};

//definicion de funcion busqueda sobre una array
//busca una capa por su nombre de capa
Array.prototype.buscar_capa=function(cadena)
{
  for (i=0;i<this.length;i++)
  {
        if(this[i].name === cadena)
            return this[i];
  }
  
  return -1;
};

function parsear_niveles_crear_nodos(aLayer)
{
    tree.root.expandChildNodes();
    var cadena_nodos = new Array();
    index = array_capas.buscar(aLayer.name);
    
    if(index !== -1){
        niveles = array_capas[index].nivel_de_arbol.split(".");
        
        if(niveles.length > 1){ //si la cadena de niveles es mayor a 1 la capa va en un sub nivel
             
            cadena_nodos.push(tree.root);
            
            var i;
            //busco los niveles o los crea si no existen
            for(i = 1 ; i < niveles.length;i++)
            {
                nodo_temp = new Array();
                buscar_nodo_por_nivel(tree.root,niveles[i],i,nodo_temp);
                
                if(nodo_temp.length === 0) //si el nivel no fue encontrado agrego el nodo
                {
                    if(i === (niveles.length -1))//si es el ultimo nivel agrego ya el layerstore 
                    {
                        var new_lengt = stores.push(new GeoExt.data.LayerStore({
                                initDir: 0,
                                layers: [aLayer]
                        }));
                        
                        var iconoCapa = testTipoCapa(aLayer,"CSS");
                        
                        var layer_pos =layerLists.push( new GeoExt.tree.LayerContainer({
                                text: niveles[i],
                                layerStore: stores[new_lengt-1],
                                leaf: false,
                                expanded: true,
                                        loader: { 
                                                baseAttrs: {
                                                        radioGroup: "foo",
                                                        uiProvider: "layernodeui", 
                                                        iconCls: iconoCapa
                                                        
                                                },
                                                filter: function(record) {
                                                        return true;
                                                }
                                        }
                        }));
                        
                        cadena_nodos[cadena_nodos.length-1].appendChild(layerLists[layer_pos-1]);
                        return;
                        
                    }
                    else{ //si no es el ultimo nodo agrego implica debo agregar un nievel nuevo
                        //nodo_temp = new Array();
                        //buscar_nodo(tree.root,cadena_nodos[cadena_nodos.length-1].text,nodo_temp);
                            
                        var iconoCapa = testTipoCapa(aLayer,"CSS");

                        var nuevo_nivel = new Ext.tree.TreeNode(
                                        {
                                            text: niveles[i],
                                            leaf: false,
                                            iconCls: iconoCapa
                                        });
                        
                        var nodo_temp = cadena_nodos[cadena_nodos.length-1].appendChild(nuevo_nivel);   
                        cadena_nodos.push(nodo_temp);
                    }
                }
                else//si no es el ultimo nivel agrego el encontrado a la lista de nodos
                {
                    cadena_nodos.push(nodo_temp[0]); 
                }
            }
            
            //una vez que sabemos el nivel de arbol esta creado
            //recupero el nodo ultimo creado y le agrego la capa 
            
            new_lengt = stores.push(new GeoExt.data.LayerStore({
                                initDir: 0,
                                layers: [aLayer]
                        }));
                        
            var iconoCapa = testTipoCapa(aLayer,"CSS");

            var layerNode = new GeoExt.tree.LayerNode({  
                            layer:aLayer.name,
                            layerStore: stores[new_lengt-1],
                            leaf: true,
                            radioGroup: "foo",
                            uiProvider: LayerNodeUI,
                            iconCls: iconoCapa
                        });
            //var nodo_temp = new Array();            
            //buscar_nodo(tree.root,niveles[niveles.length -1],nodo_temp);

            cadena_nodos[cadena_nodos.length-1].expand();
            cadena_nodos[cadena_nodos.length-1].appendChild(layerNode); 
   
        }
        else //deberia ser nivel root insertar capa en root
        {
            new_lengt = stores.push(new GeoExt.data.LayerStore({
                    initDir: 0,
                    layers: [aLayer]
            }));
            
            layer_pos =layerLists.push( new GeoExt.tree.LayerContainer({
                    text: aLayer.name,
                    layerStore: stores[new_lengt-1],
                    leaf: false,
                    expanded: false,
                    loader: { 
                            baseAttrs: {
                                    radioGroup: "foo",
                                    uiProvider: "layernodeui"
                            },
                            filter: function(record) {
                                    return true;
                            }                          
                    }
            }));
            
            tree.root.appendChild(layerList[layer_pos-1]);
            
        }
    }

    
}


function testTipoCapa(capa,formato)
{
    formato =  (typeof(formato) == 'undefined'?'TIPO':'CSS');
    iconoCapa = "gxp-tree-rasterlayer-icon";
    iconoCapaError = "gxp-tree-rasterlayer-icon-error";
    
    if(typeof capa.url !== 'undefined')
    {
        return "gxp-tree-rasterlayer-icon";;
    }
    else
    {
        var capa_json;
        var describeFeatureTypeRequest = OpenLayers.Request.GET({
            url: capa.protocol.url+'?SERVICE=WFS&VERSION=1.1.0&REQUEST=DescribeFeatureType&outputFormat=application/json&TYPENAME='+capa.protocol.featureType,
            async: false
        });
        
        if(describeFeatureTypeRequest.status == 200)
        {
            capa_json =  JSON.parse(describeFeatureTypeRequest.responseText);
            var tipo_geometria = getValues(getObjects(capa_json,'name','the_geom'),'localType');
        
            if(formato == 'CSS'){
                switch (tipo_geometria[0])
                {
                    case 'Point':
                        iconoCapa = "gxp-icon-symbolgrid-point";
                        break;
                    case 'LineString':
                        iconoCapa = "gxp-icon-symbolgrid-line";
                        break;
                    case 'Polygon':
                        iconoCapa = "gxp-icon-symbolgrid-polygon";
                        break;
                    case 'Multipolygon':
                        iconoCapa = "gxp-icon-symbolgrid-polygon";
                        break;
                    default :
                        iconoCapa = "gxp-tree-rasterlayer-icon";
                        break;

                }
            
                return iconoCapa;
            }
            else
            {
                return tipo_geometria[0];
            }
        }
        else
        {
            Ext.getCmp('basic-statusbar').setStatus({text:'Errores en la carga de capas.', iconCls:'x-status-error'}); 
            return iconoCapaError;
        }
        
    }
}

function getSchema(capa)
{
        var atributos_json = new Array();
        var capa_json;
        var describeFeatureTypeRequest = OpenLayers.Request.GET({
            url: capa.protocol.url+'?SERVICE=WFS&VERSION=1.1.0&REQUEST=DescribeFeatureType&outputFormat=application/json&TYPENAME='+capa.protocol.featureType,
            async: false
        });
        
        if(describeFeatureTypeRequest.status = 200)
        {
            capa_json =  JSON.parse(describeFeatureTypeRequest.responseText);
            
            atributos_json.push(getObjects(capa_json,'name',''));
            return atributos_json[0];
        }
        else
        {
            return "";
        }
        
       
}

function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));    
        } else 
        //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
        if (i == key && obj[i] == val || i == key && val == '') { //
            objects.push(obj);
        } else if (obj[i] == val && key == ''){
            //only add if the object is not already in the array
            if (objects.lastIndexOf(obj) == -1){
                objects.push(obj);
            }
        }
    }
    return objects;
}

//return an array of values that match on a certain key
function getValues(obj, key) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getValues(obj[i], key));
        } else if (i == key) {
            objects.push(obj[i]);
        }
    }
    return objects;
}
//busca un nodo bajando en la descendencia del arbol
//funcion con recursion

function buscar_nodo_por_nivel(nodo_actual,nodo_buscado,nivel,retorno)
{
    
    if(nodo_actual == null)
        return;
    
    if(nodo_actual.text === nodo_buscado && nodo_actual.getDepth() === nivel) //si es el nodo retorno
    {
        retorno.push(nodo_actual);
        return;
    }
    else
    {
        if(nodo_actual.hasChildNodes) //si tiene hijos 
        {
            for(var j=0; j<=nodo_actual.childNodes.length; j++) //buscao en cada hijo
            {
                if(retorno != null){
                    if(retorno.length >0)
                        return;
                    else{
                        if(nodo_actual.getDepth() === nivel)
                            return;
                        else
                            buscar_nodo_por_nivel(nodo_actual.childNodes[j],nodo_buscado,nivel,retorno);
                    }
                }
                else
                    return;
            }
        }
        else
        {
            return;
        }
        
    } 
}   
    
//busca un nodo en el arbol recoriendo toda la estructura
//funcion con recursion
function buscar_nodo(nodo_actual,nodo_buscado,retorno)
{
    
    if(nodo_actual == null)
        return;
    
    if(nodo_actual.text === nodo_buscado) //si es el nodo retorno
    {
        retorno.push(nodo_actual);
        return;
    }
    else
    {
        if(nodo_actual.hasChildNodes) //si tiene hijos 
        {
            for(var j=0; j<=nodo_actual.childNodes.length; j++) //buscao en cada hijo
            {
                if(retorno != null){
                    if(retorno.length >0)
                        return;
                    else{
                        buscar_nodo(nodo_actual.childNodes[j],nodo_buscado,retorno);
                    }
                }
                else
                    return;
            }
        }
        else
        {
            return;
        }
        
    } 
}   

 
function generarBarraHerramientas()
{
     action = new GeoExt.Action({
        map: map,  
        control: new OpenLayers.Control.Measure(OpenLayers.Handler.Path, {
                eventListeners: {
                    
                    measurepartial: function(evt) {
                        seleccionLimites.box.deactivate();
                        actions["get_BBOX"].enable(); 
                        document.getElementById('info_medidas').style.visibility = 'visible';
                        document.getElementById('info_medidas').innerHTML = "La longitud es " + evt.measure.toFixed(2) +" "+ evt.units;
                    },
                    measure: function(evt) {
                        document.getElementById('info_medidas').style.visibility = 'visible';
                        document.getElementById('info_medidas').innerHTML = "La longitud es " + evt.measure.toFixed(2) +" "+ evt.units;
                    }
                },
                immediate: true,
                persist: true
            }),
        height: 40,
        width:40,
        toggleGroup: toggleGroup,
        allowDepress: true,
        pressed: false,
        group: "medida",
        checked: false,
        iconCls:"toolbarMenuMideSegmento",
        tooltip:"Medir Segmento"  
    });
    
    actions["mide_seg"] = action;
    toolbarItems.push(action);
    
    action = new GeoExt.Action({
        map: map,
        control: new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon, {
                eventListeners: {
                    measurepartial: function(evt) {
                        document.getElementById('info_medidas').style.visibility = 'visible';
                        seleccionLimites.box.deactivate();
                         actions["get_BBOX"].enable(); 
                        if(evt.units == "m"){  
                            var medida = evt.measure.toFixed(2)/1000;
                            document.getElementById('info_medidas').innerHTML = "El Area es " + medida.toFixed(2) +" km²?";
                        }
                        else
                            document.getElementById('info_medidas').innerHTML = "El Area es " + evt.measure.toFixed(2) +" "+ evt.units+"²?";
                    },
                    measure: function(evt) {
                            document.getElementById('info_medidas').style.visibility = 'visible';
                        if(evt.units == "m"){
                            var medida = evt.measure.toFixed(2)/1000;
                            document.getElementById('info_medidas').innerHTML = "El Area es " + medida.toFixed(2) +"km²?";
                        }
                        else
                            document.getElementById('info_medidas').innerHTML = "El Area es " + evt.measure.toFixed(2) +" "+ evt.units+"²?";
                    }
                },
                immediate: true,
                persist: true
            }),
        height: 40,
        width:40,
        toggleGroup: toggleGroup,
        allowDepress: true,
        pressed: false,
        group: "medida",
        checked: false,
        iconCls: "toolbarMenuMideArea",
        tooltip:"Medir Area"
    });
    actions["mide_area"] = action;
    toolbarItems.push(action);
    
    
    //control personalizado
    
    seleccionLimites = new OpenLayers.Control();
    
    OpenLayers.Util.extend(seleccionLimites, {
                    draw: function () {
                        // this Handler.Box will intercept the shift-mousedown
                        // before Control.MouseDefault gets to see it
                        this.box = new OpenLayers.Handler.Box( seleccionLimites,
                            {"done": this.notice},
                            {keyMask: OpenLayers.Handler.MOD_CTRL});
                    },
                    notice: function (bounds) {
                        var ll = map.getLonLatFromPixel(new OpenLayers.Pixel(bounds.left, bounds.bottom)); 
                        var ur = map.getLonLatFromPixel(new OpenLayers.Pixel(bounds.right, bounds.top)); 
                        alert(ll.lon.toFixed(4) + ", " + 
                              ll.lat.toFixed(4) + ", " + 
                              ur.lon.toFixed(4) + ", " + 
                              ur.lat.toFixed(4));
                    }
    });
                            
    action = new GeoExt.Action({
        map: map,
        control: new OpenLayers.Control.Button({
                    title: "Medir BBOX",
                    trigger: function() {
                        if(typeof seleccionLimites.box !== 'undefined') { //testeo de objeto
                            
                            if(seleccionLimites.box.active == true)
                            {    
                                seleccionLimites.box.deactivate();
                                actions["get_BBOX"].enable();  
                            }
                            else{
                                seleccionLimites.box.activate();
                                
                            } 
                        }
                        else
                        {
                            mapPanel.map.addControl(seleccionLimites);
                            seleccionLimites.box.activate();
                        }
                        actions["get_BBOX"].enable();
                    }
                }),
        height: 40,
        width:40,
        toggleGroup: toggleGroup,
        allowDepress: true,
        pressed: false,
        group: "medida",
        checked: false,
        iconCls:"toolbarMenuGetBounds",
        tooltip:"Medir caja contenedora"
    });
    
    actions["get_BBOX"] = action;
    toolbarItems.push(action);
    
        
}

//Funcion principal de entrada
Ext.onReady(function() {
    // create a map panel with some layers that we will show in our layer tree
    // below.
    
    generarBarraHerramientas();
    
    statusbarItems = new Ext.ux.StatusBar({
        id: 'basic-statusbar',
        
        // defaults to use when the status is cleared:
        defaultText: 'Editor WFS-T IDESF',
        //defaultIconCls: 'default-icon',
        
        // values to set initially:
        text: 'Editor WFS-T IDESF',
        iconCls: 'x-status-valid',
        items:
            [ '-',
            {
                xtype: 'tbtext',
                text:' ',
                id: "itemMousePosition",
                width:350,
                contentEl: "divIdMousePosition"
            }]
    });
    
    //panel principal
    mapPanel = new GeoExt.MapPanel({
        border: true,
        region: "center",
        map: map,
        tbar: toolbarItems,
        items:[{
                xtype: "gxp_scaleoverlay"
            }],
        bbar: statusbarItems
    });

    
    // create our own layer node UI class, using the TreeNodeUIEventMixin
    LayerNodeUI = Ext.extend(GeoExt.tree.LayerNodeUI, new GeoExt.tree.TreeNodeUIEventMixin());
        
    //Configuro las capas 
    var treeConfig = [{
        nodeType: "gx_baselayercontainer",
	text: "Capas Base"		
        } ];

    
    treeConfig = new OpenLayers.Format.JSON().write(treeConfig, true);
	
	var location = {
		contentEl: 'location',
		layout: "fit",
        title: 'Coordenadas',
        region: 'south',
        bodyStyle: 'padding-bottom:15px;background:#eee;',
        autoScroll: true,
        html: '<p class="details-info">Información.</p></br>'
    };
	
    //nuevo arbol 
    tree = new Ext.tree.TreePanel({
        border: true,
        region: "west",
        title: "Capas",
        width: 200,
        split: true,
        collapsible: true,
        collapseMode: "mini",
        autoScroll: true,
	animate: true,
//        plugins: [
//            new GeoExt.plugins.TreeNodeRadioButton({
//                listeners: {
//                    "radiochange": function(node) {
//                        loadOpciones(node); //carga opciones asociadas a los nodos segun la capa, esta programacion es dedicada segun capa y necesidades
//                    }
//                }
//            })
//        ],
        loader: new Ext.tree.TreeLoader({
            // applyLoader has to be set to false to not interfer with loaders
            // of nodes further down the tree hierarchy
            applyLoader: false,
            uiProviders: {
                "layernodeui": LayerNodeUI
            }
        }),
        root: {
            nodeType: "async",
            // the children property of an Ext.tree.AsyncTreeNode is used to
            // provide an initial set of layer nodes. We use the treeConfig
            // from above, that we created with OpenLayers.Format.JSON.write.
            //children: Ext.decode(treeConfig)
            // Don't use the line above in your application. Instead, use
            //children: treeConfig
        },
        listeners: {
//                        'radiochange': function(node){
//                            alert(node.layer.name + " is now the the active layer.2");
//                        },
			'checkchange': cambioDeCapa,   //aqui se especifica el metodo que hara el cambio de capa 
                        //y se monitoreara los estados de edicion y posibilidades de edicion segun tipod e capa
                        contextmenu: menuClicDerecho
        },
        rootVisible: false,
        lines: true
        
    });
	
//    var detailsPanel = {
//		contentEl: 'info',
//		layout: "fit",
//        title: 'Detalles',
//        region: 'center',
//		height: 150,
//        bodyStyle: 'padding-bottom:15px;background:#eee;',
//        autoScroll: true,
//        html: '<p class="details-info">Información.</p></br>'
//    };
//	
//    var panelOpciones = {
//				contentEl: 'desc',
//				title: 'Opciones',
//				region:'north',
//				split: true,
//				height: 150,
//				minSize: 150,
//				rootVisible: false,
//				autoScroll: true
//    };
//	
//    var barraTitulo = {
//				contentEl: 'header',
//				region:'north',
//				split: true,
//				height: 110,
//				minSize: 50,
//				xtype: 'box'
//    };
    
     var item2 = new Ext.Panel({
                title: 'Accordion 2',
                html: '&lt;empty panel&gt;',
                cls:'empty'
            });

    var item3 = new Ext.Panel({
                title: 'Accordion 3',
                html: '&lt;empty panel&gt;',
                cls:'empty'
    });
//    var accordion = new Ext.Panel({
//                region:'west',
//                margins:'0 0 0 0',
//                split:true,
//                width: 200,
//                layout:'accordion',
//                items: [tree,item2,item3]
//    });
     
     getInfoPerfil();
    
new Ext.Viewport({

    layout: 'fit',
    hideBorders: true,
//    title: 'Editor de Mapas - IDESF',
    items: [
            {
                        layout: "border",
                        deferredRender: false,
			title: '<div id="logos"><img src="img/logo_idesf.png" class="logo_idesf" alt=""><img src="img/gob-santafe.png" id="logo_provincia" alt="editor de mapas IDESF Gobierno de la Provincia de Santa Fe"> </div>',
                        
			tbar: [
//                                {//barra de tope con info de usuario y opciones generales del viewer
//					xtype: 'tbtext',
//					text: 'Usuario',
//                                        id: 'usuario'		
//				},
				{xtype: 'tbspacer', width: 200},
                                {
					xtype: 'tbtext',
					text: "",
					cls: 'layer-edit',
                                        id: 'editando_capa'		
				},
                                '->',{//barra de tope con info de usuario y opciones generales del viewer
					xtype: 'button',
					text: '<img src="img/avatars/'+perfil_usuario.avatarfile+'" alt="avatar" title="Perfil">',
                                        id: 'avatar',
                                        tooltip: 'Perfil de Usuario',
                                        cls: 'avatarBox',
                                        handler:function()
                                        {
                                            editarPerfil();
                                        }
				},{//barra de tope con info de usuario y opciones generales del viewer
					xtype: 'tbtext',
					text: 'Usuario',
                                        id: 'usuario'		
				},'-',
                                { 
                                    xtype: 'button',
                                    text: 'Configuración',
                                    tooltip: 'Configuraciones',
                                    iconAlign: 'left',
                                    iconCls: 'config',
                                    handler: function(){
                                      changeSettings();
                                    }
                                },
                                { 
                                    xtype: 'button',
                                    text: 'Ayuda',
                                    tooltip: 'Ayuda',
                                    iconAlign: 'left',
                                    iconCls: 'help',
                                    handler: function(){
                                      help();
                                    }
                                },
				'-',{
					xtype: 'button',
					text: 'Salir',
					iconAlign: 'left',
					iconCls: 'close',
					tooltip: 'Salir',
					handler: function(){
					  window.location = 'login.php';
					}
				}
//                                ,'-',{
//					xtype: 'tbtext',
//					text: 'localhost',
//                                        id: 'estado'		
//				}
                            ],
            items: [mapPanel,tree
//                , { //,accordion
//                region: "east",
//				split:true,
//				margins: '1 0 3 3',
//				width: 200,
//				minSize: 100,
//				maxSize: 500,
//				items: [panelOpciones,detailsPanel,location]
//				}		
			]
        }]
    });
	
        
	for (var i=mapPanel.map.layers.length-1; i>=0; --i) {
					mapPanel.map.layers[i].animationEnabled = this.checked;
					/*if(mapPanel.map.layers[i].isBaseLayer != true)
						mapPanel.map.layers[i].setVisibility(false);*/
	} 
	
	mostrar_mensajes = true;
	$.pnotify.defaults.styling = "jqueryui";
	$.pnotify.defaults.history = false;
	$.pnotify.defaults.delay = 3000;
        
        //seteo manualmente el tamaño del toolbar para mejor visualizacion
        mapPanel.getTopToolbar().setHeight(45);
        
        Ext.MessageBox.buttonText.yes = "Si";
        Ext.MessageBox.buttonText.no = "No";
        
//        grilla = new OpenLayers.Layer.PointGrid({
//            name: "Grilla Snap",
//            dx: 100, dy: 100,
//            units: 'm',
//            maxFeatures: 2000,
//            styleMap: new OpenLayers.StyleMap({
//                pointRadius: 1,
//                strokeColor: "#3333ff",
//                strokeWidth: 1,
//                fillOpacity: 1,
//                fillColor: "#3333ff",
//                graphicName: "square"
//             }),
//             displayInLayerSwitcher: false
//        });
        
//////////////////////////////  Configuracion del arbol de capas ///////////////////////////
////extras sobre el arbol

        capas.forEach(loadCapas); //cargar array de capas

        //capas.forEach(getEstilos);
        
        Ext.ComponentMgr.get('usuario').setText(userName);

//        if (document.location.host === "localhost")
//        { 
//            Ext.ComponentMgr.get('estado').setText('localhost');
//        }
//        else
//        {
//            Ext.ComponentMgr.get('estado').setText("EXTERNO");
//        }
       
        map.getViewport().addEventListener('contextmenu', 
                     function (e) {
                            e.preventDefault();
                            if(editingLayer !== null)
                            {    
                                console.info('contextmenu_mapa');
                                var feature = editingLayer.getFeatureFromEvent(e);

                                creaPopup(feature, editingLayer,seleccionSimpleCapaEditada);
                            }
                    }
        );
                    
        Ext.QuickTips.init();  
        
       
        window.onbeforeunload = function(){
                return '¿Estas por abandonar el editor estas seguro?';
        };
        
        
});


function getInfoPerfil()
{
    var parametros = {Parametro:'getPerfil',user_name:userName};

    $.ajax({
                type: "POST",
                url: "scripts/utiles.php",
                //contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                success: function(msg) {
                    if(typeof msg[0] !== 'undefined')
                    {
                        perfil_usuario = msg[0];
                    }
                    else
                    {
                        mensajeError("Error", "Error al recuperar datos de usuario.");   
                    }
                },
                error: function() {

                    mensajeError("Error", "Error al recuperar datos de usuario.");
                },
                data: parametros
    });
}

function editarPerfil()
{
        Ext.form.Field.prototype.msgTarget = 'side';
        
        getInfoPerfil();
        
        
        if(perfil_usuario !== 'undefined')
        {

            if(!perfil )
                {
                    form = new Ext.form.FormPanel({
                        baseCls: 'x-plain',
                        labelWidth: 55,
                        id:'perfil',
                        defaultType: 'textfield',
                        items: [{
                            fieldLabel: 'Nombre',
//                                            vtype:'alpha',
//                                            vtypeText:'Solo se permite el ingreso de letras',
                            regex:/^\s*[a-zA-Z._\s]+\s*$/, 
                            regexText:'Solo se permiten letras y espacios',
                            name: 'nombre',
                            id: 'nombre',
                            value: perfil_usuario.nombre,
                            allowBlank:false,
                            blankText: 'Campo requerido.',
                            anchor:'90%'  // anchor width by percentage
                        },{
                            fieldLabel: 'Apellido',
                            name: 'apellido',
                            id:'apellido',
//                                            vtype:'alpha',
//                                            vtypeText:'Solo se permite el ingreso de letras',
                            regex:/^\s*[a-zA-Z._\s]+\s*$/, 
                            regexText:'Solo se permiten letras y espacios',
                            allowBlank:false,
                            blankText: 'Campo requerido.',
                            value: perfil_usuario.apellido,
                            anchor: '90%'  // anchor width by percentage
                        }, {
                            fieldLabel: 'Email',
                            name: 'email',
                            vtype:'email',
                            id:'email',
                            allowBlank:false,
                            disabled: true,
                            value: perfil_usuario.email,
                            anchor: '90%'  // anchor width by percentage
                        },
                        {
                            xtype: 'compositefield',
                            fieldLabel: 'Avatar',
                            msgTarget : 'side',
                            anchor    : '-20',
                            defaults: {
                                flex: 1
                            },
                            items: [
                                    new Ext.form.ComboBox({
                                    tpl: '<tpl for="."><div><img class="x-combo-list-item avatarComboBox" src="img/avatars/{file}" alt=""/></div></tpl>',
                                    store: store,
                                    displayField:'nombre',
                                    typeAhead: true,
                                    mode: 'local',
                                    triggerAction: 'all',
                                    emptyText:'Seleccione un avatar..',
                                    selectOnFocus:true,
                                    id:'avatarCombo',
                                    fieldLabel:'Avatar',
                                    columnWidth:.5,
                                    listeners:{
                                            'select': function(combo, record, index)
                                            {   
                                                $('#avatar_form_perfil img').attr('src','img/avatars/'+record.json[1]);
                                            }
                                       }
                                    }),
                                    {
                                        columnWidth:.5,
                                        xtype: 'tbtext',
                                        text: '<img src="img/avatars/'+perfil_usuario.avatarfile+'" alt="avatar" title="Perfil">',
                                        id: 'avatar_form_perfil',
                                        tooltip: 'Perfil de Usuario',
                                        cls: 'avatarBox'
                                    }
                            ]
                            
                        }   
                    
                    ]
                });

                perfil = new Ext.Window({
                    title: 'Perfil de Usuario',
                    width: 300,
                    height:200,
                    minWidth: 300,
                    minHeight: 200,
                    layout: 'fit',
                    plain:true,
                    buttonAlign:'center',
                    items: form,
                    closeAction: 'hide',
                    forceSelection:true,
                    bodyStyle: 'padding-left:10px; padding-top:5px;', 
                    listeners:{
                                'afterrender': function(item)
                                {
                                    var component = Ext.getCmp('avatarCombo');
                                    var seleccionado = component.getStore().getAt(component.getStore().find('file',perfil_usuario.avatarfile)).json[0];
                                    component.setValue(seleccionado);
                                    
                                }
                    },
                    buttons: [{
                        text: 'Guardar',
                        handler: function(){
                            
                            if($('#perfil .x-form-invalid').length ==  0){
                                    var nombre = Ext.getCmp('nombre').getValue();
                                    var apellido= Ext.getCmp('apellido').getValue();

                                    var component = Ext.getCmp('avatarCombo');
                                    var avatarfile = component.getStore().getAt(component.getStore().find('nombre',component.getValue())).json[1];


                                    datos = {nombre:nombre,apellido:apellido,avatarfile:avatarfile};
                                    setPerfil(datos);
                            }
                            else
                            {
                                    mensajeError("Error","Corrija los errores y vuelva a intentar.");
                            }
                        }
                    },
                    {
                        text: 'Cerrar',
                        handler: function(){
                              perfil.close();
                              perfil = null;
                        }
                    }]
                });

                perfil.show();
                perfil.center();
                perfil.focus();
            }
            else {
                perfil.show();
                perfil.center();
                perfil.focus();

            }

        }

}

function setPerfil(datos)
{

    var parametros = {Parametro:'setPerfil',user_name:userName,perfil:JSON.stringify(datos)};

            $.ajax({
                    type: "POST",
                    url: "scripts/utiles.php",
                    //contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: false,
                    success: function(msg) {
                        if(msg.success)
                        {
                            mensajeExito("Perfil guardado","El perfil se guardo correctamente.");
                            $('#avatar img').attr('src','img/avatars/'+datos.avatarfile);
                        }
                        else
                        {
                            mensajeError("Error", "Error al guardar el perfil");

                        }
                    },
                    error: function() {
                        mensajeError("Error", "Error al guardar el perfil");
                    },
                    data: parametros
                });
}

//funcionalidad selectividad de capas
function prenderCapas()
{
//	for (var i=mapPanel.map.layers.length-1; i>=0; --i) {
//						
//		if(mapPanel.map.layers[i].name.indexOf('IDESF') !== -1)
//			mapPanel.map.layers[i].setVisibility(true); 
//						
//	}
}

// propiedades del feature
function createPopup(feature) {

		var text = "";
		var titulo = "";

var attributos = feature.attributes;
titulo= "Información " + feature.layer.name;

for (var propName in attributos) {
    
    text += propName +": "+ attributos[propName] +"</br>";
    
}
			
        popup = new GeoExt.Popup({
            title: titulo,
            location: feature,
            width:200,
            html: text,
            maximizable: false,
            collapsible: true,
			dragable: true
        });
        // unselect feature when the popup
        // is closed
        popup.on({
            close: function() {
                if(OpenLayers.Util.indexOf(feature.layer.selectedFeatures,this.feature) > -1) {
                    selectCtrl.unselect(this.feature);
                }
            }
        });
        popup.show();
    }

//funcionalidad selectividad de capas
function cambioDeCapa(node, checked, evt) { 
    
        if(node.attributes.checkedGroup === "baselayer")
            return; 
                
        if (checked === true) {

//        if(node.text.indexOf('Rosario') !== -1)
//                     map.zoomToExtent([-6768234.6738, -3898186.3149, -6745991.4986, -3874720.1472]);
//        if(node.text.indexOf('Santa Fe') !== -1)
//                     map.zoomToExtent([-6763266.2670, -3720661.3167, -6748666.7946, -3705832.5332]);
//        if(node.text.indexOf('Santo Tome') !== -1)
//                     map.zoomToExtent([-6772534.2567, -3725018.2273, -6760457.2062, -3712406.1176]);
//        if(node.text.indexOf('Rafaela') !== -1)
//                     map.zoomToExtent([-6850003.1848, -3670747.9372, -6840219.2452, -3660925.7791]);
//        if(node.text.indexOf('Reconquista') !== -1)
//                     map.zoomToExtent([-6645610.5712, -3401173.6478, -6637890.4314, -3392440.7173]);
        
        }
        

}

function menuClicDerecho(node, evt)
{
    evt.stopEvent();
    capaAsociada = capas.buscar_capa(node.text);
   
    if (capaAsociada !== -1){
        if(capaAsociada.CLASS_NAME == "OpenLayers.Layer.Vector")
        {
            if(editingLayer !== null){
                
                //finalizar edicion
                
                var menuContextual = new Ext.menu.Menu({
                                    items: [
                                    {text: 'Fin Edición: '+editingLayer.name,
                                     iconCls: 'contextMenuEdit',
                                     handler: function (item,evt) {
                                         
                                          Ext.Msg.show({
                                                        title : 'Atención',
                                                        msg : 'Desea finalizar la edición de la capa? </br>'+editingLayer.name,
                                                        buttons : Ext.Msg.YESNO,
                                                        config : {opt:editingLayer },
                                                        fn : this.messageResult,
                                                        icon : Ext.MessageBox.QUESTION
                                            });
                                         
                                     },
                                     messageResult : function (btn,text,opt) {
                                            
                                           if (btn == 'yes' ) { 
                                                finEditarCapa(opt.config.opt);
                                            }
                                      }
                                    },
                                    {
                                        text: 'Editar estilo: '+editingLayer.name,
                                        iconCls: "gxp-icon-palette",
                                        disabled: false,
                                        
                                        handler: function(menuItem, event) {
                                            
                                           
                                            if (editingLayer.CLASS_NAME != 'OpenLayers.Layer.Vector') {
                                                Ext.Msg.alert('Atencíon', 'Solo disponible en capas tipo Vector');
                                                return;
                                            }
                                            if (!gxp.VectorStylesDialog) {
                                                Ext.Msg.alert('Atención', 'es necesario el plugin GPX');
                                                return;
                                            }
                                            var layerRecord = mapPanel.layers.getByLayer(editingLayer);
                                            
                                            if(editor_estilos_activo == false)
                                            {
                                                editor_estilos_activo = true;
                                                
                                                editor_estilo = new Ext.Window({
                                                        layout: 'auto',
                                                        resizable: false,
                                                        autoHeight: true,
                                                        pageX: 100,
                                                        pageY: 200,
                                                        width: 400,
                                                        closeAction:'close',
                                                        listeners:{
                                                            beforeclose: function(p)
                                                            {
                                                                editor_estilos_activo = false;
                                                            }
                                                        },
                                                        title: 'Editor de Estilos',
                                                        items: [gxp.VectorStylesDialog.createVectorStylerConfig(layerRecord)] //evaluar el pasaje de url para proxy
                                                    });
                                                    editor_estilo.show();
                                            }
                                            else
                                            {
                                                mensajeInformativo('Atención','Ya existe una ventana de estilo abierta');
                                                editor_estilo.focus();
                                            }
                                                
                                        },
                                        isApplicable: function(node) {
                                            return node.layer.CLASS_NAME == 'OpenLayers.Layer.Vector';
                                        }
                                    },
                                    {

                                        text: 'Zoom Max Extensión: '+capaAsociada.name,
                                        iconCls: "icon-zoom-visible",

                                        handler: function (menuItem, event) {
//                                            var node = menuItem.ownerCt.contextNode;
//                                            if (!node || !node.layer) {
//                                                return;
//                                            }
                                            var layer = capaAsociada;
                                            var zoomExtent;

                                            // If the Layer has a set maxExtent, this prevails, otherwise
                                            // try to get data extent (Vector Layers mostly).
                                            if (this.hasMaxExtent) {
                                                zoomExtent = layer.maxExtent;
                                            } else {
                                                zoomExtent = layer.getDataExtent();
                                            }

                                            if (!zoomExtent) {
                                                
                                                Ext.Msg.alert('Atención','No existen datos de máxima extensión para esta capa'); 
                                                return;
                                            }

                                            layer.map.zoomToExtent(zoomExtent);
                                        },

                                        /** Is this menu item applicable for this node/layer? */
                                        isApplicable: function (node) {
                                            // Layer: assume fixed maxExtent when set AND different from Map maxExtent
                                            this.hasMaxExtent = node.layer.maxExtent && !node.layer.maxExtent.equals(node.layer.map.maxExtent);
                                            return node.layer.getDataExtent() || this.hasMaxExtent;
                                        }
                                    },
                                    { 
                                        text: 'Información de capa: '+capaAsociada.name,
                                        iconCls: "icon-information",
                                        
                                        handler: function (menuItem, event) {
                                            
                                            var layer = capaAsociada;
                                            var layerType = layer.CLASS_NAME.split(".").pop();
                                            var isVector = layerType == 'Vector';
                                            var isWFS = layer.protocol && layer.protocol.CLASS_NAME.indexOf('WFS') > 0;

                                            layerType = isWFS ? 'Vector (WFS)' : layerType;
                                            var tiled = layer.singleTile || isVector ? 'No' : 'Si';
                                            var hasWFS = layer.metadata.wfs || isWFS ? 'Si' : 'No';
                                            var hasFeatureInfo = isVector || layer.featureInfoFormat ? 'Si' : 'No';

                                            Ext.MessageBox.show({
                                                title: String.format('Info for Layer "{0}"', layer.name),
                                                msg: String.format('Información básica de capa<br>' +
                                                    "<br>Nombre: {0}" +
                                                    "<br>Tipo: {1}" +
                                                    "<br>Tiled: {2}" +
                                                    "<br>Tiene info asociada: {3}" +
                                                    "<br>Es WFS: {4}"
                                                    , layer.name, layerType, tiled, hasFeatureInfo, hasWFS),
                                                buttons: Ext.Msg.OK,
                                                fn: function (btn) {
                                                    if (btn == 'ok') {
                                                    }
                                                },
                                                icon: Ext.MessageBox.INFO,
                                                maxWidth: 400
                                            });
                                        }
                                    },
                                    
                                    {
                                        text: 'Transparencia: '+capaAsociada.name,
                                        iconCls: 'icon-opacity',

                                        handler: function (menuItem, event) {
                                            
                                            var layer = capaAsociada;
                                            // Opacity dialog
                                            var cmp = Ext.getCmp('WinOpacity-' + layer.id);
                                            var xy = event.getXY();
                                            xy[0] = xy[0] + 40;
                                            xy[1] = xy[1] + 0;

                                            if (!cmp) {

                                                cmp = new Ext.Window({
                                                    title: 'Transparencia',
                                                    id: 'WinOpacity-' + layer.id,
                                                    x: xy[0],
                                                    y: xy[1],
                                                    width: 200,
                                                    resizable: false,
                                                    constrain: true,
                                                    bodyStyle: 'padding:2px 4px',
                                                    closeAction: 'hide',
                                                    listeners: {
                                                        hide: function () {
                                                            cmp.x = xy[0];
                                                            cmp.y = xy[1];
                                                        },
                                                        show: function () {
                                                            cmp.show();
                                                            cmp.focus();
                                                        }
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'label',
                                                            text: layer.name,
                                                            height: 20
                                                        },
                                                        {
                                                            xtype: "gx_opacityslider",
                                                            showTitle: false,
                                                            plugins: new GeoExt.LayerOpacitySliderTip(),
                                                            vertical: false,
                                                            inverse: false,
                                                            aggressive: false,
                                                            layer: layer
                                                        }
                                                    ]
                                                });
                                                cmp.show();

                                            } else {
                                                if (cmp.isVisible()) {
                                                    cmp.hide();
                                                } else {
                                                    cmp.setPosition(xy[0], xy[1]);
                                                    cmp.show();
                                                    cmp.focus();
                                                }
                                            }
                                        }
                                    }
                                    ]
                                    });
                menuContextual.showAt(evt.xy);

                return;
            }
            else{
                //iniciar edicion
                icono_estado =  Ext.getCmp('basic-statusbar').iconCls;
               
                var menuContextual = new Ext.menu.Menu({
                                    items: [
                                    {text: 'Editar: '+capaAsociada.name,
                                     iconCls: 'contextMenuEdit',
                                     handler: function (item,evt) {
                                          
                                         
                                          Ext.Msg.show({
                                                        title : 'Atención',
                                                        msg : 'Desea editar esta capa? </br>'+capaAsociada.name,
                                                        buttons : Ext.Msg.YESNO,
                                                        config : {opt:capaAsociada },
                                                        fn : this.messageResult,
                                                        icon : Ext.MessageBox.QUESTION
                                            });
                                         
                                     },
                                     messageResult : function (btn,text,opt) {
                                            
                                            if (btn == 'yes' ) { 
                                                
                                                cargarGeometriasLimite(capaAsociada.name);
                                                escala = parseInt(escala_permitida);
                                                if(escala != -1 && escala >= map.getScale() )
                                                    editarCapa(opt.config.opt);
                                                
                                            }
                                      }
                                    },
                                    {

                                        text: 'Zoom Max Extensión: '+capaAsociada.name,
                                        iconCls: "icon-zoom-visible",

                                        handler: function (menuItem, event) {
//                                            var node = menuItem.ownerCt.contextNode;
//                                            if (!node || !node.layer) {
//                                                return;
//                                            }
                                            var layer = capaAsociada;
                                            var zoomExtent;

                                            // If the Layer has a set maxExtent, this prevails, otherwise
                                            // try to get data extent (Vector Layers mostly).
                                            if (this.hasMaxExtent) {
                                                zoomExtent = layer.maxExtent;
                                            } else {
                                                zoomExtent = layer.getDataExtent();
                                            }

                                            if (!zoomExtent) {
                                                
                                                Ext.Msg.alert('Atención','No existen datos de máxima extensión para esta capa'); 
                                                return;
                                            }

                                            layer.map.zoomToExtent(zoomExtent);
                                        },

                                        /** Is this menu item applicable for this node/layer? */
                                        isApplicable: function (node) {
                                            // Layer: assume fixed maxExtent when set AND different from Map maxExtent
                                            this.hasMaxExtent = node.layer.maxExtent && !node.layer.maxExtent.equals(node.layer.map.maxExtent);
                                            return node.layer.getDataExtent() || this.hasMaxExtent;
                                        }
                                    },
                                    
                                    { 
                                        text: 'Información de capa: '+capaAsociada.name,
                                        iconCls: "icon-information",

                                        handler: function (menuItem, event) {
                                            
                                            var layer = capaAsociada;
                                            var layerType = layer.CLASS_NAME.split(".").pop();
                                            var isVector = layerType == 'Vector';
                                            var isWFS = layer.protocol && layer.protocol.CLASS_NAME.indexOf('WFS') > 0;

                                            layerType = isWFS ? 'Vector (WFS)' : layerType;
                                            var tiled = layer.singleTile || isVector ? 'No' : 'Si';
                                            var hasWFS = layer.metadata.wfs || isWFS ? 'Si' : 'No';
                                            var hasFeatureInfo = isVector || layer.featureInfoFormat ? 'Si' : 'No';

                                            Ext.MessageBox.show({
                                                title: String.format('Información para capa "{0}"', layer.name),
                                                msg: String.format('Información básica de capa<br>' +
                                                    "<br>Nombre: {0}" +
                                                    "<br>Tipo: {1}" +
                                                    "<br>Tiled: {2}" +
                                                    "<br>Tiene info asociada: {3}" +
                                                    "<br>Es WFS: {4}"
                                                    , layer.name, layerType, tiled, hasFeatureInfo, hasWFS),
                                                buttons: Ext.Msg.OK,
                                                fn: function (btn) {
                                                    if (btn == 'ok') {
                                                    }
                                                },
                                                icon: Ext.MessageBox.INFO,
                                                maxWidth: 400
                                            });
                                        }
                                    },
                                    {
                                        text: 'Transparencia: '+capaAsociada.name,
                                        iconCls: 'icon-opacity',

                                        handler: function (menuItem, event) {
                                            
                                            var layer = capaAsociada;
                                            // Opacity dialog
                                            var cmp = Ext.getCmp('WinOpacity-' + layer.id);
                                            var xy = event.getXY();
                                            xy[0] = xy[0] + 40;
                                            xy[1] = xy[1] + 0;

                                            if (!cmp) {

                                                cmp = new Ext.Window({
                                                    title: 'Transparencia',
                                                    id: 'WinOpacity-' + layer.id,
                                                    x: xy[0],
                                                    y: xy[1],
                                                    width: 200,
                                                    resizable: false,
                                                    constrain: true,
                                                    bodyStyle: 'padding:2px 4px',
                                                    closeAction: 'hide',
                                                    listeners: {
                                                        hide: function () {
                                                            cmp.x = xy[0];
                                                            cmp.y = xy[1];
                                                        },
                                                        show: function () {
                                                            cmp.show();
                                                            cmp.focus();
                                                        }
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'label',
                                                            text: layer.name,
                                                            height: 20
                                                        },
                                                        {
                                                            xtype: "gx_opacityslider",
                                                            showTitle: false,
                                                            plugins: new GeoExt.LayerOpacitySliderTip(),
                                                            vertical: false,
                                                            inverse: false,
                                                            aggressive: false,
                                                            layer: layer
                                                        }
                                                    ]
                                                });
                                                cmp.show();

                                            } else {
                                                if (cmp.isVisible()) {
                                                    cmp.hide();
                                                } else {
                                                    cmp.setPosition(xy[0], xy[1]);
                                                    cmp.show();
                                                    cmp.focus();
                                                }
                                            }
                                        }
                                    },
                                    {
                                        text: 'Exportar a Shapefile: '+capaAsociada.name,
                                        iconCls: 'icon-export',
                                        
                                        handler: function (menuItem, event) {
//                                           
                                            var layer = capaAsociada;
                                            window.open('/geoserver/IDESF/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=IDESF:'+layer.name+'&outputFormat=SHAPE-ZIP');

                                        }
                                            
                                        
                                    }
                                    
                                    ]
                                    });
                                    
                menuContextual.showAt(evt.xy);

                return;
            }
        }
    }
    
}



function editarCapa(capaAsociada)
{   
    
    if(testTipoCapa(capaAsociada,'CSS') != 'gxp-tree-rasterlayer-icon-error'){

//        if(esEscalaCapturaPermitida())
//        {    
            
            editingLayer = capaAsociada;
            editingLayer.map = mapPanel.map;
            saveStrategy = new OpenLayers.Strategy.Save();
            saveStrategy.setLayer(editingLayer);
            saveStrategy.events.register('success', null, cambiosConExito);
            saveStrategy.events.register('fail', null, cambiosConErrores);
                
            
                                
            var nodo = new Array();
            //***********************  add boton en barra menu insercion punto
            //var tipoCapa = array_capas[array_capas.buscar(editingLayer.name)].geometryType;
            var tipoCapa = testTipoCapa(capaAsociada);
            var nombreCapa = array_capas[array_capas.buscar(editingLayer.name)].nombre_fantasia;
            var editable_atributos = array_capas[array_capas.buscar(editingLayer.name)].select_control;
  
//            Ext.getCmp('basic-statusbar').setStatus({text:'Editando capa: '+editingLayer.name, iconCls:'x-status-editando'});
            $('#editando_capa').show();
            $('.layer-edit').css('visibility','visible');
            $('#editando_capa').text("Editando capa: "+editingLayer.name);
            if (tipoCapa === 'Point')
            {
                    //fuerzo el encendido de la capa
                    buscar_nodo(tree.root,nombreCapa,nodo);
                    nodo[0].ui.toggleCheck(true);

                    //configuro los elementos de la barra
                    mapPanel.getTopToolbar().addItem({id: 'front_spacer_punto', xtype: 'tbseparator'});
                    
                    //boton agregar feature
                    action = new GeoExt.Action({
                        id: 'dibuja_punto',
                        map: map,
                        control: new OpenLayers.Control.DrawFeature(
                                editingLayer, OpenLayers.Handler.Point, 
                                {
                                    title: "Dibujar Puntos",
                                    featureAdded: function(event)
                                    {
                                        if(testea_limite(event) === false)
                                        {
                                            feature_agregada = editingLayer.getFeatureById(event.id);
                                            editingLayer.removeFeatures([feature_agregada]);
                                            mensajeError('Prohibido','No tiene permitido dibujar fuera de su región habilitada.');
                                        }
                                       
                                    }
                                    
                                }
                        ),
                        handler:function(evt)
                        {
                            if(evt.pressed == true){
                                    undoRedoOnDo = OpenLayers.Event.observe(document, "keydown", function(evt) {
                                            var handled = false;

                                            if(editingLayer != null && typeof editingLayer != 'undefined'){

                                                switch (evt.keyCode) {
                                                    case 90: // z
                                                        if (evt.metaKey || evt.ctrlKey) {
                                                            actions["dibuja_punto"].control.undo();
                                                            handled = true;
                                                        }
                                                        break;
                                                    case 89: // y
                                                        if (evt.metaKey || evt.ctrlKey) {
                                                            actions["dibuja_punto"].control.redo();
                                                            handled = true;
                                                        }
                                                        break;
                                                    case 27: // esc
                                                        actions["dibuja_punto"].control.cancel();
                                                        handled = true;
                                                        break;
                                                }
                                                if (handled) {
                                                    OpenLayers.Event.stop(evt);
                                                }
                                            }
                                    });
                            }
                            else
                            {
                                if(typeof undoRedoOnDo != 'undefined' && undoRedoOnDo != null){
                                    OpenLayers.Event.stop(undoRedoOnDo);
                                }
                            }
                        },
                        height: 40,
                        width:40,
                        toggleGroup: toogleDrawGroup,
                        allowDepress: true,
                        pressed: false,
                        group: "draw",
                        checked: false,
                        iconCls: "toolbarMenuDibujaPunto",
                        tooltip:"Dibujar Puntos"
                    });
                    actions["dibuja_punto"] = action;
                    mapPanel.getTopToolbar().addItem(action); 

                    //boton modificar feature
                    action = new GeoExt.Action({
                        id: 'modifica_punto',
                        map: map,
                        control: new OpenLayers.Control.ModifyFeature(editingLayer, {
                                    title: "Modificar Puntos",
                                    vertexRenderIntent: "temporary"
                                    
                                }
                        ),
                        handler:function(evt){                         
                             
                            editingLayer.events.register("featuremodified",null,function(vertex) { 
                                
                                        if(testea_limite(vertex.feature) === false)
                                        {
                                            
                                            movePoint(vertex.feature.geometry,original_feature.x,original_feature.y);
                                            editingLayer.redraw();
                                            actions["modifica_punto"].control.unselectFeature();
                                            original_feature = null;
                                            mensajeError('Prohibido','No tiene permitido dibujar fuera de su región habilitada.');
                                        }
                                        else
                                        {
                                            actions["modifica_punto"].control.unselectFeature();
                                        }
                                        
                                    });
                                    
                            editingLayer.events.register("beforefeaturemodified",null,function(vertex) { 
                                
                                        original_feature = vertex.feature.geometry.clone();
                                        
                            });
                                                                
                            if(seleccionSimpleCapaEditada.active === true)
                            {
                                Ext.getCmp('seleccion_in_box').toggle(false);
                                seleccionSimpleCapaEditada.unselectAll();
                                seleccionSimpleCapaEditada.deactivate();
                                
                            }
                            
                            if(evt.pressed == true){
                                undoRedo = new UndoRedo(editingLayer);
                                actions["undo"].enable();
                                actions["redo"].enable();
                                
                                undoRedo.resetEditIndex();
                                
                                if(seleccionSimpleCapaEditada.active === true)
                                {
                                    Ext.getCmp('seleccion_in_box').toggle(false);
                                    seleccionSimpleCapaEditada.unselectAll();
                                    seleccionSimpleCapaEditada.deactivate();
                                }
                            }
                            else
                            {
                                actions["undo"].disable();
                                actions["redo"].disable();
                               
                                if(typeof undoRedo !== 'undefined')
                                    undoRedo = null;
                            }
                            
                        
                        },
                        height: 40,
                        width:40,
                        toggleGroup: toogleDrawGroup,
                        allowDepress: true,
                        pressed: false,
                        group: "draw",
                        checked: false,
                        iconCls:"toolbarMenuEditaPunto",
                        tooltip:"Modificar Puntos"
                    });
                    actions["modifica_punto"] = action;                        
                    mapPanel.getTopToolbar().addItem(action); 

                    //boton eleminar feature

                    action = new GeoExt.Action({
                        id: 'elimina_punto',
                        map: map,
                        control: new DeleteFeature(editingLayer, {title: "Eliminar Puntos"}),
                        handler:function (evt)
                        {
                            if(evt.pressed == true){
                                undoRedo = new UndoRedo(editingLayer);
                                actions["undo"].disable();
                                actions["redo"].disable();
                                //undoRedo.resetEditIndex();
                            }
                            else
                            {
                                actions["undo"].disable();
                                actions["redo"].disable();
                               
                                if(typeof undoRedo !== 'undefined')
                                    undoRedo = null;
                            }
                        },
                        height: 40,
                        width:40,
                        toggleGroup: toogleDrawGroup,
                        allowDepress: true,
                        pressed: false,
                        group: "draw",
                        checked: false,
                        iconCls:"toolbarMenuEliminaPunto",
                        tooltip:"Eliminar Puntos"
                    });
                    actions["elimina_punto"] = action;
                    mapPanel.getTopToolbar().addItem(action); 

                    
                    action = new GeoExt.Action({
                        id: 'undo',
                        map: map,
                        handler:function ()
                        {
                            if(typeof undoRedo != 'undefined' && undoRedo != null)
                                undoRedo.undo(); 
                        },
                        height: 40,
                        width:40,
                        allowDepress: false,
                        pressed: false,
                        group: "draw",
                        iconCls:"toolbarMenuUndo",
                        tooltip:"Deshacer"
                    });
                    actions["undo"] = action;
                    mapPanel.getTopToolbar().addItem(action);
                    
                    action = new GeoExt.Action({
                        id: 'redo',
                        map: map,
                        handler:function ()
                        {
                            if(typeof undoRedo != 'undefined' && undoRedo != null)
                                undoRedo.redo(); 
                        },
                        height: 40,
                        width:40,
                        allowDepress: false,
                        pressed: false,
                        group: "draw",
                        iconCls:"toolbarMenuRedo",
                        tooltip:"Rehacer"
                    });
                    actions["redo"] = action;
                    mapPanel.getTopToolbar().addItem(action);
                    
                    
                    if(editable_atributos === true)
                    {

                        seleccionSimpleCapaEditada = new OpenLayers.Control.SelectFeature(
                                editingLayer,
                                {
                                    clickout: true, toggle: true,
                                    multiple: false, hover: false,
                                    toggleKey: "ctrlKey", // ctrl key removes from selection
                                    multipleKey: "shiftKey", // shift key adds to selection
                                    box: true
                                }
                        );

                        action = new Ext.Action({
                               id: 'seleccion_in_box',
                               map: map,
                               handler: function(){
                                       if(seleccionSimpleCapaEditada.active === true)
                                       {
                                           seleccionSimpleCapaEditada.unselectAll();
                                           seleccionSimpleCapaEditada.deactivate();
                                       }
                                       else
                                       {
                                           seleccionSimpleCapaEditada.unselectAll();
                                           seleccionSimpleCapaEditada.activate();
                                       }
                                   },
                               height: 40,
                               width:40,
                               toggleGroup: seleccionGroup,
                               allowDepress: true,
                               pressed: true,
                               group: "seleccion",
                               checked: true,
                               iconCls:"gxp-icon-box-selection",
                               tooltip:"Habilitar selección"
                           });
                        actions["seleccion_in_box"] = action;
                        mapPanel.getTopToolbar().addItem(action); 

//                        editingLayer.events.on({
//                                featureselected: function(e) {
//                                    creaPopup(e.feature, editingLayer,seleccionSimpleCapaEditada);
//                                }
//                                
//                        });

                        mapPanel.map.addControl(seleccionSimpleCapaEditada); 
                        seleccionSimpleCapaEditada.activate();
                        
                        //SNAP CONTROLS
                        
                        action = new GeoExt.Action({
                            id: 'snapControl',
                            map: map,
                            handler: function()
                                        {
                                           var capas_para_snap = new Array();


    //                                                                        controlSnap.destroy();

                                           capas_para_snap.push({
                                                                    xtype: 'numberfield',
                                                                    fieldLabel: 'Tolerancia Snap',
                                                                    labelWidth: 110,
                                                                    name: 'tolerancia',
                                                                    width: 100,
                                                                    allowBlank: false,
                                                                    value: 10,
                                                                    id:'snap_tolerance'
                                                                });

                                           $(capas).each(function(idx, unaCapa)
                                                    {  
                                                        if(unaCapa.CLASS_NAME == "OpenLayers.Layer.Vector"){
                                                            capas_para_snap.push({
                                                                boxLabel: unaCapa.name,
                                                                name: unaCapa.name,
                                                                fieldLabel: '',
                                                                labelWidth: 110,
                                                                labelSeparator: '',
                                                                xtype: 'checkbox',
                                                                id:'checkboxCapas'+idx
                                                            } );
                                                        }

                                            });

                                            capas_para_snap[1].fieldLabel = 'Capas';


                                            var items_snap = [ {
                                                    bodyStyle: 'padding-right:5px;',
                                                    items: {
                                                        xtype: 'fieldset',
                                                        title: 'Configuración Control Snap',
                                                        height:'auto',
                                                        defaultType: 'checkbox', // each item will be a checkbox
                                                        items: capas_para_snap,
                                                        checkboxToggle:true

                                                    }
                                                }
                                            ];  

                                            if(!SnapWin){
                                                    SnapWin = new Ext.Window({
                                                        title:'Snap a capa '+editingLayer.name,
                                                        layout:'fit',
                                                        width:300,
                                                        height: 300,
                                                        minHeight:300,
                                                        closeAction:'hide',
                                                        plain: true,
                                                        draggable: false,
                                                        items: items_snap,
                                                        buttons: [
                                                            {
                                                                text:'Listo',
                                                                disabled:false,
                                                                id:'snapListo',
                                                                handler:function ()
                                                                {
                                                                        var capas_2_snap = new Array();
                                                                        capas_seleccionadas = $("input[id*='checkboxCapas']:checked");


                                                                         $(capas_seleccionadas).each(function(idx, unaCapa)
                                                                         {
                                                                            if(capas_seleccionadas.length >= 1)
                                                                                 capas_2_snap.push(capas.buscar_capa(unaCapa.name));

                                                                         });

                                                                    if(capas_seleccionadas.length >= 1){
                                                                        if(typeof controlSnap == 'undefined'){

                                                                            controlSnap = new OpenLayers.Control.Snapping({
                                                                                defaults: {
                                                                                    tolerance:  Ext.getCmp('snap_tolerance').getValue(),
                                                                                    edge: true
                                                                                },
                                                                                targets: capas_2_snap ,
                                                                                greedy: false
                                                                            });
                                                                            controlSnap.setLayer(editingLayer);
                                                                            controlSnap.activate();
                                                                            SnapWin.hide();
                                                                        }
                                                                        else
                                                                        {
                                                                            controlSnap.setTargets(capas_2_snap);
                                                                            controlSnap.setLayer(editingLayer);
                                                                            controlSnap.activate();
                                                                            SnapWin.hide();
                                                                        }
                                                                    }
                                                                    else
                                                                    {
                                                                        controlSnap.setTargets();
                                                                        controlSnap.deactivate();
                                                                        mensajeAtencion('Atención','No se seleccionaron capas.');   
                                                                    }                                                            
                                                             }

                                                            },
                                                            {
                                                                text: 'Cerrar',
                                                                handler: function(){
                                                                    SnapWin.hide();
                                                                }
                                                            }]
                                                    });
                                                }
                                                SnapWin.show(this); 
                                                SnapWin.center();
                                        },

                                        height: 40,
                                        width:40,
                                        //toggleGroup: toogleDrawGroup,
                                        allowDepress: false,
                                        pressed: false,
                                        checked: false,
                                        iconCls:"toolbarMenuSnapping",
                                        tooltip:"Snap control"
                        });
                        actions["snapControl"] = action;
                        mapPanel.getTopToolbar().addItem(action);

                   }
                   else
                   {
                       //TODO manejar el caso que no se habilita la edicion
                   }

                    mapPanel.getTopToolbar().doLayout();

                }

            if (tipoCapa === 'LineString')
            {
                //fuerzo el encendido de la capa
                buscar_nodo(tree.root,nombreCapa,nodo);
                nodo[0].ui.toggleCheck(true);

                //configuro los elementos de la barra
                mapPanel.getTopToolbar().addItem({id: 'front_spacer_segmento', xtype: 'tbseparator'});
                //TODO cambiar tamaño de botones
                //boton agregar feature
                action = new GeoExt.Action({
                    id: 'dibuja_segmento',
                    map: map,
                    control: new OpenLayers.Control.DrawFeature(
                            editingLayer, OpenLayers.Handler.Path, 
                            {
                                title: "Dibujar Segmentos",
                                featureAdded: function(event)
                                {
                                    if(testea_limite(event) === false)
                                    {
                                        feature_agregada = editingLayer.getFeatureById(event.id);
                                        editingLayer.removeFeatures([feature_agregada]);
                                        mensajeError('Prohibido','No tiene permitido dibujar fuera de su región habilitada.');
                                    }

                                }
                            }
                    ),
                    handler:function(evt)
                    {
                        if(evt.pressed === true){
                                undoRedoOnDo = OpenLayers.Event.observe(document, "keydown", function(evt) {
                                        var handled = false;

                                        if(editingLayer != null && typeof editingLayer !== 'undefined'){

                                            switch (evt.keyCode) {
                                                case 90: // z
                                                    if (evt.metaKey || evt.ctrlKey) {
                                                        actions["dibuja_segmento"].control.undo();
                                                        handled = true;
                                                    }
                                                    break;
                                                case 89: // y
                                                    if (evt.metaKey || evt.ctrlKey) {
                                                        actions["dibuja_segmento"].control.redo();
                                                        handled = true;
                                                    }
                                                    break;
                                                case 27: // esc
                                                    actions["dibuja_segmento"].control.cancel();
                                                    handled = true;
                                                    break;
                                            }
                                            if (handled) {
                                                OpenLayers.Event.stop(evt);
                                            }
                                        }
                                });
                        }
                        else
                        {
                            if(typeof undoRedoOnDo !== 'undefined' && undoRedoOnDo != null){
                                OpenLayers.Event.stop(undoRedoOnDo);
                            }
                        }
                    },
                    height: 40,
                    width:40,
                    toggleGroup: toogleDrawGroup,
                    allowDepress: true,
                    pressed: false,
                    group: "draw",
                    checked: false,
                    iconCls: "toolbarMenuDibujaLinea",
                    tooltip:"Dibujar Segmento"
                });
                actions["dibuja_segmento"] = action;
                mapPanel.getTopToolbar().addItem(action); 

                action = new GeoExt.Action({
                    id: 'modifica_segmento',
                    map: map,
                    control: new OpenLayers.Control.ModifyFeature(editingLayer, {
                                title: "Modificar Segmentos",
                                vertexRenderIntent: "temporary"
                            }
                    ),
                    handler:function(evt){

                        editingLayer.events.register("featuremodified",null,function(vertex) { 

                                    if(testea_limite(vertex.feature) === false)
                                    {                                           
                                        if(original_feature.geometrias.length !== vertex.feature.geometry.components.length)
                                        {
                                            vertex.feature.geometry.removeComponent(actions["modifica_segmento"].control.vertex.geometry);
                                            editingLayer.redraw();
                                            actions["modifica_segmento"].control.unselectFeature();
                                            original_feature = null;
                                        }
                                        else
                                        {
                                            movePoints(actions["modifica_segmento"].control.vertex,original_feature);
                                            editingLayer.redraw();
                                            actions["modifica_segmento"].control.unselectFeature();
                                            original_feature = null;
                                        }
                                        mensajeError('Prohibido','No tiene permitido dibujar fuera de su región habilitada.');
                                    }
                                    else
                                    {
                                        actions["modifica_segmento"].control.unselectFeature();
                                    }

                                });

                        editingLayer.events.register("beforefeaturemodified",null,function(vertex) { 

                                    original_feature = guardaGeometria(vertex);// {geometry:vertex.feature.geometry.clone()};

                        });

                        if(seleccionSimpleCapaEditada.active === true)
                        {
                            Ext.getCmp('seleccion_in_box').toggle(false);
                            seleccionSimpleCapaEditada.unselectAll();
                            seleccionSimpleCapaEditada.deactivate();

                        }

                        if(evt.pressed == true){
                            undoRedo = new UndoRedo(editingLayer);
                            actions["undo"].enable();
                            actions["redo"].enable();
                            undoRedo.resetEditIndex();

                            if(seleccionSimpleCapaEditada.active === true)
                            {
                                Ext.getCmp('seleccion_in_box').toggle(false);
                                seleccionSimpleCapaEditada.unselectAll();
                                seleccionSimpleCapaEditada.deactivate();
                            }
                        }
                        else
                        {
                            actions["undo"].disable();
                            actions["redo"].disable();

                            if(typeof undoRedo != 'undefined')
                                undoRedo = null;
                        }


                    },
                    height: 40,
                    width:40,
                    toggleGroup: toogleDrawGroup,
                    allowDepress: true,
                    pressed: false,
                    group: "draw",
                    checked: false,
                    iconCls:"toolbarMenuEditaLinea",
                    tooltip:"Modificar Segmento"
                });
                actions["modifica_segmento"] = action;
                mapPanel.getTopToolbar().addItem(action); 


                action = new GeoExt.Action({
                    id: 'elimina_segmento',
                    map: map,
                    control: new DeleteFeature(editingLayer, {title: "Eliminar Segmento"}),
                    handler:function (evt)
                    {
                        if(evt.pressed == true){
                            undoRedo = new UndoRedo(editingLayer);
                            actions["undo"].disable();
                            actions["redo"].disable();
                            undoRedo.resetEditIndex();
                        }
                        else
                        {
                            actions["undo"].disable();
                            actions["redo"].disable();

                            if(typeof undoRedo != 'undefined')
                                undoRedo = null;
                        }
                    },
                    height: 40,
                    width:40,
                    toggleGroup: toogleDrawGroup,
                    allowDepress: true,
                    pressed: false,
                    group: "draw",
                    checked: false,
                    iconCls:"toolbarMenuEliminaLinea",
                    tooltip:"Eliminar Segmento"
                });
                actions["elimina_segmento"] = action;
                mapPanel.getTopToolbar().addItem(action); 

                action = new GeoExt.Action({
                    id: 'undo',
                    map: map,
                    handler:function ()
                    {
                        if(typeof undoRedo != 'undefined' && undoRedo != null)
                            undoRedo.undo(); 
                    },
                    height: 40,
                    width:40,
                    allowDepress: false,
                    pressed: false,
                    group: "draw",
                    iconCls:"toolbarMenuUndo",
                    tooltip:"Deshacer"
                });
                actions["undo"] = action;
                mapPanel.getTopToolbar().addItem(action);

                action = new GeoExt.Action({
                    id: 'redo',
                    map: map,
                    handler:function ()
                    {
                        if(typeof undoRedo != 'undefined' && undoRedo != null)
                            undoRedo.redo(); 
                    },
                    height: 40,
                    width:40,
                    allowDepress: false,
                    pressed: false,
                    group: "draw",
                    iconCls:"toolbarMenuRedo",
                    tooltip:"Rehacer"
                });
                actions["redo"] = action;
                mapPanel.getTopToolbar().addItem(action);

                if(editable_atributos === true)
                {

                    seleccionSimpleCapaEditada = new OpenLayers.Control.SelectFeature(
                            editingLayer,
                            {
                                clickout: true, toggle: true,
                                multiple: false, hover: false,
                                toggleKey: "ctrlKey", // ctrl key removes from selection
                                multipleKey: "shiftKey", // shift key adds to selection
                                box: true
                            }
                    );

                    action = new Ext.Action({
                           id: 'seleccion_in_box',
                           map: map,
                           handler: function(){
                                   if(seleccionSimpleCapaEditada.active === true)
                                   {
                                       seleccionSimpleCapaEditada.unselectAll();
                                       seleccionSimpleCapaEditada.deactivate();
                                   }
                                   else
                                   {
                                       seleccionSimpleCapaEditada.unselectAll();
                                       seleccionSimpleCapaEditada.activate();
                                   }
                               },
                           height: 40,
                           width:40,
                           toggleGroup: seleccionGroup,
                           allowDepress: true,
                           pressed: true,
                           group: "seleccion",
                           checked: true,
                           iconCls:"gxp-icon-box-selection",
                           tooltip:"Habilitar selección"
                       });
                    actions["seleccion_in_box"] = action;
                    mapPanel.getTopToolbar().addItem(action); 

    //                        editingLayer.events.on({
    //                                featureselected: function(e) {
    //                                    creaPopup(e.feature, editingLayer,seleccionSimpleCapaEditada);
    //                                }
    //                        });

                    mapPanel.map.addControl(seleccionSimpleCapaEditada); 

                    seleccionSimpleCapaEditada.activate();

                    //SNAP CONTROLS

                    action = new GeoExt.Action({
                        id: 'snapControl',
                        map: map,
                        handler: function()
                                    {
                                       var capas_para_snap = new Array();


    //                                                                        controlSnap.destroy();

                                       capas_para_snap.push({
                                                                xtype: 'numberfield',
                                                                fieldLabel: 'Tolerancia Snap',
                                                                labelWidth: 110,
                                                                name: 'tolerancia',
                                                                width: 100,
                                                                allowBlank: false,
                                                                value: 10,
                                                                id:'snap_tolerance'
                                                            });

                                       $(capas).each(function(idx, unaCapa)
                                                {  
                                                    if(unaCapa.CLASS_NAME == "OpenLayers.Layer.Vector"){
                                                        capas_para_snap.push({
                                                            boxLabel: unaCapa.name,
                                                            name: unaCapa.name,
                                                            fieldLabel: '',
                                                            labelWidth: 110,
                                                            labelSeparator: '',
                                                            xtype: 'checkbox',
                                                            id:'checkboxCapas'+idx
                                                        } );
                                                    }

                                        });

                                        capas_para_snap[1].fieldLabel = 'Capas';


                                        var items_snap = [ {
                                                bodyStyle: 'padding-right:5px;',
                                                items: {
                                                    xtype: 'fieldset',
                                                    title: 'Configuración Control Snap',
                                                    height:'auto',
                                                    defaultType: 'checkbox', // each item will be a checkbox
                                                    items: capas_para_snap,
                                                    checkboxToggle:true

                                                }
                                            }
                                        ];  

                                        if(!SnapWin){
                                                SnapWin = new Ext.Window({
                                                    title:'Snap a capa '+editingLayer.name,
                                                    layout:'fit',
                                                    width:300,
                                                    height: 300,
                                                    minHeight:300,
                                                    closeAction:'hide',
                                                    plain: true,
                                                    draggable: false,
                                                    items: items_snap,
                                                    buttons: [
                                                        {
                                                            text:'Listo',
                                                            disabled:false,
                                                            id:'snapListo',
                                                            handler:function ()
                                                            {
                                                                    var capas_2_snap = new Array();
                                                                    capas_seleccionadas = $("input[id*='checkboxCapas']:checked");


                                                                     $(capas_seleccionadas).each(function(idx, unaCapa)
                                                                     {
                                                                        if(capas_seleccionadas.length >= 1)
                                                                             capas_2_snap.push(capas.buscar_capa(unaCapa.name));

                                                                     });

                                                                if(capas_seleccionadas.length >= 1){
                                                                    if(typeof controlSnap == 'undefined'){

                                                                        controlSnap = new OpenLayers.Control.Snapping({
                                                                            defaults: {
                                                                                tolerance:  Ext.getCmp('snap_tolerance').getValue(),
                                                                                edge: true
                                                                            },
                                                                            targets: capas_2_snap ,
                                                                            greedy: false
                                                                        });
                                                                        controlSnap.setLayer(editingLayer);
                                                                        controlSnap.activate();
                                                                        SnapWin.hide();
                                                                    }
                                                                    else
                                                                    {
                                                                        controlSnap.setTargets(capas_2_snap);
                                                                        controlSnap.setLayer(editingLayer);
                                                                        controlSnap.activate();
                                                                        SnapWin.hide();
                                                                    }
                                                                }
                                                                else
                                                                {
                                                                    controlSnap.setTargets();
                                                                    controlSnap.deactivate();
                                                                    mensajeAtencion('Atención','No se seleccionaron capas.');   
                                                                }                                                            
                                                         }
                                                        },
                                                        {
                                                            text: 'Cerrar',
                                                            handler: function(){
                                                                SnapWin.hide();
                                                            }
                                                        }]
                                                });
                                            }
                                            SnapWin.show(this); 
                                            SnapWin.center();
                                    },

                                    height: 40,
                                    width:40,
                                    //toggleGroup: toogleDrawGroup,
                                    allowDepress: false,
                                    pressed: false,
                                    checked: false,
                                    iconCls:"toolbarMenuSnapping",
                                    tooltip:"Snap control"
                    });
                    actions["snapControl"] = action;
                    mapPanel.getTopToolbar().addItem(action);

               }
                mapPanel.getTopToolbar().doLayout();

            }

            if (tipoCapa == 'Polygon')
            {
                    //fuerzo el encendido de la capa
                    buscar_nodo(tree.root,nombreCapa,nodo);
                    nodo[0].ui.toggleCheck(true);

                    //configuro los elementos de la barra
                    mapPanel.getTopToolbar().addItem({id: 'front_spacer_poligono', xtype: 'tbseparator'});
                                        
                    action = new GeoExt.Action({
                        id: 'dibuja_poligono',
                        map: map,
                        control: new OpenLayers.Control.DrawFeature(
                                editingLayer,OpenLayers.Handler.Polygon,
                                {
                                    title: "Dibujar Poligono",
                                    featureAdded: function(event)
                                    {
                                        if(testea_limite(event) === false)
                                        {
                                            feature_agregada = editingLayer.getFeatureById(event.id);
                                            editingLayer.removeFeatures([feature_agregada]);
                                            mensajeError('Prohibido','No tiene permitido dibujar fuera de su región habilitada.');
                                        }
                                       
                                    }
                                    
                                }
                        ),
                        handler:function(evt)
                        {

                            if(evt.pressed == true){
                                    undoRedoOnDo = OpenLayers.Event.observe(document, "keydown", function(evt) {
                                            var handled = false;

                                            if(editingLayer != null && typeof editingLayer != 'undefined'){

                                                switch (evt.keyCode) {
                                                    case 90: // z
                                                        if (evt.metaKey || evt.ctrlKey) {
                                                            actions["dibuja_poligono"].control.undo();
                                                            handled = true;
                                                        }
                                                        break;
                                                    case 89: // y
                                                        if (evt.metaKey || evt.ctrlKey) {
                                                            actions["dibuja_poligono"].control.redo();
                                                            handled = true;
                                                        }
                                                        break;
                                                    case 27: // esc
                                                        actions["dibuja_poligono"].control.cancel();
                                                        handled = true;
                                                        break;
                                                }
                                                if (handled) {
                                                    OpenLayers.Event.stop(evt);
                                                }
                                            }
                                    });
                            }
                            else
                            {
                                if(typeof undoRedoOnDo != 'undefined' && undoRedoOnDo != null){
                                    OpenLayers.Event.stop(undoRedoOnDo);
                                }
                            }
                        },
                        height: 40,
                        width:40,
                        toggleGroup: toogleDrawGroup,
                        allowDepress: true,
                        pressed: false,
                        group: "draw",
                        checked: false,
                        iconCls:"toolbarMenuDibujaPoligono",
                        tooltip:"Dibujar Poligono"
                    });
                    actions["dibuja_poligono"] = action;
                    mapPanel.getTopToolbar().addItem(action); 
 
                    //boton modificar feature
                    action = new GeoExt.Action({
                        id: 'modifica_poligono',
                        map: map,
                        control: new OpenLayers.Control.ModifyFeature(editingLayer, {
                                    title: "Modificar Poligono",
                                    vertexRenderIntent: "temporary"
                                    
                                }
                        ),
                        handler:function(evt){
                           
                            editingLayer.events.register("featuremodified",null,function(vertex) { 
                                
                                        if(testea_limite(vertex.feature) === false)
                                        {                                           
                                            if(original_feature.geometrias.length !== vertex.feature.geometry.components[0].components.length)
                                            {
                                                vertex.feature.geometry.components[0].removeComponent(actions["modifica_poligono"].control.vertex.geometry);
                                                editingLayer.redraw();
                                                actions["modifica_poligono"].control.unselectFeature();
                                                original_feature = null;
                                            }
                                            else
                                            {
                                                movePoints(actions["modifica_poligono"].control.vertex,original_feature);
                                                editingLayer.redraw();
                                                actions["modifica_poligono"].control.unselectFeature();
                                                original_feature = null;
                                            }
                                            mensajeError('Prohibido','No tiene permitido dibujar fuera de su región habilitada.');
                                        }
                                        else
                                        {
                                            actions["modifica_poligono"].control.unselectFeature();
                                        }
                                        
                                    });
                                    
                            editingLayer.events.register("beforefeaturemodified",null,function(vertex) { 
                                
                                        original_feature = guardaGeometria(vertex);// {geometry:vertex.feature.geometry.clone()};
                                        
                            });
                            
                            if(evt.pressed == true){
                                undoRedo = new UndoRedo(editingLayer);
                                actions["undo"].enable();
                                actions["redo"].enable();
                                undoRedo.resetEditIndex();
                                
                                if(seleccionSimpleCapaEditada.active === true)
                                {
                                    Ext.getCmp('seleccion_in_box').toggle(false);
                                    seleccionSimpleCapaEditada.unselectAll();
                                    seleccionSimpleCapaEditada.deactivate();
                                }
                            }
                            else
                            {
                                actions["undo"].disable();
                                actions["redo"].disable();
                               
                                if(typeof undoRedo != 'undefined')
                                    undoRedo = null;
                            }
                            
                        },
                        height: 40,
                        width:40,
                        toggleGroup: toogleDrawGroup,
                        allowDepress: true,
                        pressed: false,
                        group: "draw",
                        checked: false,
                        iconCls:"toolbarMenuEditaPoligono",
                        tooltip:"Modificar Poligono"
                    });
                    actions["modifica_poligono"] = action;
                    mapPanel.getTopToolbar().addItem(action); 

                    //boton eleminar feature

                    action = new GeoExt.Action({
                        id: 'elimina_poligono',
                        map: map,
                        control: new DeleteFeature(editingLayer, {title: "Eliminar Poligono"}),
                        handler:function (evt)
                        {
                            if(evt.pressed == true){
                                undoRedo = new UndoRedo(editingLayer);
                                actions["undo"].disable();
                                actions["redo"].disable();
                                undoRedo.resetEditIndex();
                            }
                            else
                            {
                                actions["undo"].disable();
                                actions["redo"].disable();
                               
                                if(typeof undoRedo != 'undefined')
                                    undoRedo = null;
                            }
                        },
                        height: 40,
                        width:40,
                        toggleGroup: toogleDrawGroup,
                        allowDepress: true,
                        pressed: false,
                        group: "draw",
                        checked: false,
                        iconCls:"toolbarMenuEliminaPoligono",
                        tooltip:"Eliminar Poligono"
                    });
                    actions["elimina_poligono"] = action;
                    mapPanel.getTopToolbar().addItem(action);
                    
                    action = new GeoExt.Action({
                        id: 'undo',
                        map: map,
                        handler:function ()
                        {
                            if(typeof undoRedo != 'undefined' && undoRedo != null)
                                undoRedo.undo(); 
                        },
                        height: 40,
                        width:40,
                        allowDepress: false,
                        pressed: false,
                        group: "draw",
                        iconCls:"toolbarMenuUndo",
                        tooltip:"Deshacer"
                    });
                    actions["undo"] = action;
                    mapPanel.getTopToolbar().addItem(action);
                    
                    action = new GeoExt.Action({
                        id: 'redo',
                        map: map,
                        handler:function ()
                        {
                            if(typeof undoRedo != 'undefined' && undoRedo != null)
                                undoRedo.redo(); 
                        },
                        height: 40,
                        width:40,
                        allowDepress: false,
                        pressed: false,
                        group: "draw",
                        iconCls:"toolbarMenuRedo",
                        tooltip:"Rehacer"
                    });
                    actions["redo"] = action;
                    mapPanel.getTopToolbar().addItem(action);
                    
                    //dibujar hole en capa seleccionada
                    action = new GeoExt.Action({
                        id: 'dibuja_hole_poligono',
                        map: map,
                        handler: function()
                                        {
                                            actions["undo"].disable();
                                            actions["redo"].disable();
                                            
                                            if(typeof undoRedo != 'undefined')
                                                undoRedo = null;
                                            
                                            var poligonos_seleccionados = editingLayer.selectedFeatures;
                                            if(poligonos_seleccionados.length == 2){ //si hay al menos 2 poligonos
                                                
                                                var primer_poligono = poligonos_seleccionados[0];
                                                var poligono_a_quitar = poligonos_seleccionados[1];
                                                
                                                var newFeature = subtractFromFeature(primer_poligono, poligono_a_quitar); //le quito el hueco

                                                
                                                poligono_a_quitar.destroy();
                                                newFeature.toState(OpenLayers.State.INSERT); //marco el nuevo feature para insertar
                                                
                                                primer_poligono.style = { display: 'none' };
                                                primer_poligono.state = OpenLayers.State.DELETE;  //marco para eliminar el poligono original
                                                
                                                editingLayer.addFeatures(newFeature);   //agrego el nuevo poligono recortado a capa editada
                                             
                                            }
                                            else
                                            {  
                                                if(poligonos_seleccionados.length < 2 || poligonos_seleccionados.length > 2)
                                                     mensajeAtencion('Atención','Debe seleccionar dos poligono. El primero es la base y el segundo el que sera removido.');
                                                
                                            }
                                        }
                        ,
                        height: 40,
                        width:40,
                        //toggleGroup: toogleDrawGroup,
                        allowDepress: false,
                        pressed: false,
                        group: "draw",
                        checked: false,
                        iconCls:"toolbarMenuDibujaHuecoPoligono",
                        tooltip:"Substraer poligono"
                    });
                    actions["dibuja_hole_poligono"] = action;
                    mapPanel.getTopToolbar().addItem(action);

                    if(editable_atributos === true)
                    {

                        seleccionSimpleCapaEditada = new OpenLayers.Control.SelectFeature(
                                editingLayer,
                                {
                                    clickout: true, toggle: true,
                                    multiple: false, hover: false,
                                    toggleKey: "ctrlKey", // ctrl key removes from selection
                                    multipleKey: "shiftKey", // shift key adds to selection
                                    box: true
                                }
                        );

                        action = new Ext.Action({
                               id: 'seleccion_in_box',
                               map: map,
                               handler: function(){
                                       
                                       Ext.getCmp('modifica_poligono').baseAction.control.deactivate();
                                       if(seleccionSimpleCapaEditada.active === true)
                                       {
                                           
                                           seleccionSimpleCapaEditada.unselectAll();
                                           seleccionSimpleCapaEditada.deactivate();
                                       }
                                       else
                                       {
                                           seleccionSimpleCapaEditada.unselectAll();
                                           seleccionSimpleCapaEditada.activate();
                                       }
                                       
                                   },
                               height: 40,
                               width:40,
                               toggleGroup: seleccionGroup,
                               allowDepress: true,
                               pressed: true,
                               group: "seleccion",
                               checked: true,
                               iconCls:"gxp-icon-box-selection",
                               tooltip:"Habilitar selección"
                           });
                        actions["seleccion_in_box"] = action;
                        mapPanel.getTopToolbar().addItem(action); 
                        
                        mapPanel.map.addControl(seleccionSimpleCapaEditada); 

                        seleccionSimpleCapaEditada.activate();
                        
                        //SNAP CONTROLS
                        
                        action = new GeoExt.Action({
                            id: 'snapControl',
                            map: map,
                            handler: function()
                                        {
                                           var capas_para_snap = new Array();


    //                                                                        controlSnap.destroy();

                                           capas_para_snap.push({
                                                                    xtype: 'numberfield',
                                                                    fieldLabel: 'Tolerancia Snap',
                                                                    labelWidth: 110,
                                                                    name: 'tolerancia',
                                                                    width: 100,
                                                                    allowBlank: false,
                                                                    value: 10,
                                                                    id:'snap_tolerance'
                                                                });

                                           $(capas).each(function(idx, unaCapa)
                                                    {  
                                                        if(unaCapa.CLASS_NAME == "OpenLayers.Layer.Vector"){
                                                            capas_para_snap.push({
                                                                boxLabel: unaCapa.name,
                                                                name: unaCapa.name,
                                                                fieldLabel: '',
                                                                labelWidth: 110,
                                                                labelSeparator: '',
                                                                xtype: 'checkbox',
                                                                id:'checkboxCapas'+idx
                                                            } );
                                                        }

                                            });

                                            capas_para_snap[1].fieldLabel = 'Capas';


                                            var items_snap = [ {
                                                    bodyStyle: 'padding-right:5px;',
                                                    items: {
                                                        xtype: 'fieldset',
                                                        title: 'Configuración Control Snap',
                                                        height:'auto',
                                                        defaultType: 'checkbox', // each item will be a checkbox
                                                        items: capas_para_snap,
                                                        checkboxToggle:true

                                                    }
                                                }
                                            ];  

                                            if(!SnapWin){
                                                    SnapWin = new Ext.Window({
                                                        title:'Snap a capa '+editingLayer.name,
                                                        layout:'fit',
                                                        width:300,
                                                        height: 300,
                                                        minHeight:300,
                                                        closeAction:'hide',
                                                        plain: true,
                                                        draggable: false,
                                                        items: items_snap,
                                                        buttons: [
                                                            {
                                                                text:'Listo',
                                                                disabled:false,
                                                                id:'snapListo',
                                                                handler:function ()
                                                                {
                                                                        var capas_2_snap = new Array();
                                                                        capas_seleccionadas = $("input[id*='checkboxCapas']:checked");


                                                                         $(capas_seleccionadas).each(function(idx, unaCapa)
                                                                         {
                                                                            if(capas_seleccionadas.length >= 1)
                                                                                 capas_2_snap.push(capas.buscar_capa(unaCapa.name));

                                                                         });

                                                                    if(capas_seleccionadas.length >= 1){
                                                                        if(typeof controlSnap == 'undefined'){

                                                                            controlSnap = new OpenLayers.Control.Snapping({
                                                                                defaults: {
                                                                                    tolerance:  Ext.getCmp('snap_tolerance').getValue(),
                                                                                    edge: true
                                                                                },
                                                                                targets: capas_2_snap ,
                                                                                greedy: false
                                                                            });
                                                                            controlSnap.setLayer(editingLayer);
                                                                            controlSnap.activate();
                                                                            SnapWin.hide();
                                                                        }
                                                                        else
                                                                        {
                                                                            controlSnap.setTargets(capas_2_snap);
                                                                            controlSnap.setLayer(editingLayer);
                                                                            controlSnap.activate();
                                                                            SnapWin.hide();
                                                                        }
                                                                    }
                                                                    else
                                                                    {
                                                                        controlSnap.setTargets();
                                                                        controlSnap.deactivate();
                                                                        mensajeAtencion('Atención','No se seleccionaron capas.');   
                                                                    }                                                            
                                                             }

                                                            },
                                                            {
                                                                text: 'Cerrar',
                                                                handler: function(){
                                                                    SnapWin.hide();
                                                                }
                                                            }]
                                                    });
                                                }
                                                SnapWin.show(this); 
                                                SnapWin.center();
                                        },

                                        height: 40,
                                        width:40,
                                        //toggleGroup: toogleDrawGroup,
                                        allowDepress: false,
                                        pressed: false,
                                        checked: false,
                                        iconCls:"toolbarMenuSnapping",
                                        tooltip:"Snap control"
                        });
                        actions["snapControl"] = action;
                        mapPanel.getTopToolbar().addItem(action);

                   }
                    mapPanel.getTopToolbar().doLayout();

                }
              

            loadBotonGuardar(tipoCapa);
            
        }
        else
        {
            if(typeof layer_limite != 'undefined')
            { 
                map.removeLayer(layer_limite); //quito los limites que estaban cargados;
                layer_limite.destroy();
            }
            mensajeError('Error','No se puede editar la capa '+ capaAsociada.name.toUpperCase() +' hay un error de Conexión.');
        }
}

// FUNCIONES

function testea_limite(geometria)
{
    var points = geometria.geometry.getVertices();
    var contenido = new Array();
    var contiene = new Array();
    var total_puntos = points.length;
    
    var testeo = false;
    
    $(layer_limite.features).each(function (idx, feature)
    {
                contenido[idx] = 0;
                var suma_parcial = 0;

                $(points).each(function (idx, punto){
                        contains = feature.geometry.containsPoint(punto);
                        if(contains === true  )
                        {
                            suma_parcial += 1//si no esta estrictamente contenido en algun poligono limite
                        }
                });
                contenido[idx] = suma_parcial;
                
                var parser = new jsts.io.OpenLayersParser();
                contiene[idx] = parser.read(feature.geometry).contains( parser.read(geometria.geometry));
    });
                            
    
    $(contenido).each(function (idx, feature_test)
    {
        if(feature_test === total_puntos && contiene[idx] == true)  
        //todos los puntos incluido y ninguna interseccion con los limites
        {
            testeo =  true;
        }
    });
    
    return testeo;
    
}

function subtractFromFeature(positiveFeature, negativeFeature) {
    var parser = new jsts.io.OpenLayersParser();
    return new OpenLayers.Feature.Vector(
        parser.write(
            parser.read(positiveFeature.geometry).difference(
                parser.read(negativeFeature.geometry)
            )
        )
    );
}
    
function esEscalaCapturaPermitida() {
    
    if(escala_permitida == -1)
    {
        mensajeAtencion('Atención','La capa no esta habilitada para edición');
        return false;  
        
    }
    if (map.getScale() > escala_permitida) {
        
        mensajeAtencion('Atención','La escala debe ser mayor a 1:'+escala_permitida+' </br>Aumente el nivel de zoom e intente nuevamente');
       
        return false
    }
    return true
}


function finEditarCapa(capaAsociada)
{
    if(detectarCambiosPendientes())
    {
       
        Ext.MessageBox.show({
            title: 'Cambios sin Guardar',
            msg: '¿Desea Guardar los cambios realizados?',
            width:300,
            config : {opt:capaAsociada },
            fn: function (btn,text,opt) {
                                            
                if (btn == 'yes' ) { 

                    saveStrategy.save();
                    finEditar(opt.config.opt);
                }
                else
                {
                    finEditar(opt.config.opt);
                }
            },
            buttons: Ext.Msg.YESNO,
            icon : Ext.MessageBox.QUESTION
        });
    }
    else
    {
        finEditar(capaAsociada);
    }
}

function finEditar(capaAsociada)
{
        //***********************  add boton en barra menu insercion punto
        //var tipoCapa = array_capas[array_capas.buscar(editingLayer.name)].geometryType;
        
       
        saveStrategy.deactivate();
        var tipoCapa = testTipoCapa(capaAsociada);
        Ext.getCmp('basic-statusbar').setStatus({text:'Editor WFS-T IDESF', iconCls:icono_estado});
        $('#editando_capa').hide();
        $('.layer-edit').css('visibility','hidden');
        $('#editando_capa').text("");
        if(typeof layer_limite != 'undefined')
        {
                map.removeLayer(layer_limite); //quito los limites que estaban cargados;
                layer_limite.destroy();
        }
        
        if (tipoCapa == 'Point')
        {
            if(editingLayer.selectedFeatures > 0){
                actions["modifica_punto"].control.unselectFeature(editingLayer.selectedFeatures[0]);
            }
            actions["modifica_punto"].control.deactivate();
            mapPanel.getTopToolbar().remove('dibuja_punto',true);
            mapPanel.getTopToolbar().remove('modifica_punto',true);
            mapPanel.getTopToolbar().remove('elimina_punto',true);
            mapPanel.getTopToolbar().remove('guardar',true);
            mapPanel.getTopToolbar().remove('seleccion_in_box',true);
            mapPanel.getTopToolbar().remove('front_spacer_punto',true);
            mapPanel.getTopToolbar().remove('snapControl',true);
            mapPanel.getTopToolbar().remove('undo',true);
            mapPanel.getTopToolbar().remove('redo',true);
            mapPanel.getTopToolbar().doLayout();
            
            if(typeof undoRedoOnDo != 'undefined' )
            {
                if(undoRedoOnDo != null)
                {
                                OpenLayers.Event.stop(undoRedoOnDo);
                                delete undoRedoOnDo;
                }
            }
            
            if(typeof undoRedo != 'undefined' )
            {
                if(undoRedo != null)
                {
                    undoRedo.resetEditIndex();
                    undoRedo.destroy();
                }
            }
            
            seleccionSimpleCapaEditada.unselectAll();
            seleccionSimpleCapaEditada.deactivate();
            mapPanel.map.removeControl(seleccionSimpleCapaEditada); 
           
            if(typeof controlSnap != 'undefined')
            {
                controlSnap.setTargets();
                controlSnap.setLayer();
                controlSnap.deactivate();
            }         
            editingLayer = null;
            seleccionSimpleCapaEditada = null;
            saveStrategy.destroy();
            saveStrategy = null;
            
            //limpieza de paths
            map.controls.forEach(function(item,index){ 
                if(item.displayClass == "olControlDrawFeature")
                {
                    map.controls[index].destroy();
                }
               
            });
            
            map.controls.forEach(function(item,index){ 
               
                if(item.displayClass == "olControlModifyFeature")
                {
                    map.controls[index].destroy();
                }
            });
            
           
        }
        
        if (tipoCapa == 'LineString')
        {
            if(editingLayer.selectedFeatures > 0){
                actions["modifica_segmento"].control.unselectFeature(editingLayer.selectedFeatures[0]);
            }
            actions["modifica_segmento"].control.deactivate();
            mapPanel.getTopToolbar().remove('dibuja_segmento',true);
            mapPanel.getTopToolbar().remove('modifica_segmento',true);
            mapPanel.getTopToolbar().remove('elimina_segmento',true);
            mapPanel.getTopToolbar().remove('guardar',true);
            mapPanel.getTopToolbar().remove('seleccion_in_box',true);
            mapPanel.getTopToolbar().remove('snapControl',true);
            mapPanel.getTopToolbar().remove('front_spacer_segmento',true);
            mapPanel.getTopToolbar().remove('undo',true);
            mapPanel.getTopToolbar().remove('redo',true);
            mapPanel.getTopToolbar().doLayout();
            seleccionSimpleCapaEditada.unselectAll();
            seleccionSimpleCapaEditada.deactivate(); 
            mapPanel.map.removeControl(seleccionSimpleCapaEditada);
            
            
            if(typeof undoRedoOnDo != 'undefined' )
            {
                if(undoRedoOnDo != null)
                {
                                OpenLayers.Event.stop(undoRedoOnDo);
                                delete undoRedoOnDo;
                }
            }
            
            if(typeof undoRedo != 'undefined' )
            {
                if(undoRedo != null)
                {
                    undoRedo.resetEditIndex();
                    undoRedo.destroy();
                }
            }
            
            if(typeof controlSnap != 'undefined')
            {
                controlSnap.setTargets();
                controlSnap.setLayer();
                controlSnap.deactivate();
            }
            editingLayer = null;
            seleccionSimpleCapaEditada = null;
            saveStrategy.destroy();
            saveStrategy = null;
            
            //limpieza de paths
            map.controls.forEach(function(item,index){ 
                if(item.displayClass == "olControlDrawFeature")
                {
                    map.controls[index].destroy();
                }
               
            });
            
            map.controls.forEach(function(item,index){ 
               
                if(item.displayClass == "olControlModifyFeature")
                {
                    map.controls[index].destroy();
                }
            });
            
            
        }
        
        if (tipoCapa == 'Polygon')
        {
            if(editingLayer.selectedFeatures > 0){
                actions["modifica_poligono"].control.unselectFeature(editingLayer.selectedFeatures[0]);
            }
            actions["modifica_poligono"].control.deactivate();
            mapPanel.getTopToolbar().remove('dibuja_poligono',true);
            mapPanel.getTopToolbar().remove('modifica_poligono',true);
            mapPanel.getTopToolbar().remove('elimina_poligono',true);
            mapPanel.getTopToolbar().remove('dibuja_hole_poligono',true);
            mapPanel.getTopToolbar().remove('guardar',true);
            mapPanel.getTopToolbar().remove('seleccion_in_box',true);
            mapPanel.getTopToolbar().remove('snapControl',true);
            mapPanel.getTopToolbar().remove('front_spacer_poligono',true);
            mapPanel.getTopToolbar().remove('undo',true);
            mapPanel.getTopToolbar().remove('redo',true);
            mapPanel.getTopToolbar().doLayout();
            seleccionSimpleCapaEditada.unselectAll();
            seleccionSimpleCapaEditada.deactivate();
            mapPanel.map.removeControl(seleccionSimpleCapaEditada); 

            if(typeof undoRedoOnDo != 'undefined')
            {
                if(undoRedoOnDo != null)
                {
                                OpenLayers.Event.stop(undoRedoOnDo);
                                delete undoRedoOnDo;
                }
            }
            
            if(typeof undoRedo != 'undefined' )
            {
                if(undoRedo != null)
                {
                    undoRedo.resetEditIndex();
                    undoRedo.destroy();
                }
            }
            
            if(typeof controlSnap != 'undefined')
            {
                controlSnap.setTargets();
                controlSnap.setLayer();
                controlSnap.deactivate();
            }
            editingLayer = null;
            seleccionSimpleCapaEditada = null;
            saveStrategy.destroy();
            saveStrategy = null;
//            if(hole_capa != null)
//                hole_capa.destroy();
//
            //limpieza de paths
            map.controls.forEach(function(item,index){ 
                if(item.displayClass == "olControlDrawFeature")
                {
                    map.controls[index].destroy();
                }
               
            });
            
            map.controls.forEach(function(item,index){ 
               
                if(item.displayClass == "olControlModifyFeature")
                {
                    map.controls[index].destroy();
                }
            });
            
            
        }
}

function loadBotonGuardar( tipoCapa )
{
    
    action = new GeoExt.Action({
                id: 'guardar',
                map: map,
                control: new OpenLayers.Control.Button({
                    title: "Guardar Cambios",
                    trigger: function() {
                        
                        if(tipoCapa == 'Point')
                        {
                            if(actions["modifica_punto"].control.feature) { //para guardado parcial
                                actions["modifica_poligono"].control.unselectFeature(editingLayer.selectedFeatures[0]);
                                var control = mapPanel.map.getControlsBy("displayClass","olControlSelectFeature")[0];
                                control.unselectAll();
                            }
                            //guardar estilo
                            setEstilos(editingLayer.name);
                        }
                        
                        if(tipoCapa == 'LineString')
                        {
                            if(actions["modifica_segmento"].control.feature) { //para guardado parcial
                                actions["modifica_poligono"].control.unselectFeature(editingLayer.selectedFeatures[0]);
                                var control = mapPanel.map.getControlsBy("displayClass","olControlSelectFeature")[0];
                                control.unselectAll();
                            }
                            
                            setEstilos(editingLayer.name);
                        }
                        if(tipoCapa == 'Polygon')
                        {
                            if(actions["modifica_poligono"].control.feature) { //para guardado parcial
                                actions["modifica_poligono"].control.unselectFeature(editingLayer.selectedFeatures[0]);
                                
                                var control = mapPanel.map.getControlsBy("displayClass","olControlSelectFeature")[0];
                                control.unselectAll();
                            }
                            
                            setEstilos(editingLayer.name);
                        }
                        saveStrategy.save();
                    }
                }),
                height: 40,
                width:40,
                allowDepress: true,
                pressed: false,
                group: "draw",
                checked: false,
                iconCls: 'toolbarMenuGrabar',
//                icon: "img/toolbar/save.ico",
                tooltip:"Guardar Cambios"
            });
            actions["guardar"] = action;
            mapPanel.getTopToolbar().addItem(action); 
            saveStrategy.activate();
            mapPanel.getTopToolbar().doLayout();
            
}


function cambiosConExito()
{
    mensajeExito('Exito','Las entidades geograficas se guardaron correctamente.');
}

function cambiosConErrores()
{
    mensajeError('Error!','Los elementos agregados no pudieron ser guardados.');
    
}

function changeSettings(){
    
  
        var config_save_time = {
            xtype: 'fieldset',
            title: 'Configuración Control AutoGuardado',
            height:'auto',
            width: 'auto',
            bodyStyle: 'padding-left:25px;',
            defaultType: 'checkbox', // each item will be a checkbox
            items:[ {
                        xtype:'checkbox',
                        id:'checkbox_habilitar_AG',
                        fieldLabel: 'Habilitar Autoguardar',
                        boxLabel: 'Autoguardar',
                        name: 'check_autoguardar',
                        listeners: {
                            change: function(cb, checked)
                            {
                                if(checked == false)
                                {    
                                    Ext.getCmp('tab_autoguardar').findById('save_time').setDisabled(true);
                                    Ext.getCmp('settingsdialog').doLayout();
                                    saveStrategy.deactivate();
                                } 
                                else{
                                    Ext.getCmp('tab_autoguardar').findById('save_time').setDisabled(false);
                                    Ext.getCmp('settingsdialog').doLayout();
                                    
                                }
                            }
                        
                        }
                    },
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'Autoguardar',
                        labelWidth: 110,
                        name: 'Tiempo',
                        width: '90%',
                        allowBlank: false,
                        value: 120,
                        id:'save_time'
                    }],
            
            id:'tab_tiempo'

        };
        
        var tab_tiempo = 
            {
                title: 'Auto Guardado',
                items: [config_save_time],
                id: 'tab_autoguardar'
                
            };
        
        var tabs = new Ext.TabPanel({
              bodyStyle: "padding: 5px 5px 0",
              activeTab: 0,
              frame:true,
              width :300,
              heigth: 300,
              id:'tabs',
              items:[tab_tiempo]
          });
        
        if(!settingsDialog){

            settingsDialog = new Ext.Window({
                title: 'Configuraciones',
                id: 'settingsdialog',
                border: false,
                height: 200,
                width: 400,
                layout: 'fit',
                resizable: false,
                closable:false,
                items: [
                    tabs
                ],
                
                listeners: {
                    show: function() {
                        if(saveStrategy != null){ //si hay savestraty definido
                            
                            Ext.getCmp('tab_autoguardar').findById('checkbox_habilitar_AG').setDisabled(false);
                            if(saveStrategy.auto == false) // si esta en false deshabilito el check
                            {
                                $('#checkbox_habilitar_AG').prop('checked',false);
                                Ext.getCmp('tab_autoguardar').findById('save_time').setDisabled(true);
                                Ext.getCmp('settingsdialog').doLayout();
                            }
                            else //si hay valor distinto de false
                            {
                                $('#checkbox_habilitar_AG').prop('checked',true);
                                Ext.getCmp('tab_autoguardar').findById('save_time').setDisabled(false);
                                $('#save_time').val(saveStrategy.auto);
                                Ext.getCmp('settingsdialog').doLayout();
                            }
                        }
                        else
                        {
                            $('#checkbox_habilitar_AG').prop('checked',false);
                            Ext.getCmp('tab_autoguardar').findById('save_time').setDisabled(true);
                            Ext.getCmp('tab_autoguardar').findById('checkbox_habilitar_AG').setDisabled(true);
                            Ext.getCmp('settingsdialog').doLayout();
                        }
                    }
                }
                
                    ,
                  buttons: [{
                    text: 'Cerrar',
                    handler: function(){
                      settingsDialog.close();
                      settingsDialog
                      settingsDialog = null;
                    }
                  },
                  { 
                    text: 'Guardar',
                    handler: function(){
                        
                        tabs = Ext.getCmp('tabs');
                        switch(tabs.getItem(tabs.activeTab).id)
                        {
                            case 'tab_autoguardar':
                                if($('#checkbox_habilitar_AG').is(':checked'))
                                {   
                                    if(typeof editingLayer != 'undefined' && editingLayer != null )
                                    {
                                        saveStrategy.auto = parseInt($('#save_time').val());
                                        saveStrategy.deactivate();
                                        saveStrategy.activate();
                                    }
                                    else
                                    {
                                        mensajeInformativo('Información','Debe editar una capa primero.');
                                    }

                                }
                                else
                                {
                                    saveStrategy.auto = false;
                                    saveStrategy.deactivate();
                                }
                                break;
                        }
                      }
                  }
                ]
            });
            settingsDialog.show(this);
            settingsDialog.center();
        }
        else {
            settingsDialog.show();
            settingsDialog.center();
            settingsDialog.focus();
            
        }
}


function help(){
    
  
        interfaz = '<p>Descripcion general de ayuda e interfaz</p>';
        edicion = '<p>Sobre las herramientas de edicion</p>';
        configuracion =  '<p>Sobre las configuraciones.</p>';      
                
        var tabs = new Ext.TabPanel({
              bodyStyle: "padding: 5px 5px 0",
              activeTab: 0,
              frame:true,
              width :300,
              heigth: 300,
              id:'tabs',
              items:[{
                    title: 'Interfáz',
                    html: interfaz
                },{
                    title: 'Edición',
                    html: edicion
                },{
                    title: 'Configuraciones',
                    html: edicion,

                }]
          });
        


            if(!winHelp){
                winHelp = new Ext.Window({
                    
                    layout:'fit',
                    width:600,
                    height:500,
                    closeAction:'hide',
                    plain: true,
                    items:[
                            tabs
                        ]
                });
            }
            winHelp.show(this);

}

//persiste el estilo de una capa segun se halla seteado o no en base de datos 
//esto permitira que la proxima vez que se ingrese al sistema la base de datos 
//devuelva y el sistema configure la capa con el estilo definod por el usuario
function setEstilos(nombreCapa)
{
        //TODO  guardar nombre de la regla y recuperarlo
        var mensaje_salvaEstilos = new Array(); 
        
        $.pnotify_remove_all();
        mensajeCargando("Guardando Estilo de capa...", "",mensaje_salvaEstilos);
        //si exito limpiar form resfrescar listado
        var id_capa_estilo = parseInt(array_capas.buscar_por_nombre(nombreCapa).id_capa);
        var estilo_de_usuario = JSON.parse(JSON.stringify(map.getLayersByName(nombreCapa)[0].styleMap.styles.default.rules[0].symbolizer));
        
        if(estilo_de_usuario != 'undefined' ){
             
            estilo_de_usuario.title = map.getLayersByName(nombreCapa)[0].styleMap.styles.default.rules[0].title; 
            
            if(typeof editingLayer.styleMap.styles.default.rules[0].maxScaleDenominator != 'undefined')
                estilo_de_usuario.maxScaleDenominator = editingLayer.styleMap.styles.default.rules[0].maxScaleDenominator;
            
            if(typeof editingLayer.styleMap.styles.default.rules[0].minScaleDenominator != 'undefined')
                estilo_de_usuario.minScaleDenominator = editingLayer.styleMap.styles.default.rules[0].minScaleDenominator;
           
            var estilo_default_feature_json = JSON.stringify(estilo_de_usuario);

            var parametros = {Parametro:'guardaEstilo',id_capa:id_capa_estilo,user_name:userName,estilo:estilo_default_feature_json};

            $.ajax({
                    type: "POST",
                    url: "scripts/utiles.php",
                    //contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(msg) {
                        if(msg.success)
                        {
                            mensajeExito("Estilo guardado","El estilo de la capa se guardo correctamente.");
                            mensaje_salvaEstilos[0].remove();

                        }
                        else
                        {
                            mensajeError("Error", "Error al guardar el estilo");
                            mensaje_salvaEstilos[0].remove();
                        }
                    },
                    error: function() {
                        mensaje_salvaEstilos[0].remove();
                        mensajeError("Error", "Error al guardar el estilo");
                    },
                    data: parametros
                });
        }
}

function getEstilos(id_layer)
{

        var estiloCapa = '';
        var id_capa_estilo = id_layer;
        var parametros = {Parametro:'getEstilo',id_capa:id_capa_estilo,user_name:userName};

        $.ajax({
                type: "POST",
                async: false,
                url: "scripts/utiles.php",
                dataType: "json",
                success: function(msg) {
                    if(msg.length  > 0)
                    {
                        estiloCapa = msg[0].estilo;
                    }
                },
                error: function() { //error de transaccion

                    mensajeError("Error", "Error al recuperar el estilo");
                },
                data: parametros
            });
                
        if(estiloCapa != '')
        {
            var estilo_json = JSON.parse(estiloCapa);
            
            return estilo_json;
        }
        else
        {
            return null;
            
        }
        
}


function movePoint(point, x, y) 
{ 
    point.x = x; 
    point.y = y; 
    point.clearBounds(); 
}

function movePoints(point_actual,feature_before_cambios) 
{ 
    
    var id_vertice_actual = point_actual.geometry.id;
        
    $(feature_before_cambios.geometrias).each(function (idx,pointOfGeom)
    {
        if(pointOfGeom.id == id_vertice_actual)
        {
            var current_vertex = point_actual.geometry;
                //TODO recorrer los puntos y buscar el original con el id que corresponde y restaurar el modificado
            current_vertex.x = pointOfGeom.x; 
            current_vertex.y = pointOfGeom.y; 
            current_vertex.clearBounds(); 
        }
    });
}

function guardaGeometria(geometria)
{
    if(geometria.feature.geometry.components[0].CLASS_NAME === "OpenLayers.Geometry.Point" ) //si es un segmento los componentes son puntos en si mismos
    {
        var datosCopiados = {geometrias: new Array()};

        $(geometria.feature.geometry.components).each(function (idx,punto)
        {
            datosCopiados.geometrias.push({id:punto.id,x:punto.x,y:punto.y});
        });
    }
    else  // si es un poligono el componente es un "OpenLayers.Geometry.LinearRing"
    {
         var datosCopiados = {geometrias: new Array()};

        $(geometria.feature.geometry.components[0].components).each(function (idx,punto)
        {
            datosCopiados.geometrias.push({id:punto.id,x:punto.x,y:punto.y});
        });
    }
    return datosCopiados;
}


function detectarCambiosPendientes()
{
    
    var pendientes = false;
    $(editingLayer.features).each(function(idx,feat)
                                {
                                    if(feat.state !== null)
                                    {
                                        pendientes = true;
                                        return true;
                                    }
                                });
    
    return pendientes;
}