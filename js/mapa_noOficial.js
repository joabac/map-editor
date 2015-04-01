/**
 * Copyright (c) 2014
 * IDESF 2014
 */

var mapPanel,tree;
var filter,filterStrategy;
var mostrar_mensajes= false;
var activeLayer = "";
var editingLayer = null;
var saveStrategy = null;
var seleccionSimpleCapaEditada = null;
var seleccionLimites = null;
var hoverLayer, rule;
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
//nombre de capas

var pureCoverage = false;
var highlightCtrl = new Array();
var selectCtrl = new Array();
	
array_capas.forEach(cargarCapas);

var grilla;
var gridMenu;


//variable global para gestion de eliminacion de features
//es global porque la utilizan todos los tipos de capas vector
var DeleteFeature = OpenLayers.Class(OpenLayers.Control, {
    initialize: function(layer, options) {
        OpenLayers.Control.prototype.initialize.apply(this, [options]);
        this.layer = layer;
        this.handler = new OpenLayers.Handler.Feature(
            this, layer, {click: this.clickFeature}
        );
    },
    clickFeature: function(feature) {
        // if feature doesn't have a fid, destroy it
        if(feature.fid == undefined) {
            this.layer.destroyFeatures([feature]);
        } else {
            feature.state = OpenLayers.State.DELETE;
            this.layer.events.triggerEvent("afterfeaturemodified", 
                                           {feature: feature});
            feature.renderIntent = "select";
            this.layer.drawFeature(feature);
        }
    },
    setMap: function(map) {
        this.handler.setMap(map);
        OpenLayers.Control.prototype.setMap.apply(this, arguments);
    },
    CLASS_NAME: "OpenLayers.Control.DeleteFeature"
});


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
                                            tileOptions: {
                                                    eventListeners: {
                                                            'loaderror': function(evt) {
                                                                    mensajeError("Error al cargar capas", "error al cargar la capa" + evt.object.layer.name );
                                                            }
                                                    }
                                            },
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
                     
                     estilo = objetoCapa.estilo_wfs;
                     var objetoEstilo;
                     if(estilo.indexOf('externalGraphic') !== -1)
                     {
                        var array_estilo = estilo.split(";");
                        var image = array_estilo[0].split(":")[1];
                        var radio_txt = array_estilo[1].split(":")[1];
                        var radio_num = new Number(radio_txt);
                        objetoEstilo = new OpenLayers.Style({
				externalGraphic: image,
				pointRadius: radio_num.valueOf()
			});
                     }
                     else
                     { //estilo por defecto
                        objetoEstilo = new OpenLayers.Style({
				pointRadius:2, 
				fillColor: "green", 
				fillOpacity: 0.5, 
				strokeColor: '#3e7325'
			});
                     }
                     
//                     var geometryLayerType = "";
//                     switch (objetoCapa.geometryType)
//                     {
//                         case 'POINT':
//                             geometryLayerType = 'OpenLayers.Geometry.MultiPoint';
//                         break;
//                         case 'LINESTRING':
//                             geometryLayerType = 'MultiLineString';
//                         break;
//                         case 'POLYGON':
//                             geometryLayerType = 'MultiPolygon';
//                         break;
//                         
//                     }
                     capas.push( new OpenLayers.Layer.Vector(objetoCapa.nombre_fantasia,  
                            {
                            protocol: new OpenLayers.Protocol.WFS({
                                            version: objetoCapa.version_wfs,
                                            srsName: datumWfs ,
                                            url: objetoCapa.url,
                                            featureType: objetoCapa.nombre_capa,
                                            featureNS:'http://192.168.0.101/geoserver/idesf',
                                            //TODO: agregar atributo URI en gestion de capas
                                            geometryName: "the_geom",
                                            renderers: ['Canvas','SVG'],
                                            schema: objetoCapa.url + '/DescribeFeatureType?version='+objetoCapa.version_wfs+'&typename='+objetoCapa.nombre_capa
                                            }),
                                    isBaseLayer: false,
                                    visibility: objetoCapa.visibility,
                                    displayInLayerSwitcher: false,
                                    strategies: [new OpenLayers.Strategy.BBOX()],
                                    styleMap: new OpenLayers.StyleMap({
                                            "default": objetoEstilo
                                    })
                            }));
                            
//                    if(objetoCapa.select_control === true)
//                    {
//                        
//                        selectCtrl_index = selectCtrl.push(new OpenLayers.Control.SelectFeature(capas[capas.length -1]));
//                            // create popup on "featureselected"
//                            capas[capas.length -1].events.on({
//                                featureselected: function(e) {
//                                    createPopup(e.feature);
//                                }
//                        });
//                        
//                        map.addControl(selectCtrl[selectCtrl_index -1]);
//	
//                        selectCtrl[selectCtrl_index -1].activate();
//                    }
                 }
}

function loadOpciones(node)
{
    
    
    
    if(node.text.indexOf('Precios Santa Fe') !== -1)
   {
                var nodo = new Array();
                buscar_nodo(tree.root,"Precios Santa Fe",nodo);
                nodo[0].ui.toggleCheck(true);
                document.getElementById('desc_precios').style.visibility = 'visible';
                document.getElementById('info_precios').style.visibility = 'visible'; 
                
   }
   else{
       
       document.getElementById('desc_precios').style.visibility = 'hidden';
       document.getElementById('info_precios').style.visibility = 'hidden'; 
       
   }
//   
//   if(node.text.indexOf('IPCNu') !== -1 )
//   {
//       if(node.text.indexOf('IPCNu Santa Fe') !== -1)
//       {        var nodo = new Array();
//                buscar_nodo(tree.root,"IPCNu Santa Fe",nodo);
//                nodo[0].ui.toggleCheck(true);
//       }
//       else
//       {
//                var nodo = new Array();
//                buscar_nodo(tree.root,"IPCNu Rosario",nodo);
//                nodo[0].ui.toggleCheck(true);
//       }
//                document.getElementById('desc_ipcnu').style.visibility = 'visible';
//                
//                
//   }
//   else{
//       
//       document.getElementById('desc_ipcnu').style.visibility = 'hidden';
//       
//   }
   
   
    
}

//	var gphy = new OpenLayers.Layer.Google(
//                "Google Physical",
//                {type: google.maps.MapTypeId.TERRAIN,isBaseLayer: true}
//            );
//	var gmap = new OpenLayers.Layer.Google(
//                "Google Streets", // the default
//                {numZoomLevels: 20, isBaseLayer: true}
//            );
//        var ghyb = new OpenLayers.Layer.Google(
//                "Google Hybrid",
//                {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20, isBaseLayer: true}
//            );
//	var gsat = new OpenLayers.Layer.Google(
//                "Google Satellite",
//                {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22,isBaseLayer: true}
//            );
	
        //capas base de google
	//map.addLayers([gmap]);
    for (var i=map.layers.length-1; i>=0; --i) {
		map.layers[i].animationEnabled = this.checked;
	}
    
    // build up all controls
    map.addControl(new OpenLayers.Control.PanZoomBar({
        position: new OpenLayers.Pixel(2, 15)
    }));
    
    map.addControl(new OpenLayers.Control.Navigation());
    map.addControl(new OpenLayers.Control.ScaleLine());
    map.addControl(new OpenLayers.Control.MousePosition());
    map.addControl(new OpenLayers.Control.ZoomBox({alwaysZoom:true}));
    // wire up the option button
    options = document.getElementById("options");


    map.events.register("mousemove", map, function(e) {
    				
	try
        {
            var latlon = map.getLonLatFromViewPortPx(e.xy);
            var lat = latlon.lat;
            var lon = latlon.lon;
            document.getElementById("location").innerHTML ="Lon: "+lon + "</br>"+"Lat: " +lat+"</br>Datum:"+map.projection;
        }
        catch(e)
        {
             document.getElementById("location").innerHTML ="Out of Bounds</br>Datum:"+map.projection;
        }
    });
    
//bucle basico de agregado de capas
// aqui se podra incorporar las opciones de alta de elementos en el arbol de capas
function loadCapas(layer)
{
    map.addLayer(layer);
    parsear_niveles_crear_nodos(layer);
}

//definicion de funcion busqueda sobre una array
//busca una capa por su nombre de fantasia
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
//busca una capa por su nombre de fantasia
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

                        var layer_pos =layerLists.push( new GeoExt.tree.LayerContainer({
                                text: niveles[i],
                                layerStore: stores[new_lengt-1],
                                leaf: false,
                                expanded: true,
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
                        
                        cadena_nodos[cadena_nodos.length-1].appendChild(layerLists[layer_pos-1]);
                        return;
                        
                    }
                    else{ //si no es el ultimo nodo agrego implica debo agregar un nievel nuevo
                        //nodo_temp = new Array();
                        //buscar_nodo(tree.root,cadena_nodos[cadena_nodos.length-1].text,nodo_temp);
                        var nuevo_nivel = new Ext.tree.TreeNode(
                                        {
                                            text: niveles[i],
                                            leaf: false
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
            
            var layerNode = new GeoExt.tree.LayerNode({  
                            layer:aLayer.name,
                            layerStore: stores[new_lengt-1],
                            leaf: true,
                            radioGroup: "foo",
                            uiProvider: LayerNodeUI
                            
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

//function onGridToggle(item, pressed)
//{
//    if(pressed == true)
//    { 
//          map.addLayer(grilla);
//   }
//   else
//   {
//      map.removeLayer(grilla); 
//   }
//
//}
//
////actualiza los label de los slides.
//function updateLabel( slider, newValue, thumb )
//{ 
//    
//    if(slider.getId() == 'x-grilla')
//    {     
//      var xLabel = Ext.getCmp('lblXGrilla');
//      xLabel.setText('x: '+newValue+map.units);
//      grilla.dx = newValue;
//    }
//    
//    if(slider.getId() == 'y-grilla')
//    {     
//      var yLabel = Ext.getCmp('lblYGrilla');
//      yLabel.setText('y: '+newValue+map.units);
//      grilla.dy = newValue;
//    }
//    
//    if(slider.getId() == 'ang-grilla')
//    {     
//      var angLabel = Ext.getCmp('lblAngGrilla');
//      angLabel.setText('ang: '+newValue);
//      grilla.rotation = newValue;
//    }
//
//}

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
    
    //panel principal
    mapPanel = new GeoExt.MapPanel({
        border: true,
        region: "center",
        map: map,
        tbar: toolbarItems
    });

    // create our own layer node UI class, using the TreeNodeUIEventMixin
    LayerNodeUI = Ext.extend(GeoExt.tree.LayerNodeUI, new GeoExt.tree.TreeNodeUIEventMixin());
        
    //Configuro las capas 
    var treeConfig = [{
        nodeType: "gx_baselayercontainer",
	text: "Capas Base"		
        } ];

    // The line below is only needed for this example, because we want to allow
    // interactive modifications of the tree configuration using the
    // "Show/Edit Tree Config" button. Don't use this line in your code.
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
	
    // create the tree with the configuration from above
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
        plugins: [
            new GeoExt.plugins.TreeNodeRadioButton({
                listeners: {
                    "radiochange": function(node) {
                        loadOpciones(node); //carga opciones asociadas a los nodos segun la capa, esta programacion es dedicada segun capa y necesidades
                    }
                }
            })
        ],
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
	
	var detailsPanel = {
		contentEl: 'info',
		layout: "fit",
        title: 'Detalles',
        region: 'center',
		height: 150,
        bodyStyle: 'padding-bottom:15px;background:#eee;',
        autoScroll: true,
        html: '<p class="details-info">Información.</p></br>'
    };
	
    var panelOpciones = {
				contentEl: 'desc',
				title: 'Opciones',
				region:'north',
				split: true,
				height: 150,
				minSize: 150,
				rootVisible: false,
				autoScroll: true
    };
	
    var barraTitulo = {
				contentEl: 'header',
				region:'north',
				split: true,
				height: 30,
				minSize: 30,
				xtype: 'box'
    };
    
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
    var accordion = new Ext.Panel({
                region:'west',
                margins:'0 0 0 0',
                split:true,
                width: 200,
                layout:'accordion',
                items: [tree,item2,item3]
    });

    new Ext.Viewport({
        layout: 'fit',
        hideBorders: true,
		title: 'Visualizador de Mapas - IDESF',
		items: [
			{
            layout: "border",
            deferredRender: false,
			title: 'Visualizador de Mapas - IDESF',
			tbar: [{//barra de tope con info de usuario y opciones generales del viewer
					xtype: 'tbtext',
					text: 'Usuario',
                                        id: 'usuario'		
				},'->',{ 
					xtype: 'button',
					text: 'Configurar',
					tooltip: 'Configuraciones',
					iconAlign: 'left',
					iconCls: 'config',
					handler: function(){
					  changeSettings();
					}
				},'-',{
					xtype: 'button',
					text: 'Salir',
					iconAlign: 'left',
					iconCls: 'close',
					tooltip: 'Salir',
					handler: function(){
					  window.location = 'login.php';
					}
				},'-',{
					xtype: 'tbtext',
					text: 'localhost',
                                        id: 'estado'		
				}],
            items: [mapPanel,tree, { //,accordion
                region: "east",
				split:true,
				margins: '1 0 3 3',
				width: 200,
				minSize: 100,
				maxSize: 500,
				items: [panelOpciones,detailsPanel,location]
				}		
			]
        }]
    });
	
	for (var i=mapPanel.map.layers.length-1; i>=0; --i) {
					mapPanel.map.layers[i].animationEnabled = this.checked;
					/*if(mapPanel.map.layers[i].isBaseLayer != true)
						mapPanel.map.layers[i].setVisibility(false);*/
	} 
	
	map.units = 'm';
//	map.zoomToExtent(bounds);
//	
	mostrar_mensajes = true;
	$.pnotify.defaults.styling = "jqueryui";
	$.pnotify.defaults.history = false;
	$.pnotify.defaults.delay = 3000;
        
        //seteo manualmente el tamaño del toolbar para mejor visualizacion
        mapPanel.getTopToolbar().setHeight(45);
        
        Ext.MessageBox.buttonText.yes = "Si";
        Ext.MessageBox.buttonText.no = "No";
        
        grilla = new OpenLayers.Layer.PointGrid({
            name: "Grilla Snap",
            dx: 100, dy: 100,
            units: 'm',
            maxFeatures: 2000,
            styleMap: new OpenLayers.StyleMap({
                pointRadius: 1,
                strokeColor: "#3333ff",
                strokeWidth: 1,
                fillOpacity: 1,
                fillColor: "#3333ff",
                graphicName: "square"
             }),
             displayInLayerSwitcher: false
        });
        
//////////////////////////////  Configuracion del arbol de capas ///////////////////////////
////extras sobre el arbol

capas.forEach(loadCapas); //cargar array de capas


Ext.ComponentMgr.get('usuario').setText(userName);

if (document.location.host === "localhost")
{ 
    Ext.ComponentMgr.get('estado').setText('localhost');
}
else
{
    Ext.ComponentMgr.get('estado').setText("EXTERNO");
}

//inicializa los tooltips de la barra de herramientas del mapPanel
Ext.QuickTips.init();

map.zoomToExtent(bounds);

});

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
    //TODO: agregar menu de finalizar edicion
    if (capaAsociada !== -1){
        if(capaAsociada.CLASS_NAME == "OpenLayers.Layer.Vector")
        {
            if(editingLayer !== null){
                var menuContextual = new Ext.menu.Menu({
                                    items: [
                                    {text: 'Fin Edición',
                                     iconCls: 'contextMenuEdit',
                                     handler: function (item,evt) {
                                         
                                          Ext.Msg.show({
                                                        title : 'Atención',
                                                        msg : 'Desea finalizar la edición?',
                                                        buttons : Ext.Msg.YESNO,
                                                        config : {opt:capaAsociada },
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
                                    { text: 'Estilo' }
                                    ]
                                    });
                menuContextual.showAt(evt.xy);

                return;
            }
            else{
                
                var menuContextual = new Ext.menu.Menu({
                                    items: [
                                    {text: 'Editar',
                                     iconCls: 'contextMenuEdit',
                                     handler: function (item,evt) {
                                          
                                         
                                          Ext.Msg.show({
                                                        title : 'Atención',
                                                        msg : 'Desea editar esta capa?',
                                                        buttons : Ext.Msg.YESNO,
                                                        config : {opt:capaAsociada },
                                                        fn : this.messageResult,
                                                        icon : Ext.MessageBox.QUESTION
                                            });
                                         
                                     },
                                     messageResult : function (btn,text,opt) {
                                            
                                           if (btn == 'yes' ) { 
                                                
                                                editarCapa(opt.config.opt);
                                            }
                                      }
                                    },
                                    { text: 'Estilo' }
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
    
        editingLayer = capaAsociada;
        saveStrategy = new OpenLayers.Strategy.Save();
        saveStrategy.setLayer(editingLayer);
        saveStrategy.events.register('success', null, cambiosConExito);
        saveStrategy.events.register('fail', null, cambiosConErrores);

        
        var nodo = new Array();
    //***********************  add boton en barra menu insercion punto
        var tipoCapa = array_capas[array_capas.buscar(editingLayer.name)].geometryType;
        var nombreCapa = array_capas[array_capas.buscar(editingLayer.name)].nombre_fantasia;
        
        if (tipoCapa == 'POINT')
        {
            //fuerzo el encendido de la capa
            buscar_nodo(tree.root,nombreCapa,nodo);
            nodo[0].ui.toggleCheck(true);
            
            //configuro los elementos de la barra
            mapPanel.getTopToolbar().addItem({id: 'front_spacer_punto', xtype: 'tbseparator'});
            //TODO cambiar tamaño de botones
            //boton agregar feature
            action = new GeoExt.Action({
                id: 'dibuja_punto',
                map: map,
                control: new OpenLayers.Control.DrawFeature(
                        editingLayer, OpenLayers.Handler.Point, 
                        {
                            title: "Dibujar Puntos"
                            //displayClass: "olControlDrawFeaturePoint"
//                            handlerOptions: {multi: true}
                        }
                ),
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
                            title: "Modificar Puntos"
                        }
                ),
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
            
            seleccionSimpleCapaEditada = new OpenLayers.Control.SelectFeature(
                    editingLayer,
                    {
                        clickout: true, toggle: false,
                        multiple: true, hover: false,
                        toggleKey: "ctrlKey", // ctrl key removes from selection
                        multipleKey: "shiftKey", // shift key adds to selection
                        box: true
                    }
                );
           
            mapPanel.map.addControl(seleccionSimpleCapaEditada); 

            seleccionSimpleCapaEditada.activate();
            
            mapPanel.getTopToolbar().doLayout();
           
        }
        
        if (tipoCapa == 'LINESTRING')
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
                            title: "Dibujar Segmentos"
                        }
                ),
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
                            title: "Modificar Segmentos"
                        }
                ),
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
            
            seleccionSimpleCapaEditada = new OpenLayers.Control.SelectFeature(
                    editingLayer,
                    {
                        clickout: true, toggle: false,
                        multiple: true, hover: false,
                        toggleKey: "ctrlKey", // ctrl key removes from selection
                        multipleKey: "shiftKey", // shift key adds to selection
                        box: true
                    }
                );
           
            mapPanel.map.addControl(seleccionSimpleCapaEditada); 

            seleccionSimpleCapaEditada.activate();
            
            mapPanel.getTopToolbar().doLayout();
           
        }
        
        if (tipoCapa == 'POLYGON')
        {
            //fuerzo el encendido de la capa
            buscar_nodo(tree.root,nombreCapa,nodo);
            nodo[0].ui.toggleCheck(true);
            
            //configuro los elementos de la barra
            mapPanel.getTopToolbar().addItem({id: 'front_spacer_poligono', xtype: 'tbseparator'});
            //TODO cambiar tamaño de botones
            //boton agregar feature
            action = new GeoExt.Action({
                id: 'dibuja_poligono',
                map: map,
                control: new OpenLayers.Control.DrawFeature(
                        editingLayer, OpenLayers.Handler.Polygon, 
                        {
                            title: "Dibujar Poligono"
                            //displayClass: "olControlDrawFeaturePoint"
//                            handlerOptions: {multi: true}
                        }
                ),
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
                            title: "Modificar Poligono"
                        }
                ),
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
            
            seleccionSimpleCapaEditada = new OpenLayers.Control.SelectFeature(
                    editingLayer,
                    {
                        clickout: true, toggle: false,
                        multiple: true, hover: false,
                        toggleKey: "ctrlKey", // ctrl key removes from selection
                        multipleKey: "shiftKey", // shift key adds to selection
                        box: true
                    }
                );
           
            mapPanel.map.addControl(seleccionSimpleCapaEditada); 

            seleccionSimpleCapaEditada.activate();
            
            mapPanel.getTopToolbar().doLayout();
           
        }
        
        loadBotonGuardar(tipoCapa);

}

function finEditarCapa(capaAsociada)
{
    
       
    //***********************  add boton en barra menu insercion punto
        var tipoCapa = array_capas[array_capas.buscar(editingLayer.name)].geometryType;
        
        if (tipoCapa == 'POINT')
        {
            
            mapPanel.getTopToolbar().remove('dibuja_punto',true);
            mapPanel.getTopToolbar().remove('modifica_punto',true);
            mapPanel.getTopToolbar().remove('elimina_punto',true);
            mapPanel.getTopToolbar().remove('guardar',true);
            mapPanel.getTopToolbar().remove('front_spacer_punto',true);
            mapPanel.getTopToolbar().doLayout();
            seleccionSimpleCapaEditada.deactivate();
            mapPanel.map.removeControl(seleccionSimpleCapaEditada); 
            editingLayer = null;
            seleccionSimpleCapaEditada = null;
            saveStrategy.destroy();
            saveStrategy = null;
        }
        
        if (tipoCapa == 'LINESTRING')
        {
            
            mapPanel.getTopToolbar().remove('dibuja_segmento',true);
            mapPanel.getTopToolbar().remove('modifica_segmento',true);
            mapPanel.getTopToolbar().remove('elimina_segmento',true);
            mapPanel.getTopToolbar().remove('guardar',true);
            mapPanel.getTopToolbar().remove('front_spacer_segmento',true);
            mapPanel.getTopToolbar().doLayout();
            seleccionSimpleCapaEditada.deactivate();
            mapPanel.map.removeControl(seleccionSimpleCapaEditada); 
            editingLayer = null;
            seleccionSimpleCapaEditada = null;
            saveStrategy.destroy();
            saveStrategy = null;
        }
        
        if (tipoCapa == 'POLYGON')
        {
            
            mapPanel.getTopToolbar().remove('dibuja_poligono',true);
            mapPanel.getTopToolbar().remove('modifica_poligono',true);
            mapPanel.getTopToolbar().remove('elimina_poligono',true);
            mapPanel.getTopToolbar().remove('guardar',true);
            mapPanel.getTopToolbar().remove('front_spacer_poligono',true);
            mapPanel.getTopToolbar().doLayout();
            seleccionSimpleCapaEditada.deactivate();
            mapPanel.map.removeControl(seleccionSimpleCapaEditada); 
            editingLayer = null;
            seleccionSimpleCapaEditada = null;
            saveStrategy.destroy();
            saveStrategy = null;
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
                        
                        if(tipoCapa == 'PUNTO')
                        {
                            if(actions["modifica_punto"].control.feature) { //para guardado parcial
                                actions["modifica_punto"].control.selectControl.unselectAll();
                            }
                        }
                        
                        if(tipoCapa == 'PUNTO')
                        {
                            if(actions["modifica_segmento"].control.feature) { //para guardado parcial
                                actions["modifica_segmento"].control.selectControl.unselectAll();
                            }
                        }
                        if(tipoCapa == 'POLIGONO')
                        {
                            if(actions["modifica_poligono"].control.feature) { //para guardado parcial
                                actions["modifica_poligono"].control.selectControl.unselectAll();
                            }
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
            actions["dibuja_punto"] = action;
            mapPanel.getTopToolbar().addItem(action); 
                        
            mapPanel.getTopToolbar().doLayout();
            
}


function cambiosConExito()
{
    mensajeExito('Exito','Los elementos se guardaron correctamente.');
}

function cambiosConErrores()
{
    mensajeError('Error!','Los elementos agregados no pudieron ser guardados.');
    
}

//function updateFilterPrecios(){
//
//var precios_layer = mapPanel.map.getLayersByName("Precios Santa Fe");
//var precios = precios_layer[0];
//
//precios.setVisibility(true);
//
//
//       //var filterType = document.getElementById('filterType').value;
//	var filter = document.getElementById('filter_precios').value;
//	var anio = document.getElementById('filter_mes').value;
//	var mes = document.getElementById('filter_anio').value;
//       
//	if(filter === 0 | anio === 0 | mes === 0)
//	{
//		if(filter === 0)
//		{
//			mensajeAtencion( 'Atenci??n', 'Por favor seleccione un Producto.');
//		}
//		if(anio === 0)
//		{
//			mensajeAtencion( 'Atenci??n','Por favor seleccione un a??o.');
//		}
//		if(mes === 0)
//		{
//			mensajeAtencion( 'Atenci??n', 'Por favor seleccione un mes.');
//		}
//		return;
//	}
//       // by default, reset all filters
//       var filterParams = {
//           variedad: null,
//           anio: null,
//		   mes: null
//       };
//       
//       filterParams["variedad"] = filter;
//       filterParams["anio"] = anio;
//	   filterParams["mes"] = mes;
//       // merge the new filter definitions
//       mergeNewParamsPrecios(filterParams);
//}
//
//function updateFilteripcnu()
//{
//    
//    var ipcnulayer;
//    if(activeLayer.indexOf("IPCNu Rosario") !== -1 )
//    {
//        ipcnulayer = mapPanel.map.getLayersByName("IPCNu Rosario");
//    }
//    else
//    {
//        if(activeLayer.indexOf("IPCNu Santa Fe") !== -1 )
//        {
//            ipcnulayer = mapPanel.map.getLayersByName("IPCNu Santa Fe");
//        }
//        else{return;}
//    }
//        
//var ipcnu = ipcnulayer[0];
//
//ipcnu.setVisibility(true);
//
//	var filter_ipcnu = document.getElementById('filter_ipcnu').value;
//       
//	if(filter_ipcnu === 0 )
//	{
//		if(filter_ipcnu === 0)
//		{
//			mensajeAtencion( 'Atenci??n', 'Por favor ingrese un area.');
//		}
//		return;
//	}else{
//
//// filtro para WMS
////            var filterParams = {
////                         cql_filter: null
////            };
////
////            filterParams["cql_filter"] = "AREAIPCNU="+filter_ipcnu;
////
////        
////           rule = new OpenLayers.Rule({
////                // We could also set a filter here.  E.g.
////               filter: "AREAIPCNU="+filter_ipcnu,
////                symbolizer: {
////                    fillColor: "#ff0000",
////                    strokeColor: "#ffcccc",
////                    fillOpacity: "0.5"
////                }    
////            });
//            
//            var wfs_url = ipcnu.url.replace('wms','wfs');
//            
//            hoverLayer = new OpenLayers.Layer.Vector("Hover", {
//                strategies: [new OpenLayers.Strategy.Fixed()],
//                protocol: new OpenLayers.Protocol.WFS({
//                    url: wfs_url,
//                    featureType: ipcnu.params.LAYERS[0],
//                    version: "1.1.0",
//                    srsName: ipcnu.params.CRS,
//                    geometryName: "the_geom",
//                    renderers: ['SVG','Canvas']
//                })
//                ,
//                styleMap: new OpenLayers.StyleMap({
//                          "default":new OpenLayers.Style({
//                                fillColor: '#fff800',
//                                fillOpacity: 0.5,
//                                strokeWidth: 1,
//                                strokeColor: "#333333"
//                                })
//                }),
//                filter: new OpenLayers.Filter.Comparison({
//                            type: OpenLayers.Filter.Comparison.EQUAL_TO,
//                            property: "AREAIPCNU",
//                            value: filter_ipcnu
//                        })
//                 ,
//                 eventListeners: {           
//                    'loadend': function (evt) {
//                        zoomOnLoadEnd();
//                    }
//                }   
//            });
//
//            // filtro WMS
//           // ipcnu.mergeNewParams(filterParams);
//            map.addLayer(hoverLayer);
//                
//        }
//}

//function zoomOnLoadEnd()
//{
//    
//    if(hoverLayer.features.length === 0){
//        mensajeInformativo("Atención", "No se encontro ningun area con ese codigo");
//    }
//    else{
//        map.zoomToExtent(hoverLayer.getDataExtent());
//    }
//    
//   // map.removeLayer(hoverLayer);
//}

   
//function mergeNewParamsPrecios(params){
//
//var precios_layer = mapPanel.map.getLayersByName("Precios Santa Fe");
//var precios = precios_layer[0];
//
//var max_precio = 0;
//var min_precio = 999999; 
//var cuenta_elementos = 0;
//var precio_medio = 0.0;
//var suma_precios = 0.0;
//
//
//	for (var i=0;i<precios.features.length;i++)
//	{
//		if(precios.features[i].attributes.variedad_id === params.variedad)
//		{	
//			if(precios.features[i].attributes.precio != null) //si existe el precio
//			{		
//				var precio_temp = parseFloat(precios.features[i].attributes.precio);
//			
//				if(max_precio < precio_temp)
//					max_precio = precio_temp;
//				if(min_precio > precio_temp)
//					min_precio = precio_temp;
//					
//				cuenta_elementos = cuenta_elementos + 1;	
//				suma_precios = suma_precios + precio_temp;
//			}
//			
//		}
//		
//	}
//	
//	precio_medio = (suma_precios / cuenta_elementos);
//	rango_precio_medio = (precio_medio * 0.2);
//        
//        var color = "#ff1700";
//	var stColor = "#9e0f02";
//					
//	for (var j=0;j<precios.features.length;j++)
//	{
//		if(precios.features[j].attributes.variedad_id !== params.variedad)
//		{	
//			precios.features[j].style = { visibility: 'hidden' };
//		}
//		else
//		{
//			if(precios.features[j].attributes.precio == null )
//			{
//				radio_precio = 1;
//				precios.features[j].style = { visibility:"hidden"}
//			}
//			else{
//				
//				var precio = parseFloat(precios.features[j].attributes.precio);
//				
//				
//				
//				if(precio > (precio_medio + rango_precio_medio))
//				{
//							if(precio >= max_precio) // el mayor precio
//							{
//								radio_precio = 16;
//								color = "#ff1700";
//								stColor = "#9e0f02";
//							}
//							else
//							{
//								radio_precio = 15;
//								color = "#fb8500";
//								stColor = "#bd6705";
//							}
//				}
//				else
//				{
//					if(precio < (precio_medio - rango_precio_medio) )
//					{
//
//							if(precio <= min_precio) //el menor precio
//							{
//								radio_precio = 10;
//								color = "#18e539";
//								stColor = "#1a9c2f";
//							}
//							else
//							{
//									radio_precio = 5;
//									color = "green";
//									stColor = "#007327";
//							}
//					}
//					else	//rango medio de precios
//					{
//								radio_precio = 10;
//								color = "#e5df18";
//								stColor = "#9e9900";
//							
//					}
//				}
//				
//				precios.features[j].style = { pointRadius: radio_precio,label: precios.features[j].attributes.precio , fillColor: color, fillOpacity: 0.5, strokeColor: stColor};
//			}
//			
//		}
//	}
//	
//	document.getElementById('media').innerHTML = "Media: " + precio_medio;
//	document.getElementById('cuentaElementos').innerHTML = "Cuenta: " + cuenta_elementos;
//	document.getElementById('valorMaximo').innerHTML = "Mayor Valor: " + max_precio;
//	document.getElementById('valorMinimo').innerHTML = "Menor Valor: " + min_precio;
//	
//	var selectControl = new OpenLayers.Control.SelectFeature(precios, {
//		   onSelect: resaltar,
//		   onUnselect: noResaltar,
//		hover: true,
//		toggle: false
//	});
//
//	mapPanel.map.addControl(selectControl);
//
//	selectControl.activate();
//	precios.redraw();
//
//}

//function resaltar(feature)
//{
//	var precios_layer = mapPanel.map.getLayersByName("Precios Santa Fe");
//	var precios = precios_layer[0];
//	
//	var radio_precio = feature.style.pointRadius+1;
//	var color = feature.style.fillColor;
//	var stColor = feature.style.strokeColor;
//	
//	feature.style = { pointRadius: radio_precio,label: feature.attributes.precio , fillColor: color, fillOpacity: 0.9, strokeColor: stColor};
//	document.getElementById('valorNodo').innerHTML = "Valor Nodo: " + feature.attributes.precio;
//	precios.redraw();
//}
//
//function noResaltar(feature)
//{
//	var precios_layer = mapPanel.map.getLayersByName("Precios Santa Fe");
//	var precios = precios_layer[0];
//
//	var radio_precio = feature.style.pointRadius-1;
//	var color = feature.style.fillColor;
//	var stColor = feature.style.strokeColor;
//	
//	document.getElementById('valorNodo').innerHTML = "";
//	feature.style = { pointRadius: radio_precio,label: feature.attributes.precio , fillColor: color, fillOpacity: 0.5, strokeColor: stColor};
//	precios.redraw();
//}
//
//function resetFilterPrecios() {
//
//	var precios_layer = mapPanel.map.getLayersByName("Precios Santa Fe");
//	var precios = precios_layer[0];
//
//	document.getElementById('media').innerHTML = "";
//	document.getElementById('cuentaElementos').innerHTML = "";
//	
//	var filter = document.getElementById('filter_precios').selectedIndex= 0;
//	filter = document.getElementById('filter_anio').selectedIndex= 0;
//	filter = document.getElementById('filter_mes').selectedIndex= 0;
//	precios.refresh();
//	precios.setVisibility(false);
//	
//}
//
//function resetFilterIpcNu()
//{
//    var clear_layer_filter = map.getLayersByName('Hover');
//    
//    while(clear_layer_filter[0])
//    {
//        map.removeLayer(clear_layer_filter[0]);
//        clear_layer_filter = map.getLayersByName('Hover');
//        
//    }
//    
//    var ipcnulayer;
//    if(activeLayer.indexOf("IPCNu Rosario") !== -1 )
//    {
//        ipcnulayer = mapPanel.map.getLayersByName("IPCNu Rosario");
//    }
//    else
//    {
//        if(activeLayer.indexOf("IPCNu Santa Fe") !== -1 )
//        {
//            ipcnulayer = mapPanel.map.getLayersByName("IPCNu Santa Fe");
//        }
//        else{return;}
//    }
//        
//var ipcnu = ipcnulayer[0];
//
//	if(filter_ipcnu === 0 )
//	{
//		if(filter_ipcnu === 0)
//		{
//			mensajeAtencion( 'Atenci??n', 'Por favor ingrese un area.');
//		}
//
//		return;
//	}else{
//            var filterParams = {
//                         cql_filter: null
//            };
//
//            document.getElementById('filter_ipcnu').value = "";
//            
//            filterParams["cql_filter"] = null;
//           
//            ipcnu.mergeNewParams(filterParams);
//            
//        }
//    
//}

function changeSettings(){
    
       var scrollerMenu = new Ext.ux.TabScrollerMenu({
		maxText  : 15,
		pageSize : 10
	});
        
        
        var settingsDialog = new Ext.Window({
          title: 'Configuraciones',
          id: 'settingsdialog',
          border: false,
          height: 600,
          width: 700,
          layout: 'fit',
          resizable: false,
          items: [{
			xtype           : 'tabpanel',
			activeTab       : 0,  
			id              : 'myTPanel',
			enableTabScroll : true,
			resizeTabs      : true,
			minTabWidth     : 100,
			border          : false,
			plugins         : [ scrollerMenu ],
			items           : tab_items
		}],
            buttons: [{
              text: 'Close',
              handler: function(){
                settingsDialog.close();
              }
            }]
        });
        settingsDialog.show();
}


