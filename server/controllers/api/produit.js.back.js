var Produits = require('../../models/produits');
//wrap all the methods in an object

var produit = {
	read: function(req, res, next){
		res.json({type: "Read", _id: req.params._id});
	},
	create: function(req, res, next){
		var produits=new Produits(req.body);
		produits.save(function(err){
			if(err){
				return res.status(400).send({message:err});
			}else{res.json(produits);}			
		});
	},	
	update: function(req, res, next){
		res.json({type: "Update", _id: req.params._id, body: req.body});
	},
	delete: function(req, res, next){
		res.json({type: "Delete", _id: req.params._id});
	},
	getAll: function(req, res, next){
		Produits.find(function(err, data){
			if(err) {console.error; console.log('erreur ici');}
			res.json(data);
		})
	}
}

//Return the object
module.exports = produit;