var Categories = require('../../models/categories');
//wrap all the methods in an object

var categorie = {
	read: function(req, res, next){
		res.json({type: "Read", _id: req.params._id});
	},
	create: function(req, res, next){
		var categories=new Categories(req.body);
		categories.save(function(err){
			if(err){
				return res.status(400).send({message:err});
			}else{res.json(categories);}			
		});
	},	
	delete: function(req, res, next){
		Categories.remove({_id:req.params.prod_id}, function(err,prod){
			if(err){
				return res.status(400).send({message:err});
			}else{
				Categories.find(function(err,data){
					if(err) res.send(err);
					res.json(data);
				})
			}			
		});				
	},
	getAll: function(req, res, next){
		Categories.find(function(err, data){
			if(err) {console.error; console.log('erreur ici');}
			res.json(data);
		})
	}
}

//Return the object
module.exports = categorie;