<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8"); 
if(!session_id()) {session_start();}
$DB_HOST	= "127.0.0.1";
$DB_DBASE 	= "produits";
$DB_USER 	= "root";
$DB_MP 		= "" ;

$connect = new mysqli($DB_HOST, $DB_USER, $DB_MP, $DB_DBASE);
$_SESSION['test']="session_test=";
?>