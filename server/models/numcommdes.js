var mongoose = require ('mongoose');

var NumCSchema = new mongoose.Schema({
	numero: String
});
var Numcommdes = mongoose.model('Numcommdes', NumCSchema);
module.exports = Numcommdes;