var map,filter,filterStrategy;
var precios;
var base;
var pureCoverage = false;
var highlightCtrl , selectCtrl;
// pink tile avoidance
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
// make OL compute scale according to WMS spec
OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;
        
function init(){
                // if this is just a coverage or a group of them, disable a few items,
                // and default to jpeg format
                format = 'image/jpeg';
            
                var bounds = new OpenLayers.Bounds(
                    -6771200.0892635,-3704509.4717466,
                    -6742727.2962312,-3723580.5103011
                );
				
                var options = {
                    controls: [],
                    maxExtent: bounds,
                    maxResolution: 1.2,
                    projection: "EPSG:22185",
					displayProjection: "EPSG:22185",
                    units: 'm'
                };
								
                map = new OpenLayers.Map('map', options);
            
				base = new OpenLayers.Layer.WMS(
                    "IPEC:manzanasipec - Untiled", "http://10.3.4.155:80/geoserver/IPEC/wms",
                    {
                        LAYERS: 'IPEC:manzanasipec',
                        STYLES: '',
                        format: format
                    },
                    {
						singleTile: true, 
						ratio: 1, 
						reproject: true,
						isBaseLayer: true,
						yx : {'EPSG:22185' : true}
						
                    } 
                );
				
				precios = new OpenLayers.Layer.Vector("Precios", 
				{
					protocol: new OpenLayers.Protocol.WFS({
							version: '1.1.0',
							srsName: 'EPSG:22185',
							url: 'http://10.3.4.155/geoserver/IPEC/wfs',
							featureType: 'precios_georef',
							geometryName: "the_geom",
							renderers: ['Canvas','SVG']
						}),
                    isBaseLayer: false,
					strategies: [new OpenLayers.Strategy.BBOX()],
					styleMap: new OpenLayers.StyleMap({
						"default": new OpenLayers.Style({
							pointRadius:10, 
							fillColor: "green", 
							fillOpacity: 0.5, 
							strokeColor: '#3e7325'
						}),
						"select": new OpenLayers.Style({
							pointRadius:10, 
							fillColor: "green", 
							fillOpacity: 0.5, 
							strokeColor: '#3e7325'
						}),
						"temporary": new OpenLayers.Style({
							pointRadius:10, 
							fillColor: "green", 
							fillOpacity: 0.5, 
							strokeColor: '#3e7325'
						})
					})
				});   
				
				var gsat = new OpenLayers.Layer.Google(
					"Google Satellite",
					{type: google.maps.MapTypeId.SATELLITE,
					sphericalMercator: true , 
					numZoomLevels: 22, 
					isBaseLayer: true,
					zoom: 1
				});
					

				var gmap = new OpenLayers.Layer.Google(
					"Google Streets", // the default
					{numZoomLevels: 20, 
					sphericalMercator: true , 
					visibility: false, 
					isBaseLayer: true,
					zoom: 1
					}
				);               
				
				map.addLayers([base,precios]);
				map.addLayers([gmap,gsat]);
				
				 for (var i=map.layers.length-1; i>=0; --i) {
					map.layers[i].animationEnabled = this.checked;
				}
					
                // build up all controls
                map.addControl(new OpenLayers.Control.PanZoomBar({
                    position: new OpenLayers.Pixel(2, 15)
                }));
				map.addControl(new OpenLayers.Control.LayerSwitcher());
                map.addControl(new OpenLayers.Control.Navigation());
                map.addControl(new OpenLayers.Control.ScaleLine());
				map.addControl(new OpenLayers.Control.MousePosition());
				map.zoomToExtent(bounds);
                precios.setVisibility(false);
				
				
                // wire up the option button
                var options = document.getElementById("options");
                
            // support GetFeatureInfo
            map.events.register('click', map, function (e) {
                    document.getElementById('nodelist').innerHTML = "click";
            });
			
			map.events.register("mousemove", map, function(e) {
                				
				var latlon = map.getLonLatFromViewPortPx(e.xy) ;
				var lat = latlon.lat;
				var lon = latlon.lon;
				document.getElementById("location").innerHTML =lon +"</br>"+ lat ;
                
            });

            }
			
			 var report = function(e) {
                OpenLayers.Console.log(e.type, e.feature.id);
		//		document.getElementById('nodelist').innerHTML = precios.features[e.feature.id].atributes.nombre;
			};
            
            // sets the HTML provided into the nodelist element
            function setHTML(response){
                document.getElementById('nodelist').innerHTML = response.responseText;
            };
			
			function updateFilter(){
                
            precios.setVisibility(true);
			
                //var filterType = document.getElementById('filterType').value;
                var filter = document.getElementById('filter').value;
                
				if(filter == 0)
                  return;
                // by default, reset all filters
                var filterParams = {
                    filter: null,
                    cql_filter: null,
                    featureId: null
                };
                
                filterParams["cql_filter"] = filter;
                    
                // merge the new filter definitions
                mergeNewParams(filterParams);
            }
            
			function mergeNewParams(params){
			
			
			var max_precio = 0;
			var min_precio = 999999; 
			var cuenta_elementos = 0;
			var precio_medio = 0.0;
			var suma_precios = 0.0;
			
			
				for (var i=0;i<precios.features.length;i++)
				{
					if(precios.features[i].attributes.variedad_id == params.cql_filter)
					{	
						if(precios.features[i].attributes.precio != null) //si existe el precio
						{		
							var precio_temp = parseFloat(precios.features[i].attributes.precio)
						
							if(max_precio < precio_temp)
								max_precio = precio_temp;
							if(min_precio > precio_temp)
								min_precio = precio_temp;
								
							cuenta_elementos = cuenta_elementos + 1;	
							suma_precios = suma_precios + precio_temp;
						}
						
					}
					
				}
				
				precio_medio = (suma_precios / cuenta_elementos);
				rango_precio_medio = (precio_medio * 0.2);
								
				for (var i=0;i<precios.features.length;i++)
				{
					if(precios.features[i].attributes.variedad_id != params.cql_filter)
					{	
						precios.features[i].style = { visibility: 'hidden' };
					}
					else
					{
						if(precios.features[i].attributes.precio == null )
						{
							radio_precio = 1;
							precios.features[i].style = { visibility:"hidden"}
						}
						else{
							
							var precio = parseFloat(precios.features[i].attributes.precio);
														
							if(precio > (precio_medio + rango_precio_medio))
							{
								radio_precio = 15;
								var color = "#fb8500";
								var stColor = "#bd6705";
							}
							else
							{
								if(precio < (precio_medio - rango_precio_medio) )
								{
									radio_precio = 5;
									var color = "green";
									var stColor = "#007327";
									
								}
								else
								{
									radio_precio = 10;
									var color = "#e5df18";
									var stColor = "#9e9900";
									
								}
							}
							
							precios.features[i].style = { pointRadius: radio_precio,label: precios.features[i].attributes.precio , fillColor: color, fillOpacity: 0.5, strokeColor: stColor}
						}
						
					}
				}
			
			var selectControl = new OpenLayers.Control.SelectFeature(precios, {
                onSelect: resaltar,
                onUnselect: noResaltar,
				hover: true,
				toggle: false
            });

            map.addControl(selectControl);

            selectControl.activate();
				precios.redraw();

            }
			
			function resaltar(feature)
			{
				var radio_precio = feature.style.pointRadius+1;
				var color = feature.style.fillColor;
				var stColor = feature.style.strokeColor;
				
				feature.style = { pointRadius: radio_precio,label: feature.attributes.precio , fillColor: color, fillOpacity: 0.9, strokeColor: stColor};
				document.getElementById('nodelist').innerHTML = feature.attributes.precio;
				precios.redraw();
			}
			
			function noResaltar(feature)
			{
				
				var radio_precio = feature.style.pointRadius-1;
				var color = feature.style.fillColor;
				var stColor = feature.style.strokeColor;
				
				document.getElementById('nodelist').innerHTML = "";
				feature.style = { pointRadius: radio_precio,label: feature.attributes.precio , fillColor: color, fillOpacity: 0.5, strokeColor: stColor};
				precios.redraw();
			}
			
            function resetFilter() {

				var filter = document.getElementById('filter').selectedIndex= 0;
				precios.refresh();
				precios.setVisibility(false);
				
            }
            
      