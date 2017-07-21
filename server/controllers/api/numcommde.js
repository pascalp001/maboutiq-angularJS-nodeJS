var Numcommdes = require('../../models/numcommdes');
//wrap all the methods in an object

var numcommde = {
	read: function(req, res, next){
		res.json({type: "Read", _id: req.params._id});
	},
	create: function(req, res, next){
		var numcommdes=new Numcommdes(req.body);
		numcommdes.save(function(err){
			if(err){console.log('erreur numcommde>create : save(numcommdes) impossible');
				return res.status(400).send({message:err});
			}else{console.log('numcommde>create : sauvegarde MongoDB numero réussie'); res.json(numcommdes);}			
		});
	},	
	delete: function(req, res, next){
		Numcommdes.remove({_id:req.params.prod_id}, function(err,prod){
			if(err){
				return res.status(400).send({message:err});
			}else{
				Numcommdes.find(function(err,data){
					if(err) res.send(err);
					res.json(data);
				})
			}			
		});				
	},
	getAll: function(req, res, next){
		Numcommdes.find(function(err, data){
			if(err) {console.error; console.log('erreur numcommde>getAll');}
			else{console.log('récupération liste numcommdes MongoDB réussie')}
			res.json(data);
		})
	}
}

//Return the object
module.exports = numcommde;