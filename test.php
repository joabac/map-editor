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

<!--script type="text/javascript"> 
 
       /* var password = "10153214";
	//var salt = "$2a$10$9iothHH3t0npBXWyckmeXe";
	var bcrypt = new bCrypt();
        var output = "";

        var salt;
	
        salt = bcrypt.gensalt(16);
		

	function result(newhash){
                output = newhash;
		document.write(output);
	}
	bcrypt.hashpw(password, salt, result, function() {});
        
        */
       hash = hex_sha1("10153214"); /* SHA-1 */
        document.write(hash);


</script-->

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