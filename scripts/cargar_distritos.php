<?php

$user = 'postgres';
$passwd = 'postgres';
$db = 'map_viewer';
$port = 5432;
$host = '69.64.62.101';
$strCnx = "host=$host port=$port dbname=$db user=$user password=$passwd";


$db_handle = pg_connect($strCnx);

if ($db_handle) 
{
	//"Connection attempt succeeded.";

   $query = "Select distinct coddep,nombre_depto FROM distritos;"; 
   $result = pg_query($db_handle,$query); 
   while ($row = pg_fetch_row($result))
   {
		echo("<option value=".$row[0].">".$row[1]."</option></br>");
   } 
} 
else {
	echo "";
}
pg_FreeResult($result);


?>