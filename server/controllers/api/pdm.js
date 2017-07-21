var mongoose = require ('mongoose');

var PdmSchema = new mongoose.Schema({
	id			: 	String,
	dpm			: 	String
});
var Pdms = mongoose.model('Pdms', PdmSchema);

var pdm = {
	read: function(req, res, next){
		res.json({type: "Read", _id: req.params.pdm_id});
	},
	create: function(req, res, next){
		var pdms = new Pdms(req.body);
		pdms.save(function(err){
			if(err){ console.log('erreur stockage pdm');
				return res.status(400).send({message:err});
			}else{console.log('stockage pdm ok'); res.json(pdms);}			
		});
	},	
	delete: function(req, res, next){
		Pdms.remove({_id:req.params.avi_id}, function(err,avi){
			if(err){
				return res.status(400).send({message:err});
			}else{
				Pdms.find(function(err,data){
					if(err) res.send(err);
					res.json(data);
				})
			}			
		});				
	},
	getAll: function(req, res, next){
		Pdms.find(function(err, data){
			if(err) {console.error; console.log('erreur ici');}
			res.json(data);
		})
	}
}

//Return the object
module.exports = pdm;