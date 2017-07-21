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
			}else{
				console.log('produit créé');
				res.json(produits);}			
		});
	},	
	update: function(req, res, next){
		//console.log('ici, dans node, req.params.id ='+req.params.prod_id);
    return Produits.findById({_id:req.params.prod_id}, function (err, produit) {
        if(!produit) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        else{
			produit.nom        = req.body.nom;
			produit.urlimg     = req.body.urlimg;
			produit.categorie  = req.body.categorie;
			produit.taille     = req.body.taille;
			produit.reference  = req.body.reference;
			produit.descCourt  = req.body.descCourt;
			produit.descLong   = req.body.descLong;
			produit.prix       = req.body.prix;			
			produit.stock      = req.body.stock;
			produit.poids      = req.body.poids;
			produit.etat       = req.body.etat;
			produit.eval       = req.body.eval;	
			produit.date       = req.body.date;	
			produit.avis 	   = req.body.avis;			
			/*if(produit.avis.length == 0){
				console.log('ici, dans server > produit > update, req.body.avis[0]=', req.body.avis[0]);
				produit.avis = req.body.avis[0] ;}
			else if(produit.avis.length > 0 && produit.avis!=req.body.avis){
				console.log('ici, dans server > produit > update, déjà un avis ; produit.avis :',produit.avis);
				console.log('ici, dans server > produit > update, déjà un avis ; req.body.avis :',req.body.avis);
				produit.avis.push(req.body.avis) ;
				}*/
			console.log('produit justavant save=',produit);
	       return produit.save(function (err) {
	            if (!err) {
	                console.log('produit'+produit.nom+' ( _id='+produit._id+') mis à jour');
	                return res.send({ status: 'OK', produit:produit });
	            } else {
	                if(err.name == 'ValidationError') {
	                    res.statusCode = 400;
	                    res.send({ error: 'Validation error' });
	                } else {
	                    res.statusCode = 500;
	                    res.send({ error: 'Server error' });
	                }
	                console.log('Internal error(%d): %s',res.statusCode,err.message);
	            }
	        });
       }	
		});
	},
	delete: function(req, res, next){
		Produits.remove({_id:req.params.prod_id}, function(err,prod){
			if(err){
				return res.status(400).send({message:err});
			}else{
			Produits.find(function(err,produits){
				if(err) res.send(err);
				console.log('produit supprimé');
				res.json(produits);
			})
			}			
		});				
	},
	getAll: function(req, res, next){
		Produits.find(function(err, data){
			if(err) {console.error; console.log('erreur ici');}
			else{console.log('liste des produits envoyée vers client');}
			res.json(data);
		})
	}
};

//Return the object
module.exports = produit;
