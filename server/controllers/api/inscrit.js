var Inscrits = require('../../models/inscrits');
//wrap all the methods in an object

var inscrit = {
	read: function(req, res, next){
		res.json({type: "Read", _id: req.params.insc_id});
	},
	create: function(req, res, next){
		var inscrits = new Inscrits(req.body);
		inscrits.save(function(err){
			if(err){console.log('inscrit err='+ inscrits.nom);
				return res.status(400).send({message:err});
			}else{
				console.log('inscription'+inscrits.nom+' envoyée vers mongoDB'); 
				res.json(inscrits);}			
		});
	},	
	update: function(req, res){
		console.log('ici, dans node, req.params.id ='+req.params.insc_id);
    return Inscrits.findById({_id:req.params.insc_id}, function (err, inscrit) {
	        if(!inscrit) {
	            res.statusCode = 404;
	            return res.send({ error: 'Not found' });
	        }
	        else{
				inscrit.valid = req.body.valid;	

				return inscrit.save(function(err){
		            if (!err) {
		                console.log('inscrit'+inscrit.nom+' ( _id='+inscrit._id+') mis à jour');
		                return res.send({ status: 'OK', inscrit:inscrit });
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
		Inscrits.remove({_id:req.params.insc_id}, function(err,insc){
			if(err){
				return res.status(400).send({message:err});
			}else{
				Inscrits.find(function(err,data){
					if(err) res.send(err);
					res.json(data);
				})
			}			
		});				
	},
	getAll: function(req, res, next){
		Inscrits.find(function(err, data){
			if(err) {console.error; console.log('erreur ici');
			console.log('envoi liste inscrits vers client')}
			res.json(data);
		})
	}
}

//Return the object
module.exports = inscrit;