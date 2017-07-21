var mongoose = require ('mongoose');

var AviSchema = new mongoose.Schema({
	idprod	: 	String,
	nom		: 	String,
	urlimg	: 	String,
	taille	: 	String,
	prix	: 	Number,
    note 	:  	Number,
    textavi	: 	String,
    user  	: 	String,
    date 	: 	{type:Date, default:Date.Now},
    valid 	:  	Number
	
});
var Avis = mongoose.model('Avis', AviSchema);
module.exports = Avis;