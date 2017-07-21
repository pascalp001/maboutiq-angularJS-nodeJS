var Commdes = require('../../models/archs');
var mongoose = require('mongoose');
//wrap all the methods in an object

var arch = {
	read: function(req, res, next){
		res.json({type: "Read", _id: req.params._id});
	},
	create: function(req, res, next){
		console.log("archs=", req.body);
		var archs = new Archs(req.body);
		archs.save(function(err){
			if(err){
				return res.status(400).send({message:err});
			}else{
				console.log('archive créée');
				res.json(archs);}			
		});
	},	
	delete: function(req, res, next){
		Archs.remove({_id:req.params.arch_id}, function(err,arch){
			if(err){
				return res.status(400).send({message:err});
			}else{
			Archs.find(function(err,archs){
				if(err) res.send(err);
				console.log('archive commande supprimée');
				res.json(archs);
			})
			}			
		});				
	},
	getAll: function(req, res, next){
		Archs.find(function(err, data){
			if(err) {console.error; console.log('erreur ici');}
			else{console.log('liste des archives de commandes envoyée vers admin');}
			res.json(data);
		})
	}
};

//Return the object
module.exports = arch;