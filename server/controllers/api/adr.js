var Adresses = require('../../models/adresses');
//wrap all the methods in an object

var adresse = {
	create: function(req, res, next){
		var adresses = new Adresses(req.body);
		adresses.save(function(err){
			if(err){console.log('adresse err='+ adresses.ville);
				return res.status(400).send({message:err});
			}else{
				console.log('adresse'+adresses.ville+' envoyée vers mongoDB'); 
				res.json(adresses);}			
		});
	},
	read: function(req, res, next){
		res.json({type: "Read", _id: req.params.adr_id});
	},	
	update: function(req, res){
		//console.log('ici, dans node, req.params.id ='+req.params.adr_id);
	    return Adresses.findById({_id:req.params.adr_id}, function (err, adr) {
	    	//console.log(adr);
	        if(!adr) {
	            res.statusCode = 404;
	            return res.send({ error: 'Not found' });
	        }
	        else{
					adr.id     = req.body.id;
					adr.no     = req.body.no;
					adr.rue    = req.body.rue;
					adr.complt = req.body.complt;
					adr.cp     = req.body.cp;
					adr.ville  = req.body.ville;
					adr.pays   = req.body.pays;
					adr.tel    = req.body.tel;

				//console.log(adr);
	       		return adr.save(function (err) {
		            if (!err) {
		                console.log('adr'+adr.ville+' ( _id='+adr._id+'/id='+adr.id+') mis à jour');
		                return res.send({ status: 'OK', adr:adr });
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
		Adresses.remove({_id:req.params.adr_id}, function(err,adr){
			if(err){
				return res.status(400).send({message:err});
			}else{
				Adresses.find(function(err,data){
					if(err) res.send(err);
					res.json(data);
				})
			}			
		});				
	},
	getAll: function(req, res, next){
		Adresses.find(function(err, data){
			if(err) {console.error; console.log('erreur ici');
			console.log('envoi liste adresses vers client ')}
			res.json(data);
		})
	}
}

//Return the object
module.exports = adresse;