//source : https://www.youtube.com/watch?v=mVtRK89MrHc
// Initialize the express framework
var express 		= require('express'),
	session			= require('express-session'),
	bodyParser		= require('body-parser'),
	methodOverride  = require('method-override'),
	path			= require('path'),
	mongoose		= require('mongoose'),
	databaseName 	= 'produits';

	// Express setup
	var app = express();
	app.use(bodyParser.json()); //prise en charge du JSON
	app.use(bodyParser.urlencoded({extended:true})); //prise en charge des formulaires HTML
	app.use(methodOverride()); // simulate DELETE and PUT (express4)
	app.use(session({secret: 'ssshhhhh'}));

	app.use(express.static(path.join(__dirname, '../client')));
	//app.use(express.static(__dirname+'/public'));

	// Routes set up
	var router 		= 	express.Router(); //mise en place d'un router	
	var produit 	= 	require('./controllers/api/produit'); //lien avec api/produit.js
	var prodavi 	= 	require('./controllers/api/prodavi'); 
	var categorie 	= 	require('./controllers/api/categorie'); 
	var avi 		= 	require('./controllers/api/avi'); 
	var inscrit 	= 	require('./controllers/api/inscrit'); 
	var pdm 		= 	require('./controllers/api/pdm'); 
	var adr 		= 	require('./controllers/api/adr'); 
	var numcommde 	= 	require('./controllers/api/numcommde'); 
	var commde 		= 	require('./controllers/api/commde'); 
	//var arch 		= 	require('./controllers/api/arch'); 	
	var sess;
	 
	router.get('/api/produit', produit.getAll);// Get all produits	
	router.post('/api/produit', produit.create);// Create a produit 	
	router.route('/api/produit/:prod_id')
		.get(produit.read)
		.put(produit.update)
		.delete(produit.delete);// Get one produit, update one produit, delete one produit
	
	router.get('/api/categorie', categorie.getAll);	// Get all categories
	router.post('/api/categorie', categorie.create);// Create a categorie	
	router.route('/api/categorie/:categ_id')
		.get(categorie.read)
		.delete(categorie.delete);// Get one categorie, delete one categorie
		
	
	router.get('/api/avi', avi.getAll);// Get all avis
	router.post('/api/avi', avi.create);// Create an avis
	router.route('/api/avi/:avi_id')
		.get(avi.read)
		.delete(avi.delete);

	router.route('/api/produit/avi/:avi_id')
		.put(prodavi.update);
	
	router.get('/api/inscrit', inscrit.getAll);
	router.post('/api/inscrit', inscrit.create);
	router.route('/api/inscrit/:insc_id')
			.get(inscrit.read)
			.put(inscrit.update)
			.delete(inscrit.delete);

	router.post('/api/pdm', pdm.create);	
	router.get('/api/pdm', pdm.getAll);	
	router.route('/api/pdm/:pdm_id')
			.get(pdm.read)
			.delete(pdm.delete);

	router.post('/api/adr', adr.create);	
	router.get('/api/adr', adr.getAll);	
	router.route('/api/adr/:adr_id')
			.get(adr.read)
			.put(adr.update)
			.delete(adr.delete);	

	router.post('/api/numcommde', numcommde.create);	
	router.get('/api/numcommde', numcommde.getAll);	

	router.post('/api/commde', commde.create);	
	router.get('/api/commde', commde.getAll);	
	router.route('/api/commde/:commde_id')
			.get(commde.read)
			.put(commde.update)			
			.delete(commde.delete);	

	/*router.post('/api/arch', arch.create);	
	router.get('/api/arch', arch.getAll);	
	router.route('/api/arch/:arch_id')
			.get(arch.read)
			.delete(arch.delete);	*/

	//Register the routing
	app.use('/', router);

	//Connexion à Mongoose :
	mongoose.connect('mongodb://localhost/' + databaseName,
	    function(err){
		if(err) {throw err;} 
		else{console.log('connexion en attente');}
		} );
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', startServer);

	// start up the server
	function startServer(){
		var server = app.listen(9000, function(){
				var port = server.address().port;
				console.log('A l eccoute du port ' + port);
		})
	}

	