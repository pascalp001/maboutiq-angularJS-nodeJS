//Connexion server http / localhost:3000 :
var express = require('express');
var app = express();
app.use(express.static(__dirname+'/public'));
console.log ('ici');
//connexion :
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/produits', 
    function(err){
	if(err) {throw err;} 
	else{console.log('connexion ok');}
	} );
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', startServer);

//Démarre le server node http quand le server mongoDB est connecté :
function startServer(){
    var server = app.listen(3000, function(){
            var port = server.address().port;
            console.log('A l ecoute sur le port' + port);
    })
};


var produitSchema = new mongoose.Schema({
                nom:String, 
                urlimg:String, 
    			categorie:String, 
                taille:String,     
                reference:String, 
                descCourt:String,
                descLong:String, 
                prix:{type:Number, min:0},
                stock:Number, 
                etat:{type:Number, default:1},
                date:{type:Date,default:Date.now}
              });
var Produit = mongoose.model('produit', produitSchema); //crée la collection produit
var Categorie = mongoose.model('categories', {libelle:String}); //crée la collection categories
//test création nouveau Produit :
var testPr = new Produit({
	nom:"Cypraea Granulata",
	reference:"P10218",
	urlimg:"./images/CypraeaGranulata.jpg",
	categorie:"porcelaine",
	taille:"18mm", 
    descCourt:"ceci est un bon produit pour faire un test",
	descLong:"très bon produit que je recommande pour faire un test",
	prix:3.50,
	stock:10});
testPr.save(
	function(err){
		console.log('essai envoi');
		if(err){ console.log(err);} 
		else{console.log('Produit rajouté avec succès.');}
        app.get('/api/produit', function(req, res) { 
            Produit.find( function(err,data){
                res.json(data);
                console.log('liste affichée avec succès.');
            });
        //mongoose.connection.close();
        });
	});

// Récupération de tous les enregistrements de MongoDB :
app.get('/api/produit', function(req, res) { 

    Produit.find( function(err,data){
     	res.json(data);
	 	console.log('liste affichée avec succès.');
    	});
    //mongoose.connection.close();
	})
	.listen(3000); // écoute sur le port 3000

//déconnexion :
