var mongoose = require ('mongoose');

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
	etat: Number,
	date: {type:Date, default:Date.Now}
});
var Produits = mongoose.model('Produits', ProdSchema);
module.exports = Produits;