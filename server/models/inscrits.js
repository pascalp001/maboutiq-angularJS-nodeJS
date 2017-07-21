var mongoose = require ('mongoose');

var InscSchema = new mongoose.Schema({
	titre		: 	String,
	prenom		: 	String,
	nom			: 	String,
	email		: 	String,
	datnaiss	: 	String,
    date 		: 	{type:Date, default:Date.Now},
    valid 		:  	Number
});
var Inscrits = mongoose.model('Inscrits', InscSchema);
module.exports = Inscrits;