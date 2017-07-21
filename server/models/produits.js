var mongoose = require ('mongoose');

var AviseSchema = new mongoose.Schema({
	user:String, 
	note:Number, 
	textavi:String, 
	date:Date
});
//var Avises = mongoose.model('Avises', AviseSchema); dans le cas d'une structure indépendante des collections

var ProdSchema = new mongoose.Schema({
	nom: String,
	urlimg: String,
	categorie: String,
	taille: String,
	reference: String,
	descCourt: String,
	descLong: String,
	prix: Number,
	stock: Number,
	poids: Number,
	etat: Number,
	eval: Number,
	avis: [AviseSchema],	
	date: {type:Date, default:Date.Now}

	// ou avis: [{type: Schema.Types.ObjectId, ref:'Avis'}] dans le cas d'une structure indépendante des collections
});
var Produits = mongoose.model('Produits', ProdSchema); //crée la collection 'Produits' dans MongoDB
module.exports = Produits;