var Produits = require('../../models/produits');
var mongoose = require('mongoose');
//wrap all the methods in an object

var prodavi = {
	update: function(req, res){
		var avi = req.body;	
		var sess=req.session;

		Produits.findById({_id:req.params.prod_id}, function(err, prod){
			if(!err){
				prod.avis.push(avi);
				sess.msg='<h1 style="color:red; background-color:yellow">ici</h1>';
				document.write(sess.msg);
				prod.save( function(err){
					if(err){
						return res.status(400).send({message:err});
					}else{res.write('<h1>La note est : '+sess.note+'</h1>');}			
				});					
			}			
		});
	}
};

//Return the object
module.exports = prodavi;
