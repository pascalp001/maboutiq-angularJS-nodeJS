var mongoose = require ('mongoose');

var ArPanierSchema = new mongoose.Schema({
	idP 		:  String,
	ref		:  String,
        nom   		:  String,
        taille 		:  String,
        Qte   		:  Number,
        prix  		:  Number 
});

var ArchSchema = new mongoose.Schema({
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
	"panier"  :     [ArPanierSchema],	
	"date" 	  : 	{type:Date, default:Date.Now}
});
var Archs = mongoose.model('Archs', ArchSchema); //crée la collection 'Archs' dans MongoDB
module.exports = Archs;