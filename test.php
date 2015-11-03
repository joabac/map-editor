<html>
<head>

<script src="js/jBcrypt-v2.2/MochiKit/MochiKit.js" type="text/javascript"></script>
<script src="js/jBcrypt-v2.2/Clipperz/Base.js" type="text/javascript"></script>
<script src="js/jBcrypt-v2.2/Clipperz/ByteArray.js" type="text/javascript"></script>
<script src="js/jBcrypt-v2.2/Clipperz/Crypto/BigInt.js" type="text/javascript"></script>
<script src="js/jBcrypt-v2.2/Clipperz/Crypto/SHA.js" type="text/javascript"></script>
<script src="js/jBcrypt-v2.2/Clipperz/Crypto/AES.js" type="text/javascript"></script>
<script src="js/jBcrypt-v2.2/Clipperz/Crypto/PRNG.js" type="text/javascript"></script>
<script src="js/jBcrypt-v2.2/bCrypt.js" type="text/javascript"></script>
<script type="text/javascript" src="js/sha1.js"></script>

<meta charset=ISO-8859-1>
<title>test</title>

<script type="text/javascript"> 
 
       
        
  
      
        //si exito limpiar form resfrescar listado
        var id_capa_estilo = 2;
       

        
            var parametros = {Parametro:'guardaEstilo',id_capa:id_capa_estilo,user_name:"joabac@gmail.com"};

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
        

</script

</head>
<body>



<?php				 
	
	
	
   /* $rand = "";
  //for ($i = 0; $i < 80; $i++) {
    //$rand .= dechex(rand(0, 150));
    $rand = '$2a$10$9iothHH3t0npBXWyckmeXe';
 // }$2a$10$jbacigalupo61178a7e55582b5d4b4bd8
	//print("</br>");
	$encriptado = crypt('10153214',$rand);
        
	
print("</br>$encriptado");
    print("</br>$rand");
	*/
?>

</body>
</html>