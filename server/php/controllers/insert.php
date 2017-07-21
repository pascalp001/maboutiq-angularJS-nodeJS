<?php
//Connexion :
include('connect.php');

//file_get_contents permet de lire et parser le contenu d'un fichier en une chaîne ; on décode ensuite la chaîne json :
$data = json_decode(file_get_contents("php://input")); 
//Lecture data reçues :
$avisPr =array();
$nomPr 			= 	mysql_real_escape_string($data->nom);// pour 'echaper' les caractères spéciaux
$urlimgPr 		=	mysql_real_escape_string($data->urlimg); 
$categoriePr 	=	mysql_real_escape_string($data->categorie);
$taillePr 		=	mysql_real_escape_string($data->taille); 
$referencePr 	=	mysql_real_escape_string($data->reference); 
$descCourtPr 	=	mysql_real_escape_string($data->descCourt); 
$descLongPr 	=	mysql_real_escape_string($data->descLong); 
$prixPr 		=	mysql_real_escape_string($data->prix);
$stockPr 		=	mysql_real_escape_string($data->stock); 
$poidsPr 		=	mysql_real_escape_string($data->poids);
$etatPr 		=	mysql_real_escape_string($data->etat);
$evalPr 		=	mysql_real_escape_string($data->eval);

$datePr 		=	mysql_real_escape_string($data->date); 

$avisPr 		=	$data->avis; 
$len=$avisPr.length;
for ($i=0; $i<$len ; $i++){
	$userAvi[$i] 	= 	mysql_real_escape_string($avisPr->user);
	$noteAvi[$i] 	= 	mysql_real_escape_string($avisPr->note);
	$textAvi[$i] 	= 	mysql_real_escape_string($avisPr->textavi);
	$dateAvi[$i] 	= 	mysql_real_escape_string($avisPr->date);
}

//Requêtes (envoi vers base de données)
$connect->query("
	INSERT INTO produits( 
	'nom_pr', 'urlimg_pr', 'categorie_pr', 
	'taille_pr', 'reference_pr', 'desccourt_pr', 
	'desclong_pr','prix_pr','stock_pr',
	'poids_pr','etat_pr','eval_pr',
	'date_pr')
	 VALUES (
	 '".$nomPr."', '".$urlimgPr."','".$categoriePr."', 
	 '".$taillePr."', '".$referencePr."', '".$descCourtPr."', 
	 '".$descLongPr."', '".$prixPr."', '".$stockPr."', 
	 '".$poidsPr."', '".$etatPr."', '".$evalPr."', 
	 '".$datePr."')");

$result=$connect->query("
	SELECT _id_pr 
	FROM produits 
	WHERE 'nom_pr' = '".$nomPr."' 
	AND 'reference_pr' = '".$referencePr."';
	)"); 
$_id_pr=$result->fetch_array(mysqli_assoc);

for ($i=0; $i<$len ; $i++){
$connect->query("
	INSERT INTO avis( '_id_pr_avi', 'user_avi', 'note_avi', 'text_avi', 'date_avi') 
	VALUES ('".$_id_pr."','".$userAvi[$i]."', '".$noteAvi[$i]."', '".$textAvi[$i]."', '".$dateAvi[$i]."')"
	);"
}


?> 
