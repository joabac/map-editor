function mensajeAtencion(titulo, mensaje)
{
	$.pnotify({
				title: titulo,
				text: mensaje,
				styling: 'jqueryui',
				sticker: false,
				history: false,
				animation: 'fade',
                                hide: true,
                                closer: false,
                                shadow: true
			});
        

}

function mensajeError(titulo, mensaje)
{
      $.pnotify({
				title: titulo,
                                type: 'error',
				text: mensaje,
				styling: 'jqueryui',
				sticker: false,
				history: false,
				animation: 'fade',
                                hide: true,
                                closer: false,
                                shadow: true
			});
         

}

function mensajeInformativo(titulo,mensaje)
{
    
	$.pnotify({
				title: titulo,
				text: mensaje,
				styling: 'jqueryui',
				sticker: false,
				history: false,
                                type: 'info',
				animation: 'fade',
                                hide: true,
                                closer: false,
                                shadow: true
			});

}

function mensajeCargando(titulo,mensaje,referencia)
{
	referencia.push($.pnotify({
            title: titulo,
            text: mensaje,
            styling: 'jqueryui',
            type: 'info',
            icon: 'picon cargando',
            hide: false,
            history: false,
            closer: false,
            sticker: false,
            shadow: true
        })
    );
        referencia[0].show();

}

function mensajeExito(titulo, mensaje)
{
      $.pnotify({
				title: titulo,
                                type: 'success',
				text: mensaje,
				styling: 'jqueryui',
				sticker: false,
				history: false,
				animation: 'fade',
                                hide: true,
                                closer: false,
                                shadow: true
			});
         

}


