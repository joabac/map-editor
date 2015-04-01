var closeItem;
var capaNueva = false;
var tipoCapa = "WMS";

Ext.onReady(function() {

	Ext.QuickTips.init();
    
    // create some portlet tools using built in Ext tool ids
    var tools = [{
        id:'gear',
        handler: function(){
            Ext.Msg.alert('Message', 'The Settings tool was clicked.');
        }
    },{
        id:'close',
        handler: function(e, target, panel){
            panel.ownerCt.remove(panel, true);
        }
    }];

//*******************   menu principal **********************************

    var viewport = new Ext.Viewport({
        layout:'fit',
        items:[{
                xtype: 'grouptabpanel',
    		tabWidth: 130,
    		activeGroup: 0,
    		items: [{
                       mainItem: 0,
                       items: [ 
                       {
                            title: 'Administraci�n',
                            tabTip: 'Configuracion de usuarios',
                            style: 'padding: 10px;'
    			},{
                                title: 'Gestion de Capas',
                                tabTip: 'ABM de capas',
                                iconCls: 'x-icon-layers',
                                style: 'padding: 10px;',
				layout: 'fit',
    				contentEl:'abmCapas',
                                listeners: {activate: activaAbmCapas,
                                deactivate: desactivaAbmCapas}
    			},{
                                title: 'Capas a Usuarios',
                                tabTip: 'Asignar capas a usuarios',
                                iconCls: 'x-icon-users',
                                style: 'padding: 10px;',
				layout: 'fit',
    				contentEl:'dualList',
                                listeners: {activate: activaUsuarioCapas,
                                deactivate: desactivaUsuarioCapas}
    			}]
                        },{
                        mainItem: 0,
                            items: [ 
                            {
                                 title: 'Administraci�n',
                                 tabTip: 'Utiles',
                                 style: 'padding: 10px;'
                             },
                             {
                                title: 'Abrir',
                                tabTip: 'Lanza el visualizador',
                                style: 'padding: 10px;',
                                iconCls: 'x-icon-launch',
				layout: 'fit',
                                listeners: {activate: lanzarViewer}
                                    
                             }]
                        },
                        {
                        expanded: true,
                        closeTab: true,
                        iconCls: 'close',
                        items: [{
                                    title: 'Salir',
                                    tabTip: 'Cerrar sesion',
                                    style: 'padding: 10px;',
                                    listeners: {activate: salir}
                                }] 
                        }]
                }]
});


closeItem = document.getElementsByClassName('close');
closeItem[0].parentNode.childNodes[0].className = '';
    
function activaUsuarioCapas()
{
        $( "#dualList a,#dualList button ,#dualList select" )
        .button()
        .click(function( event ) {
            event.preventDefault();
        });
    
        document.getElementById('dualList').style.visibility = 'visible';
        var mensaje_cargando = new Array();
        
        var parametros = {Parametro:'getUsers'};
        $.pnotify_remove_all();
        mensajeCargando("Cargando Usuarios..", "",mensaje_cargando);
        
        $.ajax({
            type: "POST",
            url: "../scripts/utiles.php",
            //contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(msg) {
                $("#usuarios").get(0).options.length = 0;
                $("#usuarios").get(0).options[0] = new Option("Seleccione usuario", "-1");   

                $.each(msg, function(index, item) {
                    $("#usuarios").append('<option value='+item.id_usuario+'>'+item.email+'</option>');
                });
                
                mensaje_cargando[0].remove();
            },
            error: function() {
                mensaje_cargando[0].remove();
                mensajeError("Error", "Error al cargar usuarios");
            },
            data: parametros
        });
        
        
        //$( "#btn_salvar" ).button('disable');
        $( "#add" ).button('disable');
        $( "#remove" ).button('disable');
        
        
    }
    
    function desactivaUsuarioCapas()
    {
        //oculto el panel de capas
        document.getElementById('dualList').style.visibility = 'hiden';
        //limpio elementos de las listas
        $("#left-lista li").remove();
        $("#right-lista li").remove();
        $( "#btn_salvar" ).button('disable');
    }
    
    function activaAbmCapas()
    {
        //inicializo eventos de botones y elementos con comportamiento
        $( "#abmCapas select" )
        .button()
        .click(function( event ) {
            event.preventDefault();
        });
        
        $( "#abmCapas #add_capa" )
        .button({
                icons: {
                primary: "ui-icon-plusthick"
                }
         })
        .click(function( event ) {
            event.preventDefault();
        });
        
         $( "#abmCapas #del_capa" )
        .button({
                icons: {
                primary: "ui-icon-minusthick"
                }
         })
        .click(function( event ) {
            event.preventDefault();
        });
        
        $( "#abmCapas #editar_capa" )
        .button({
                icons: {
                primary: "ui-icon-pencil"
                }
         })
        .click(function( event ) {
            event.preventDefault();
        });
        
        $( "#editar_capa" ).button('disable');
        
        $( "#abmCapas #guarda_capa" )
        .button({
                icons: {
                primary: "ui-icon-disk"
                }
         })
        .click(function( event ) {
            event.preventDefault();
        });
        
        $( "#guarda_capa" ).button('disable');
        $( "#abmCapas #del_capa" ).button('disable');
        
    // checkbox wfs_layer_check eventos
        $( "#abmCapas #wfs_layer_check" ).change(function() {
            var estado_check = $(this).is(':checked');
            if ( estado_check === true)
            {
                tipoCapa = "";
                $('#estilo_wms').attr("disabled","disabled");
                $('#version_wms').attr("disabled","disabled");
                 
                $('#estilo_wfs').removeAttr("disabled");
                $('#version_wfs').removeAttr("disabled");
                //$('#tipo_wfs').selectmenu("enable");
            }
            else
            {
                tipoCapa = "WMS";
                $('#estilo_wms').removeAttr("disabled");
                $('#version_wms').removeAttr("disabled");
                
                $('#estilo_wfs').attr("disabled","disabled");
                $('#version_wfs').attr("disabled","disabled");
//                    // Destroy the combobox
//                    $("#tipo_wfs").selectmenu("destroy");
//
//                    // Unselect the currently selected option
//                    $("#tipo_wfs option:selected").removeAttr("selected");
//
//                    // Select the option you want to select
//                    $("#tipo_wfs option[value='WMS']").attr("selected", "selected");
//
//                    // Create the combobox again
//                    $("#tipo_wfs").selectmenu();
//                    
//                    $('#tipo_wfs').selectmenu("disable");

            }
        });
        
        //oculto el panel de capas
        document.getElementById('abmCapas').style.visibility = 'visible';

        var mensaje_cargando = new Array();
        
        var parametros = {Parametro:'getCapasAll'};
        $.pnotify_remove_all();
        mensajeCargando("Cargando Capas..", "",mensaje_cargando);
        
        limpiarDatosInfoCapa();
        
        $.ajax({
            type: "POST",
            url: "../scripts/utiles.php",
            //contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(msg) {
             
             if(msg.length  > 0){
                $.each(msg, function(index, item) {
                       
                        var id = item.id_capa;
                        
                       $("#lista_capas").append('<li id='+id+'>'+item.nombre_capa+'</li>');
                       
                       $('#lista_capas li#'+id).on('click',function() {
                                setSelected(id);
                                loadInfoCapa(id);
                                
                        }); 
                       
                   });
                $( "#abmCapas #del_capa" ).button('enable');
                mensaje_cargando[0].remove();
            }
            else
            {
                $( "#abmCapas #del_capa" ).button('disable');
                mensaje_cargando[0].remove();
                mensajeInformativo("Aletnci�n", "No se encontraron capas pre cargadas");
            }
            
            },
            error: function() {
                mensaje_cargando[0].remove();
                mensajeError("Error", "Error al recuperar capas");
            },
            data: parametros
        });
        
        
        $('#estilo_wfs').attr("disabled","disabled");
        $('#version_wfs').attr("disabled","disabled");
    }
    
    function desactivaAbmCapas()
    {
        //oculto el panel de capas
        limpiarDatosInfoCapa();
        document.getElementById('abmCapas').style.visibility = 'hiden';
        $("#lista_capas li").remove();

    }
    
    function salir()
    {
        window.location = 'login.php'
    }
    
    function lanzarViewer()
    {
      window.open(document.baseURI.replace("/admin/admin.php",""));
    }
});

function setSelected(id)
{
   
  if(!$('#lista_capas').hasClass('prevented')){
    $('#lista_capas li').removeClass('selected');
    $('#lista_capas li#'+id).addClass('selected');  
    
    if($('#lista_capas .enEdicion'))
    {
        toggleEnEdicion($('#lista_capas .enEdicion'), false);
        $( "#editar_capa" ).button('disable');
        toggleStatus($( "#tabla_datos td input" ),false);//des habilito edicion
        $('#numZoomLevels').spinner('enable');
        
        
         $( "#abmCapas #editar_capa" ).button({
                icons: {
                    primary: "ui-icon-pencil"
                },
                label:"Editar"
         });
    }
 }
    
}

function loadInfoCapa(id)
{
 
 if(!$('#lista_capas').hasClass('prevented')){
        
    
    limpiarDatosInfoCapa();
    var mensaje_cargando = new Array();
        
        var parametros = {Parametro:'getInfoCapa',id_capa:id};
        $.pnotify_remove_all();
        mensajeCargando("Cargando... ", "Recuprando datos de capa",mensaje_cargando);
        
        $('#numZoomLevels').spinner('disable');
        
        $.ajax({
            type: "POST",
            url: "../scripts/utiles.php",
            //contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(msg) {

                //caragar daots de la capa en tabla de daots
                    $('#id_capa').val(msg[0].id_capa)
                    $('#nombre_capa').val(msg[0].nombre_capa); 
                    $('#url').val(msg[0].url);
                    $('#version_wms').val(msg[0].version_wms);
                    $('#nombre_fantasia').val(msg[0].nombre_fantasia);
                    $('#estilo_wfs').val(msg[0].estilo_wfs);
                    
                    $('#numZoomLevels').spinner('disable');
                    $('#numZoomLevels').spinner( "value", msg[0].numZoomLevels );
                                        
                    $('#nivel_de_arbol').val(msg[0].nivel_de_arbol);
                    $('#estilo_wms').val(msg[0].estilo_wms );
                    $('#version_wfs').val(msg[0].version_wfs );
                    //$('#tipo_wfs').val(msg[0].type_wfs ); //el tipo de geometria
                    if(msg[0].visibility == 'true')
                    {
                        $('#visible')[0].checked = true;
                    }
                    else
                    {
                        $('#visible').attr('checked', false);
                    }
                    //
                    if(msg[0].singleTile == 'true')
                    {
                        $('#singleTile')[0].checked = true;
                    }
                    else
                    {
                        $('#singleTile').attr('checked', false);
                    }
                    //
                    if(msg[0].isBaseLayer == 'true')
                    {
                        $('#base_layer')[0].checked = true;
                    }
                    else
                    {
                        $('#base_layer').attr('checked', false);
                    }
                    //
                   if(msg[0].transparent == 'true')
                    {
                        $('#transparent')[0].checked = true;
                    }
                    else
                    {
                        $('#transparent').attr('checked', false);
                    }
                    //
                    if(msg[0].select_control == 'true')
                    {
                        $('#select_control')[0].checked = true;
                    }
                    else
                    {
                        $('#select_control').attr('checked', false);
                    }
                    
                    //TODO
                    if($('#version_wfs').val() != ""){
                        $('#wfs_layer_check').prop('checked', true);
                    }
                    
                    $( "#editar_capa" ).button('enable');
                    mensaje_cargando[0].remove();
                
                
            },
            error: function() {
                mensaje_cargando[0].remove();
                mensajeError("Error", "Error al recuperar capas");
            },
            data: parametros
        });
    }
}

function limpiarDatosInfoCapa()
{
    $('#id_capa').val("")
    $('#nombre_capa').val(""); 
    $('#url').val("");
    $('#version_wms').val("");
    $('#nombre_fantasia').val("");
    $('#estilo_wfs').val("");

    $('#numZoomLevels').spinner('disable');
    $('#numZoomLevels').spinner( "value", 1 );

    $('#nivel_de_arbol').val("");
    $('#estilo_wms').val("");
    $('#version_wfs').val("");
    $('#visible').attr('checked', false);
    $('#singleTile').attr('checked', false);
    $('#base_layer').attr('checked', false);
    $('#transparent').attr('checked', false);
    $('#select_control').attr('checked', false);
    
    $('#tipo_wfs').selectmenu('disable');
    
}

function restauraEventos()
{
    $.each($('#left-lista li'),function(index, item) {
                       
                        var id = item.id;
                       $('#left-lista li#'+id).off();
                       $('#left-lista li#'+id).on('dblclick',function() {         
                                $('#multiselect .right ul').append('<li id="'+id+'"><input type="checkbox" name="capas" value="'+id+'">'+$(this).text()+'</li>');
                                $('#multiselect .left ul li#'+id).remove();
                                restauraEventos();
                        }); 
   });
                   
     
    $.each($('#right-lista li'),function(index, item) {
                       
                       var id = item.id;
                       $('#right-lista li#'+id).off();
                       $('#right-lista li#'+id).on('dblclick',function() {
                                $('#multiselect .left ul').append('<li id="'+id+'">'+$(this).text()+'</li>');
                                $('#multiselect .right ul li#'+id).remove();
                                restauraEventos();
                        });  
     });
    
}

//ABM de capas al sistema
function guardarCapas()
{
    $.validator.setDefaults({
//	submitHandler: function() { alert("submitted!"); },
	showErrors: function(map, list) {
		// there's probably a way to simplify this
		var focussed = document.activeElement;
		if (focussed && $(focussed).is("input, textarea")) {
			$(this.currentForm).tooltip("close", { currentTarget: focussed }, true)
		}
		this.currentElements.removeAttr("title").removeClass("ui-state-highlight");
		$.each(list, function(index, error) {
			$(error.element).attr("title", error.message).addClass("ui-state-highlight");
		});
		if (focussed && $(focussed).is("input, textarea")) {
			$(this.currentForm).tooltip("open", { target: focussed });
		}
	}
    });  
    
    $( "#datos_edicion" ).tooltip({
		show: false,
		hide: false
	});
    
    var form = $( "#datos_edicion" );
    
    form.validate({
         debug: true,
        rules: {
            nombre_capa: { 
                required: true,
                maxlength: 15,
                minlength: 4
            },
            url: { 
                required: true,
                url: true
            },
            numZoomLevels:
            {
                min: 1,
                max: 25
            },
            nombre_fantasia: {
                required: true,
                maxlength: 30,
                minlength: 4
            },
            nivel_de_arbol:
            {
                required: true,
                maxlength: 200,
                minlength: 4
            },
            estilo_wms:{              
                maxlength: 200,
                minlength: 4
            },
            version_wms:{
                required: {       
                      depends: function(element) {
                        return $("#wfs_layer_check:unchecked");
                      }
                },
                maxlength: 8,
                minlength: 5
            },
            version_wfs:{
                required: {       
                      depends: function(element) {
                        return $("#wfs_layer_check:checked");
                      }
                    },
                //required: true,
                maxlength: 8,
                minlength: 5
            },
            estilo_wfs:{
                maxlength: 200,
                minlength: 4
            }
            
        },
        messages: {
            nombre_capa: {
                required:"Por favor ingrese un nombre de capa",
                maxlength:"Nombre superior a 15 caracteres",
                minlength:"Longitud minima 4 caracteres"
            },
            url: "Por favor ingrese una URL valida",
            numZoomLevels:
            {
                min: "Valor minimo :1",
                max: "Maximo nivel de zoom 25"
            },
            nombre_fantasia: {
                required:"Por favor ingrese un nombre de capa",
                maxlength:"Nombre superior a 30 caracteres",
                minlength:"Longitud minima 4 caracteres"
            },
            nivel_de_arbol:
            {
                required: "Por favor ingrese un nivel para el arbol, al menos root",
                maxlength:"Nombre superior a 200 caracteres",
                minlength:"Longitud minima 4 caracteres"
            },
            estilo_wms:{              
                maxlength:"Nombre superior a 200 caracteres",
                minlength:"Longitud minima 4 caracteres"
            },
            version_wms:{
                required: "Por favor ingrese la version del protocolo WMS",
                maxlength:"Numero de caracteres superior a 8",
                minlength:"Longitud minima 5 caracteres"
            },
            version_wfs:{
                required: "Por favor ingrese la version del protocolo WFS",
                maxlength:"Numero de caracteres superior a 8",
                minlength:"Longitud minima 5 caracteres"
            },
            estilo_wfs:{
                maxlength:"Nombre superior a 200 caracteres",
                minlength:"Longitud minima 4 caracteres"
            }
        }
      }); 
      
      if(form.valid())
      {
         if($("#wfs_layer_check").is(':checked')  === true){
            var tipo_geometria = getTipoGeometria($('#nombre_capa').val());

            var tipo_geometria_upper = tipo_geometria.toUpperCase();

            if(tipo_geometria_upper != "POLYGON" && tipo_geometria_upper != "LINESTRING" && tipo_geometria_upper === "POINT")
            {
                $.pnotify_remove_all();
                mensajeAtencion("Atenc�on!", "La capa no se reconoce como una capa WFS valida");
                return;
            }
        }
        else
        {
            tipo_geometria_upper = "WMS";
            
        }
         
         if(capaNueva === false) //solo una edicion
         {  
            //transaccion ajax para guardar datos editados
            var info_capa = {

                    id_capa:$('#id_capa').val(),
                    nombre_capa:$('#nombre_capa').val(), 
                    url:$('#url').val(),
                    version_wms:$('#version_wms').val(),
                    nombre_fantasia:$('#nombre_fantasia').val(),
                    estilo_wfs:$('#estilo_wfs').val(),
                    zoom_level:$('#numZoomLevels').spinner("value"),
                    nivel_arbol:$('#nivel_de_arbol').val(),
                    estilo_wms:$('#estilo_wms').val(),
                    version_wfs:$('#version_wfs').val(),
                    visibilidad:$('#visible').is(':checked'),
                    mosaico:$('#singleTile').is(':checked'),
                    capa_base:$('#base_layer').is(':checked'),
                    transparente:$('#transparent').is(':checked'),
                    seleccionable:$('#select_control').is(':checked'),
                    type:tipo_geometria_upper
            };

            var mensaje_guardando = new Array(); 

            $.pnotify_remove_all();
            mensajeCargando("Actualizando capa..", "",mensaje_guardando);

            var parametros = {Parametro:'guardaCapaEdicion',info_capa:JSON.stringify(info_capa)};

            $.ajax({
                type: "POST",
                url: "../scripts/utiles.php",
                //contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(msg) {
                    if(msg.success)
                    {
                        mensajeExito("Exito","La capa se actualizo correctamente.");
                        mensaje_guardando[0].remove();
                        toggleStatus($('#guarda_capa'),true);
                        toggleStatus($( "#tabla_datos td input" ),false);//deshabilito edicion
                        $('#numZoomLevels').spinner('disable');
                        toggleEnEdicion($('li#'+$('#id_capa').val()), false);
                        $( "#abmCapas #editar_capa" ).button({
                               icons: {
                                   primary: "ui-icon-pencil"
                               },
                               label:"Editar"
                        });
                        $('#lista_capas').removeClass('prevented'); 
                        $('#add_capa').button('enable');
                        $('#del_capa').button('enable');
                        capaNueva = false;
                    }
                    else
                    {
                        mensajeError("Error", msg.mensaje);
                        mensaje_guardando[0].remove();
                    }
                },
                error: function() {
                    mensaje_guardando[0].remove();
                    mensajeError("Error", "Error al actualizar la capa");
                },
                data: parametros
            });      
            
        }
        else 
        {
            //transaccion ajax  para persistir nueva capa 
            var info_capa = {

                    id_capa:$('#id_capa').val(),
                    nombre_capa:$('#nombre_capa').val(), 
                    url:$('#url').val(),
                    version_wms:$('#version_wms').val(),
                    nombre_fantasia:$('#nombre_fantasia').val(),
                    estilo_wfs:$('#estilo_wfs').val(),
                    zoom_level:$('#numZoomLevels').spinner("value"),
                    nivel_arbol:$('#nivel_de_arbol').val(),
                    estilo_wms:$('#estilo_wms').val(),
                    version_wfs:$('#version_wfs').val(),
                    visibilidad:$('#visible').is(':checked'),
                    mosaico:$('#singleTile').is(':checked'),
                    capa_base:$('#base_layer').is(':checked'),
                    transparente:$('#transparent').is(':checked'),
                    seleccionable:$('#select_control').is(':checked'),
                    type_wfs:tipo_geometria_upper
            };

            var mensaje_guardando = new Array(); 

            $.pnotify_remove_all();
            mensajeCargando("Guardando capa nueva..", "",mensaje_guardando);

            var parametros = {Parametro:'guardaCapaNueva',info_capa:JSON.stringify(info_capa)};

            $.ajax({
                type: "POST",
                url: "../scripts/utiles.php",
                //contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(msg) {
                    if(msg.success)
                    {
                        mensajeExito("Exito","La nueva capa se guardo correctamente.");
                        mensaje_guardando[0].remove();
                        toggleStatus($('#guarda_capa'),true);
                        toggleStatus($( "#tabla_datos td input" ),false);//deshabilito edicion
                        $('#numZoomLevels').spinner('disable');
                        $('#tipo_wfs').selectmenu({ disabled: true });
                        toggleEnEdicion($('li#'+$('#id_capa').val()), false);
                        $( "#abmCapas #editar_capa" ).button({
                               icons: {
                                   primary: "ui-icon-pencil"
                               },
                               label:"Editar"
                        });
                        $('#lista_capas').removeClass('prevented'); 
                        $('#add_capa').button('enable');
                        $('#del_capa').button('enable');
                        capaNueva = false;
                    }
                    else
                    {
                        mensajeError("Error", msg.mensaje);
                        mensaje_guardando[0].remove();
                    }
                },
                error: function() {
                    mensaje_guardando[0].remove();
                    mensajeError("Error", "Error al guardar la nueva capa");
                },
                data: parametros
            });
        
            
            
        }
         
      }
      else{
           mensajeAtencion("Atenc�on!", "Por favor corrija los campos e intente nuevamente");
      }

    
}


function getTipoGeometria(nombre_capa)
{

    var resultado = "";
    
    $.ajax({
        type: "GET",
        url: "/geoserver/wfs",
        async: false,
        data: "service=wfs&version=2.0.0&request=GetPropertyValue&typeNames=IDESF:"+nombre_capa+"&valueReference=the_geom&count=2",
        success:function(msg) {
            
                    var result = msg.getElementsByTagName("ExceptionReport");
                    
                    if(result.length === 0)
                    {
                        var tipo_geometria  = msg.getElementsByTagName("the_geom")[0].childNodes[0].tagName;
        
                        var la_geometria = tipo_geometria.split(":")[1];
        
                        resultado = la_geometria;
                    
                    }
                    else
                    {   
                        resultado = "";
                    }
                },
        error: function() {
                resultado = "";
        },
        dataType: "xml"
    });
      
    return resultado;
}


function delCapa(btn,text)
{
    if(btn == 'no'){
        
        return;
    }
    
    if(btn == 'yes')
    {

        var mensaje_eliminando = new Array(); 
        
        $.pnotify_remove_all();
        mensajeCargando("Eliminando capa...", "",mensaje_eliminando);
        //si exito limpiar form resfrescar listado
        var id_capa = $('#id_capa').val();
        
        var parametros = {Parametro:'borrarCapa',id_capa:id_capa};
        
        $.ajax({
            type: "POST",
            url: "../scripts/utiles.php",
            //contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(msg) {
                if(msg.success)
                {
                    mensajeExito("Capa eliminada","La capa se elimino correctamente.");
                    mensaje_eliminando[0].remove();
                    $('li#'+id_capa).remove();
                    limpiarDatosInfoCapa();
                    
                }
                else
                {
                    mensajeError("Error", msg.mensaje);
                    mensaje_eliminando[0].remove();
                }
            },
            error: function() {
                mensaje_eliminando[0].remove();
                mensajeError("Error", "Error al guardar los cambios");
            },
            data: parametros
        });
        
        
        
    }
    
}
function agregaNuevaCapa(btn, text)
{
    
    if(btn == 'cancel'){
        
        return;
    }
    
    if(btn == 'ok'){
        

            if(text.length == 0 || text.length > 15)
            {
                    mensajeError("Error", "Numero de caracteres no valido");
                    return;
            }

            patt=/\W/g;
            caracteresEspeciales =patt.test(text);

            patt=/\s/g;
            espacios =patt.test(text);


            if(caracteresEspeciales)
            {
                    caracteresEspeciales =patt.exec(text);
                    if(caracteresEspeciales[0] == '-')
                    {
                        mensajeError("Error", "el caracter \"-\" no esta permitido");
                        return;
                    }
                    else{
                        mensajeError("Error", "Ingrese solo letras y numeros sin espacios ni guiones");
                        return;
                    }
            }

             if(espacios)
            {
                    mensajeError("Error", "Ingrese solo letras y numeros sin espacios ni guiones");
                    return;
            }

            var id = 99999;//id falso temporal para alta luego debera ser refrescado con el resultante proveniente del server

               limpiarDatosInfoCapa();
               $("#lista_capas").append('<li id='+id+'>'+text+'</li>');
                       
                       $('#lista_capas li#'+id).on('click',function() {
                                setSelected(id);
                                loadInfoCapa(id);
                                
               }); 
               
               
               capaNueva = true;
               $('#nombre_fantasia').val(text);
               $('#id_capa').val(id); //recordar este ide es temporal
               
               $('#guarda_capa').button('enable'); //habilito el guardar
               $('#editar_capa').button('enable'); //habilito el edicion en modo cancel
               toggleStatus($("#tabla_datos td input" ),true);//habilito edicion de campos
               $('#numZoomLevels').spinner('enable');
               $('#estilo_wfs').attr("disabled","disabled");
               $('#version_wfs').attr("disabled","disabled");
               toggleEnEdicion($('li#'+$('#id_capa').val()), true); //marco la nueva capa como en edicion
               $('#lista_capas').animate({
                    scrollTop: $('#lista_capas li#'+id).position().top }, 'slow');
                
                $( "#abmCapas #editar_capa" ).button({ //utilizo el boton de edicion con otro comportameinto
                       icons: {
                           primary: "ui-icon-pencil"
                       },
                       label:"Descartar"
                });
                $('#lista_capas').addClass('prevented');
                $('#add_capa').button('disable');
                $('#del_capa').button('disable');    
               
    }
    
}

//guarda los cambios realizados en la asignacion de capas a usuarios
function guardarCambiosCapas()
{
    
    var id_usuario = $("select#usuarios option:selected").val();
    
    if(id_usuario == -1)
    {
        $.pnotify_remove_all();
        mensajeInformativo("Atencion","Por favor seleccione un usuario");
    }
    else{
        
        var mensaje_guardando = new Array();
        
        $.pnotify_remove_all();
        mensajeCargando("Guardando cambios..", "",mensaje_guardando);
        
        var capas_wms = new Array();
        var capas_wfs = new Array();
        
        
        $.each($('#right-lista li'),function(){
                    var id_capa = $(this).attr('id');
                    //alert("user: "+id_usuario+"id_capa: "+id_capa+" capa: "+$(this).text()+" wfs: "+ $('#right-lista li#'+id_capa+' :checkbox').is(':checked'));
                    if($('#right-lista li#'+id_capa+' :checkbox').is(':checked'))
                        capas_wfs.push(id_capa);
                    else
                        capas_wms.push(id_capa);
        });
        
        var parametros = {Parametro:'guardaCapas',id_user:id_usuario,wms:JSON.stringify(capas_wms),wfs:JSON.stringify(capas_wfs)};
        
        $.ajax({
            type: "POST",
            url: "../scripts/utiles.php",
            //contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(msg) {
                if(msg.success)
                {
                    mensajeExito("Cambios guardados","Las capas se asociaron correctamente");
                    mensaje_guardando[0].remove();
                }
                else
                {
                    mensajeError("Error", msg.mensaje);
                    mensaje_guardando[0].remove();
                }
            },
            error: function() {
                mensaje_guardando[0].remove();
                mensajeError("Error", "Error al guardar los cambios");
            },
            data: parametros
        });
             
    }
}

function toggleStatus(componente,estado) {
    
    if (estado == false) {
        componente.attr('disabled', true);
    } else {
        componente.removeAttr('disabled');
    }   
}

function toggleEnEdicion(componente,estado) {
    
    if (estado == false) {
        componente.removeClass('enEdicion');
    } else {
        componente.addClass('enEdicion');
    }   
}

//un vez cargado el documento
$(document).ready(function() {  
    
    $.pnotify.defaults.delay = 1500;
    $('#numZoomLevels').spinner( { min: 1 , max:25});
    $('#numZoomLevels').spinner('disable');
      
    var availableTagsWms = [
      "1.0.0",
      "1.1.0",
      "1.1.1",
      "1.3.0"
    ];
    $( "#version_wms" ).autocomplete({
      source: availableTagsWms
    });
    
     var availableTagsWfs = [
      "1.0.0",
      "1.1.0"
    ];
    $( "#version_wfs" ).autocomplete({
      source: availableTagsWfs
    });

    $('#remove').on('click', function() {    

            $('#multiselect .right ul li').each(function(){
                $('#multiselect .left ul').append('<li id="'+$(this).attr('id')+'" data="'+$(this).attr('data')+'">'+$(this).text()+'</li>');
                $(this).remove();
            });
            restauraEventos();
            return false;
    });  

    $('#add').on('click', function() {    
            $('#multiselect .left ul li').each(function(){
                $('#multiselect .right ul').append('<li id="'+$(this).attr('id')+'"><input type="checkbox" name="capas" value="'+$(this).text()+'">'+$(this).text()+'</li>');
                $(this).remove();

            });
            restauraEventos();
            return false;
    });  


    $('#usuarios').change(function(evt){

        var mensajeDisp = new Array();
        var mensajeAso = new Array();

        $("#left-lista li").remove();
        $("#right-lista li").remove();

        var id_usuario = $("select#usuarios option:selected").val();

        if(id_usuario == -1)
        {
            $.pnotify_remove_all();
            mensajeInformativo("Atencion","Seleccione un usuario");
        }
        else{
            
            var parametros = {Parametro:'getCapasDisp',id_user:id_usuario};

               $.pnotify_remove_all();
               mensajeCargando("Cargando capas disponibles", "",mensajeDisp);

               $.ajax({
                   type: "POST",
                   url: "../scripts/utiles.php",
                   //contentType: "application/json; charset=utf-8",
                   dataType: "json",
                   success: function(msg) {

                     if(msg.length  > 0){
                       $.each(msg, function(index, item) {

                           var id = item.id_capa;

                           $("#left-lista").append('<li id='+id+'>'+item.nombre_capa+'</li>');

                           $('#left-lista li#'+id).on('dbclick',function() {         
                                    $('#multiselect .right ul').append('<li id="'+id+'"><input type="checkbox" name="capas" value="'+id+'">'+$(this).text()+'</li>');
                                    $('#multiselect .left ul li#'+id).remove();
                                    restauraEventos();
                            }); 

                       });
                       restauraEventos();
                       mensajeDisp[0].remove();
                       $( "#btn_salvar" ).button('enable');
                       $( "#add" ).button('enable');
                       
                       
                    }
                    else
                    {
                        mensajeDisp[0].remove(); 
                        mensajeInformativo("Atenci�n", "No hay capas para asociar");
                        
                    }
                        

                   },
                   error: function() {
                       mensajeDisp[0].remove();
                       mensajeError("Error", "Error al cargar capas");
                   },
                   data: parametros
               });


               var parametros2 = {Parametro:'getCapasAsoc',id_user:id_usuario};

               mensajeCargando("Cargando Capas asociadas", "",mensajeAso);
               $.ajax({
                   type: "POST",
                   url: "../scripts/utiles.php",
                   //contentType: "application/json; charset=utf-8",
                   dataType: "json",
                   success: function(msg) {

                    if(msg.length  > 0){
                       $.each(msg, function(index, item) {

                           var id = item.id_capa;

                           if(item.protocolo === "wfs")
                               $("#right-lista").append('<li id="'+id+'"><input type="checkbox" checked="true" name="capas" value="'+id+'">'+item.nombre_capa+'</li>');
                           else
                               $("#right-lista").append('<li id="'+id+'"><input type="checkbox" name="capas" value="'+id+'">'+item.nombre_capa+'</li>');

                           $('#multiselect .right ul li#'+id).on('dbclick',function() {
                                    $('#multiselect .left ul').append('<li id="'+id+'">'+$(this).text()+'</li>');
                                    $('#multiselect .right ul li#'+id).remove();
                                    restauraEventos();
                            });  


                       });
                       restauraEventos();
                       mensajeAso[0].remove();
                       $( "#remove" ).button('enable');
                       $( "#btn_salvar" ).button('enable');
                   }
                   else
                   {
                       mensajeAso[0].remove(); 
                       mensajeInformativo("Atenci�n", "No hay capas asociadas");
                   }

                   },
                   error: function() {
                       mensajeAso[0].remove();
                       mensajeError("Error", "Error al cargar capas");
                   },
                   data: parametros2
               });

        }
    });


    //evento para boton de panel asociacion de capas a usuarios
    $('#btn_salvar').on('click',function(){
        if($('#btn_salvar').button().is(':disabled') == false){
            guardarCambiosCapas();
        }
    });
    
    //evento para boton guardar capa de panel de ABM capas
    $('#guarda_capa').on('click',function(){
        if($('#guarda_capa').button().is(':disabled') == false){
            guardarCapas();
            $( "#guarda_capa" ).button('disable');
        }
    });
    
    
    $('#numZoomLevels').spinner({
        spin:function(){
    
          $( "#guarda_capa" ).button('enable');
        } 
     });
    
    $('#tabla_datos input').on("change keyup paste", function()
    {
        $( "#guarda_capa" ).button('enable');
        
    });
    
    $('#type_wfs').selectmenu({
        change:function(){
    
          $( "#guarda_capa" ).button('enable');
        } 
     });
    
     
//funcionalidades asociadas al boton con id=editar_capa
$("#editar_capa").on('click',function(){

    if($('#editar_capa').button().is(':disabled') == false){
    
        if($('#editar_capa').text() == 'Descartar') //si estaba en este modo reseteo estado
        {
              $( "#abmCapas #editar_capa" ).button({ //restauro el comportameinto del boton
                    icons: {
                        primary: "ui-icon-pencil"
                    },
                    label:"Editar"

             });
             
             toggleStatus($( "#tabla_datos td input" ),true);//deshabilito edicion
             $('#numZoomLevels').spinner('disable');
             $( "#guarda_capa" ).button('disable');
             $( "#editar_capa" ).button('disable');
             $('li#'+$('#id_capa').val()).remove();
             limpiarDatosInfoCapa();
             $('#lista_capas').removeClass('prevented');
             $('#add_capa').button('enable');
             $('#del_capa').button('enable');
        }
            
            //si es modo habitual del boton solo cambio el status del formulario
        if($('input#nombre_capa').is(':disabled')){ //si queiro editar
            
            $( "#abmCapas #editar_capa" ).button({
                    icons: {
                        primary: "ui-icon-cancel"
                    },
                    label:"Cancela"
             });
            toggleStatus($( "#tabla_datos td input" ),true);//habilito edicion
            $('#numZoomLevels').spinner('enable');
            toggleStatus($('li#'+$('#id_capa').val()), false);//cambio estado a selected=false
            toggleEnEdicion($('li#'+$('#id_capa').val()), true); //marco fila en edicion
        }
        else //si deseo no editar
        {
            $( "#abmCapas #editar_capa" ).button({
                    icons: {
                        primary: "ui-icon-pencil"
                    },
                    label:"Editar"

             });
             toggleStatus($( "#tabla_datos td input" ),false);//deshabilito edicion
             $('#numZoomLevels').spinner('disable');
             $( "#guarda_capa" ).button('disable');
             toggleEnEdicion($('li#'+$('#id_capa').val()), false); //desmarco fila en edicion
        }
}

    });


    $('#add_capa').on('click',function()
    {
        Ext.MessageBox.buttonText.cancel = "Cancelar";
        Ext.MessageBox.buttonText.ok = "Aceptar";
        Ext.MessageBox.prompt('Ingrese un nombre', 'Por favor ingrese un nombre para la capa:', agregaNuevaCapa);

    });
    
    $('#del_capa').on('click',function()
    {
        //borrarCapa
        Ext.MessageBox.buttonText.yes = "Si";
        Ext.MessageBox.buttonText.no = "No";
        Ext.MessageBox.confirm('Atenci?n!', '?Esta seguro que desea eliminar la capa?',delCapa);

     }); 

});    



