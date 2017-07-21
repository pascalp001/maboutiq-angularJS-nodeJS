var mongoose = require ('mongoose');

var PanierSchema = new mongoose.Schema({
	idP 		:  String,
	ref		:  String,
        nom   		:  String,
        taille 		:  String,
        Qte   		:  Number,
        prix  		:  Number 
});

var CommdeSchema = new mongoose.Schema({
        "id"      :     String,
        "titre"   :     String,
        "nom"     :     String,
        "prenom"  :     String,
        "no"      :     String,
        "rue"     :     String,
        "complt"  :     String,
        "cp"      :     String,
        "ville"   :     String,
        "pays"    :     String,
        "tel"     :     String,
        "titrel"  :     String,
        "prenoml" :     String,
        "noml"    :     String,
        "nol"     :     String,
        "ruel"    :     String,
        "compltl" :     String,
        "cpl"     :     String,
        "villel"  :     String,
        "paysl"   :     String,
        "tell"    :     String,
        "modpost" :     Number,
        "frport"  :     Number,
        "numcmde" :     String,
        "total"   :     Number,
        "modRegl" :     Number,
        "statut"  :     Number,
	"panier"  :     [PanierSchema],	
	"date" 	  : 	{type:Date, default:Date.Now}
});
var Commdes = mongoose.model('Commdes', CommdeSchema); //crée la collection 'Commdes' dans MongoDB
module.exports = Commdes;