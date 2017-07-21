var mongoose = require ('mongoose');

var AdrSchema = new mongoose.Schema({
	id		: 	String,
	no		: 	String,
	rue		: 	String,
	complt	: 	String,
	cp		: 	String,
    ville 	: 	String,
    pays	: 	String,
    tel		: 	String,
    type	: 	String,
    titre	: 	String,
    premom	: 	String,
    nom 	: 	String
});
var Adresses = mongoose.model('Adresses', AdrSchema);
module.exports = Adresses;