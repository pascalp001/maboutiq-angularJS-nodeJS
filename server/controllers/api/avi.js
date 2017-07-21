var Avis = require('../../models/avis');
//wrap all the methods in an object

var avi = {
	read: function(req, res, next){
		res.json({type: "Read", _id: req.params.avi_id});
	},
	create: function(req, res, next){
		var avis=new Avis(req.body);
		avis.save(function(err){
			if(err){
				return res.status(400).send({message:err});
			}else{res.json(avis);}			
		});
	},	
	delete: function(req, res, next){
		Avis.remove({_id:req.params.avi_id}, function(err,avi){
			if(err){
				return res.status(400).send({message:err});
			}else{
				Avis.find(function(err,data){
					if(err) res.send(err);
					else{ console.log("L'avis a été supprimé.");}
					res.json(data);
				})
			}			
		});				
	},
	getAll: function(req, res, next){
		Avis.find(function(err, data){
			if(err) { console.log('erreur ici, dans avi.js>getAll');}
			else{ console.log('La liste des avis en attente est récupérée avec succès.');}
			res.json(data);
		})
	}
}

//Return the object
module.exports = avi;