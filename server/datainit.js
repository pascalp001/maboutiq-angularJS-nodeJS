// Lancé avec node datainit.js, permet de vérifier la réception par MongoDB
// du produit par insertProduits() ; on peut lui greffer une jonction serveur
// avec un .listen(9000)
var 	mongoose		= require('mongoose'),
	databaseName 	= 'produits';

	var Produits = mongoose.model("Produit", {
		nom: String,
		urlimg: String,
		categorie: String,
		taille: String,
		reference: String,
		descCourt: String,
		descLong: String,
		prix: Number,
		stock: Number,
		etat: Number,
		date: String	
	});

	mongoose.connect('mongodb://localhost/' + databaseName);

	var db = mongoose.connection;
	db.on('error', console.error);
	db.once('open', deleteProducts);

	function deleteProduits(){
		Products.remove({}, function(err){
			if(err) console.log(err);	
			insertProduits()		
		});
	}

	function insertProduits(){
		var produits = new Produits({
		nom:"Cypraea Granulata",
		reference:"P10218",
		urlimg:"./images/CypraeaGranulata.jpg",
		categorie:"porcelaine",
		taille:"18mm", 
	    descCourt:"ceci est un bon produit pour faire un test",
		descLong:"très bon produit que je recommande pour faire un test",
		prix:3.50,
		stock:10
		});
		produits.save(function(err){
			if(err) console.log(err);
		});
	}	
/*
	function startServer(){
	var server = app.listen(9000, function(){
			var port = server.address().port;
			console.log('A l eccoute du port ' + port);
	})

}*/