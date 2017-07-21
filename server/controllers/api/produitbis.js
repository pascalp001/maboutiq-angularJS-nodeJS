var Produits = require('../../models/produits');
var mongoose = require('mongoose');
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
	update: function(req, res){
		/*Produits.findById({'_id':req.params.prod_id}, function(err, prod){
			if (err){res.send(err);}
			else{var prod0 = req.prod;}
		}*/
		var prod = req.body;
		var prod_id = req.params.prod_id;
		Produit.update({_id: prod_id}, prod, function(err, prod){
			if(!err){res.json("okay");}
			else{res.write("fail");}
		});
		
		//	
		//var prod = req.prod;	
				//prod._id = req.body._id;
		//		prod.nom = req.body.nom;
		//		prod.urlimg = req.body.urlimg;
		//		prod.categorie = req.body.categorie;
		//		prod.taille = req.body.taille  ;
		//		prod.reference = req.body.reference  ;
		//		prod.descCourt = req.body.descCourt ;
		//		prod.descLong = req.body.descLong ;
		//		prod.prix = req.body.prix  ;
		//		prod.stock = req.body.stock ;
		//		prod.etat = req.body.etat  ;
				//prod.date = req.body.date  ;
		//prod.save(function(err){
		//	if(err){
		//		return res.status(400).send({message:err});
		//	}else{res.json(prod);}			
		//});
		//	prod.update(prod).exec();
			/*function(err){
				if(err){
					return res.status(400).send({message:err});
				}else{res.json({message:'produit modifié'});}			
			});*/
		//Produits.update({_id:req.params.prod_id}, req.body, function(err,prod){
		//	if(err)
		//		res.send(err);
		//});
		//});
	},
	delete: function(req, res, next){
		Produits.remove({_id:req.params.prod_id}, function(err,prod){
			if(err){
				return res.status(400).send({message:err});
			}else{
			Produits.find(function(err,produits){
				if(err) res.send(err);
				res.json(produits);
			})
			}			
		});				
	},
	getAll: function(req, res, next){
		Produits.find(function(err, data){
			if(err) {console.error; console.log('erreur ici');}
			res.json(data);
		})
	},
	produitByID: function(req, res, next, id){
		if (!mongoose.Types.ObjectId.isValid(id)) {
	    	return res.status(400).send({
	     	 	message: 'Produit is invalid'
	    	});
	    }
	    Produits.findById(id).exec(function(err, produit){
   			if (err) {
    		  return next(err);
    		} else if (!produit) {
      			return res.status(404).send({
        			message: 'No article with that identifier has been found'
      			});	 
      		}
      		req.prod = produit;
      		next();   	
	    });
	}
};

//Return the object
module.exports = produit;
