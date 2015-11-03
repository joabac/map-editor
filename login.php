<?php
  session_start();
  session_unset();
  srand();
  include("conn.php");
  $challenge = "";
  for ($i = 0; $i < 80; $i++) {
    $challenge .= dechex(rand(0, 15));
  }
  $_SESSION['challenge'] = $challenge;
  

?>

<head>
	<meta charset=UTF-8>
        <title>Editor de mapas IDESF</title>
        <!-- Import OL CSS, auto import does not work with our minified OL.js build -->
        <!--link rel="stylesheet" type="text/css" href="OpenLayers/theme/default/style.css"/ -->
        <!-- Basic CSS definitions -->
        <link rel="stylesheet" type="text/css" href="css/estilo.css" media="screen" />
        <script src="ext-3.4.0/adapter/ext/ext-base.js" type="text/javascript"></script>
        <script src="ext-3.4.0/ext-all.js"  type="text/javascript"></script>
        <link rel="stylesheet" type="text/css" href="ext-3.4.0/resources/css/ext-all.css"></link>
        <link rel="stylesheet" type="text/css" href="ext-3.4.0/resources/css/xtheme-sf_theme.css"></link>
     
        <script type="text/javascript" src="js/jquery-ui/external/jquery/jquery.js"></script>
        <link type="text/css" href="js/jquery-ui/jquery-ui.min.css" rel="Stylesheet" />
        <link type="text/css" href="js/jquery-ui/jquery-ui.structure.min.css" rel="Stylesheet" />
        <link type="text/css" href="js/jquery-ui/jquery-ui.theme.min.css" rel="Stylesheet" />

        <script type="text/javascript" src="pnotify-1.2.0/jquery.pnotify.min.js"></script>
        <link href="pnotify-1.2.0/jquery.pnotify.default.css" media="all" rel="stylesheet" type="text/css" />
        <!-- Include this file if you are using Pines Icons. -->
        <link href="pnotify-1.2.0/style-icons/jquery.pnotify.default.icons.css" media="all" rel="stylesheet" type="text/css" />

	<script type="text/javascript" src="loguin/md5.js"></script>
        <script type="text/javascript" src="js/sha1.js"></script>
     
	<div id="logos">
             <img src="img/logo_idesf.png" class="logo_idesf" alt=""><img src="img/gob-santafe.png" id="logo_provincia" alt="Bienvenido editor de mapas del IDESF Gobierno de la Provincia de Santa Fe">
	</div>
        <div class="cortina"></div>

<!--         <img src="img/logo_idesf.png" id="logo_idesf" alt="IDESF - Infraestructura de datos Espaciales Provincia de Santa Fe."/>-->
	 <script type="text/javascript">
       Ext.BLANK_IMAGE_URL = 'images/s.gif';
       
       Ext.onReady(function(){
           
         var loginForm = new Ext.form.FormPanel({
           frame: true,
           border: false,
           labelWidth: 75,
           items: [{
             xtype: 'textfield',
             width: 190,
             id: 'username',
             fieldLabel: 'Usuario'
           },{
             xtype: 'textfield',
             width: 190,
             id: 'password',
             fieldLabel: 'Contraseña',
             inputType: 'password',
             submitValue: false
           },{
             xtype: 'hidden',
             id: 'challenge',
             value: "<?php echo $challenge; ?>",
             submitValue: false
           } ],
           buttons: [ 
                    {
                        id: 'logo_ide',
                        width: 50,
                        height:50,
                        html:  '<img src="img/logo_idesf.png" id="logo_idesf" alt="IDESF - Infraestructura de datos Espaciales Provincia de Santa Fe."/>'
                    } ,  
		   {
             text: 'Login',
             width:60,
             handler: function(){
               if(Ext.getCmp('username').getValue() !== '' && Ext.getCmp('password').getValue() !== ''){
                   // crypt();
                    var the_resp = hex_md5(Ext.getCmp('challenge').getValue()+ hex_md5(Ext.getCmp('password').getValue())); 
                    loginForm.getForm().submit({
                      url: 'loguin/authenticate.php',
                      method: 'POST',
                      params: {
                          response: the_resp
                      },
                      success: function(){
                        window.location = 'index_noOficial.php';
                      },
                      failure: function(form, action){
                        Ext.MessageBox.show({
                          title: 'Error',
                          msg: action.result.message,
                          buttons: Ext.Msg.OK,
                          icon: Ext.MessageBox.ERROR
                        });
                      }
                    });
                 
               }else{
                 Ext.MessageBox.show({
                   title: 'Error',
                   msg: 'Por favor ingrese Usuario y Contraseña',
                   buttons: Ext.Msg.OK,
                   icon: Ext.MessageBox.ERROR
                 });
               }
             }
           }
           
		   ]
         });
         var loginWindow = new Ext.Window({
           title: 'Login',
           layout: 'fit',
           closable: false,
           resizable: true,
           draggable: false,
           border: false,
           height: 155,
           width: 300,
		   ctCls: 'fondo',
           items: [loginForm]
         });
         loginWindow.show();
       });
     </script>
    </head>
    <body >
    </body>
</html>
