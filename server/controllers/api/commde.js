var Commdes = require('../../models/commandes');
var mongoose = require('mongoose');
//wrap all the methods in an object

var commde = {
	read: function(req, res, next){
		res.json({type: "Read", _id: req.params._id});
	},
	create: function(req, res, next){
		console.log("commdes=", req.body);
		var commdes=new Commdes(req.body);
		commdes.save(function(err){
			if(err){
				return res.status(400).send({message:err});
			}else{
				console.log('commande créée');
				res.json(commdes);}			
		});
	},	
	update: function(req, res){
		//console.log('ici, dans node, req.params.id ='+req.params.prod_id);
	    return Commdes.findById({_id:req.params.commde_id}, function (err, commde) {
	        if(!commde) {
	            res.statusCode = 404;
	            return res.send({ error: 'Not found' });
	        }
	        else{
				commde.statut        = req.body.statut;
				console.log('commande justavant save=',commde);
		       return commde.save(function (err) {
		            if (!err) {
		                console.log('commde'+commde.nom+' ( _id='+commde._id+') mis à jour');
		                return res.send({ status: 'OK', commde:commde });
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
		Commdes.remove({_id:req.params.commde_id}, function(err,commde){
			if(err){
				return res.status(400).send({message:err});
			}else{
			Commdes.find(function(err,commdes){
				if(err) res.send(err);
				console.log('commande supprimée');
				res.json(commdes);
			})
			}			
		});				
	},
	getAll: function(req, res, next){
		Commdes.find(function(err, data){
			if(err) {console.error; console.log('erreur ici');}
			else{console.log('liste des commandes envoyée vers admin');}
			res.json(data);
		})
	}
};

//Return the object
module.exports = commde;