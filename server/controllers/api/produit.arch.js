var Produits = require('../../models/produits');
//wrap all the methods in an object

var produit = {
	read: function(req, res, next){
		res.json({type: "Read", _id: req.params._id});
	},
	create: function(req, res, next){ 
		/*var Prod = new Produits({
		nom: req.body.nom,
		urlimg:req.body.urlimg,	
		categorie:req.body.categorie,
		taille:req.body.taille , 
		reference:req.body.reference ,
	    descCourt:req.body.descCourt ,
		descLong:req.body.descLong ,
		prix:req.body.prix,
		stock:req.body.stock,
		etat: req.body.etat,
		date: req.body.date});
		Prod.save(
		function(err){
			console.log('essai envoi');
			if(err){ console.log(err);} 
			else{console.log('Produit rajouté avec succès.');}
	        /*app.get('/api/produit', function(req, res) { 
	            Produit.find( function(err,data){
	                res.json(data);
	                console.log('liste affichée avec succès.');
	            });
	        });*/
	    //});
/*
		var Prod = new Produits();
		Prod.nom = req.body.nom;
		Prod.urlimg = req.body.urlimg;
		Prod.categorie = req.body.categorie;
		Prod.taille = req.body.taille  ;
		Prod.reference = req.body.reference  ;
		Prod.descCourt = req.body.descCourt ;
		Prod.descLong = req.body.descLong ;
		Prod.prix = req.body.prix  ;
		Prod.stock = req.body.stock ;
		Prod.etat = req.body.etat  ;
		Prod.date = req.body.date  ;
		Prod.save(function(err){
			if(err){res.send(err);}
			res.json({message:'produit envoyé avec succès'});
		});	
	},	*/
	update: function(req, res, next){
		res.json({type: "Update", _id: req.params._id, body: req.body});
	},
	delete: function(req, res, next){
		res.json({type: "Delete", _id: req.params._id});
	/*},
	getAll: function(req, res, next){
		Produits.find(function(err, data){
			if(err) {console.error; console.log('erreur ici');}
			res.json(data);
		})*/
	}
}

//Return the object
module.exports = produit;
