<?php
  session_start();
  session_unset();
  srand();
  include("../conn.php");
  $challenge = "";
  for ($i = 0; $i < 80; $i++) {
    $challenge .= dechex(rand(0, 15));
  }
  $_SESSION['challenge'] = $challenge;
  

?>

<head>
	<meta charset=ISO-8859-1>
        <title>Panel de Administracion Map_Viewer</title>
        <!-- Import OL CSS, auto import does not work with our minified OL.js build -->
        <link rel="stylesheet" type="text/css" href="../OpenLayers/theme/default/style.css"/>
        <!-- Basic CSS definitions -->
        <link rel="stylesheet" type="text/css" href="../css/estilo.css" media="screen" />
        <script src="../ext-3.4.0/adapter/ext/ext-base.js" type="text/javascript"></script>
        <script src="../ext-3.4.0/ext-all.js"  type="text/javascript"></script>
        <link rel="stylesheet" type="text/css" href="../ext-3.4.0/resources/css/ext-all.css"></link>
     
        <script type="text/javascript" src="../js/jquery-ui/external/jquery/jquery.js"></script>
        <link type="text/css" href="../js/jquery-ui/jquery-ui.min.css" rel="Stylesheet" />
        <link type="text/css" href="../js/jquery-ui/jquery-ui.structure.min.css" rel="Stylesheet" />
        <link type="text/css" href="../js/jquery-ui/jquery-ui.theme.min.css" rel="Stylesheet" />


	<script type="text/javascript" src="../loguin/md5.js"></script>
        <script type="text/javascript" src="../js/sha1.js"></script>
     
	 <div id="logos">
		 <img src="../img/provincia_logo.png" id="logo" border="0" style="margin:0 11px" alt="Bienvenido panel de administración del editor de mapas del IDESF Gobierno de la Provincia de Santa Fe">
	 </div>
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
           }],
           buttons: [
		   {
             text: 'Panel Admin',
             handler: function(){
               if(Ext.getCmp('username').getValue() !== '' && Ext.getCmp('password').getValue() !== ''){
                 loginForm.getForm().submit({
                   url: 'loguin/authenticate.php',
                   method: 'POST',
                   params: {
                     response: hex_md5(Ext.getCmp('challenge').getValue()+hex_md5(Ext.getCmp('password').getValue()))
                   },
                   success: function(){
                     window.location = 'admin.php';
                   },
                   failure: function(form, action){
                     Ext.MessageBox.show({
                       title: 'Error',
                       msg: action.result.message ,
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
           title: 'Login Admin Panel',
           layout: 'fit',
           closable: false,
           resizable: false,
           draggable: false,
           border: false,
           height: 125,
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
