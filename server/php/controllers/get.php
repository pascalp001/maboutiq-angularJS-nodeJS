<?php

include('connect.php');

$result = $connect->query("SELECT * FROM produits");

$outp = "";
while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
    if ($outp != "") {$outp .= ",";}
    $outp .= '{
    	"nom" 			: 	"'. $rs["nom"] 		.'",'. 
    	'"urlimg" 		: 	"'. $rs["urlimg"]   .'",'. 
    	'"categorie" 	: 	"'. $rs["categorie"].'",'. 
    	'"taille" 		: 	"'. $rs["taille"] 	.'",'. 
    	'"reference" 	: 	"'. $rs["reference"].'",'. 
    	'"descCourt" 	: 	"'. $rs["desccourt"].'",'. 
    	'"descLong" 	: 	"'. $rs["desclong"] .'",'. 
    	'"prix" 		: 	"'. $rs["prix"] 	.'",'. 
    	'"stock" 		: 	"'. $rs["stock"] 	.'",'. 
    	'"poids" 		: 	"'. $rs["poids"]  	.'",'. 
    	'"etat" 		: 	"'. $rs["etat"]  	.'",'. 
    	'"eval" 		: 	"'. $rs["eval"] 	.'",'. 

    	'"date" 		: 	"'. $rs["date"] .'"}'; 
}
$outp ='{"produits":['.$outp.']}';
$connect->close();

echo($outp);
?>
