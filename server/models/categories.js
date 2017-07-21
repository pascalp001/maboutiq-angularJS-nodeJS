var mongoose = require ('mongoose');

var CategSchema = new mongoose.Schema({
	libelle: String
});
var Categories = mongoose.model('Categories', CategSchema);
module.exports = Categories;