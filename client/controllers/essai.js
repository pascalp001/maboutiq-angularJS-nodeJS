'use strict';
angular.module('app2Prd')
 .controller('EssaiCtrl', ["$scope", function($scope) {     	
    	$scope.valeur="aaaaaaaa";
  }]);



//##### Copies diverses récupérées sur le net concernant Get, Post, Delete et Put ##############################

//NODE/MONGOOSE :
//build the REST operations at the base for blobs
//this will be accessible from http://127.0.0.1:3000/blobs if the default route for / is left unchanged
router.route('/')
    //GET all blobs
    .get(function(req, res, next) {
        //retrieve all blobs from Monogo
        mongoose.model('Blob').find({}, function (err, blobs) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require &#39;Accept: application/json;&#39; in the Request Header
                  res.format({
                      //HTML response will render the index.jade file in the views/blobs folder. We are also setting &quot;blobs&quot; to be an accessible variable in our jade view
                    html: function(){
                        res.render('blobs/index', {  title: 'All my Blobs',  "blobs" : blobs  });
                    },
                    //JSON response will show all blobs in JSON format
                    json: function(){ res.json(infophotos);  }
                });
              }     
        });
    })
    //POST a new blob
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the &quot;name&quot; attributes for forms
        var name = req.body.name;
        var badge = req.body.badge;
        var dob = req.body.dob;
        var company = req.body.company;
        var isloved = req.body.isloved;
        //call the create function for our database
        mongoose.model(&#39;Blob&#39;).create({
            name : name,  badge : badge, dob : dob, isloved : isloved
        	}, function (err, blob) {
              if (err) {
                  res.send(&quot;There was a problem adding the information to the database.&quot;);
              } else {
                  //Blob has been created
                  console.log(&#39;POST creating new blob: &#39; + blob);
                  res.format({
                      //HTML response will set the location and redirect back to the home page. You could also create a &#39;success&#39; page if that&#39;s your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn&#39;t still say /adduser
                        res.location("blobs");
                        // And forward to success page
                        res.redirect("/blobs");
                    },
                    //JSON response will show the newly created blob
                    json: function(){
                        res.json(blob);
                    }
                });
              }
        })
    });

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + 'exists');
    //find the ID in the Database
    mongoose.model('Blob').findById(id, function (err, blob) {
        //if it isn&#39;t found, we are going to repond with 404
        if (err) {
            console.log(id +  'was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ';' + err});
                 }
            });
        //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(blob);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next(); 
        } 
    });
});

//GET the individual blob by Mongo ID
router.get('/:id/edit', function(req, res) {
    //search for the blob within Mongo
    mongoose.model('Blob').findById(req.id, function (err, blob) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            //Return the blob
            console.log('GET Retrieving ID: ' + blob._id);
            //format the date properly for the value to show correctly in our edit form
          var blobdob = blob.dob.toISOString();
          blobdob = blobdob.substring(0, blobdob.indexOf('T'))
            res.format({
                //HTML response will render the 'edit.jade' template
                html: function(){
                       res.render('blobs/edit', {
                          title: 'Blob' + blob._id,
                        "blobdob" : blobdob,
                          "blob" : blob
                      });
                 },
                 //JSON response will return the JSON output
                json: function(){
                       res.json(blob);
                 }
            });
        }
    });
});

//DELETE a Blob by ID
router.delete('/:id/edit', function (req, res){
    //find blob by ID
    mongoose.model('Blob').findById(req.id, function (err, blob) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            blob.remove(function (err, blob) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID:' + blob._id);
                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                          html: function(){
                               res.redirect("/blobs");
                         },
                         //JSON returns the item with the message that is has been deleted
                        json: function(){
                               res.json({message : 'deleted',
                                   item : blob
                               });
                         }
                      });
                }
            });
        }
    });
});
//=> Il manque le update ...


//AUTRE CAS : NODE/MONGOOSE :
//Controller/route:
app.put('/places/:name', function(req, res) {
	var name = req.body.name;
	var capital = req.body.capital;
	var continent = req.body.continent;
	Place.update({ name: name, capital: capital, continent: continent}, function(name) {
	    res.redirect('/places/'+name)
}); //ne marche pas

//You have to find the document before updating anything:
Place.findById(req.params.id, function(err, p) {
  if (!p)
    return next(new Error('Could not load Document'));
  else {

    // do your updates here

    p.modified = new Date();

    p.save(function(err) {
      if (err)
        console.log('error')
      else
        console.log('success')
    });
  }
});

//Now, i think you can do this :
Place.findOneAndUpdate({name:req.params.name}, req.body, function (err, place) {
  res.send(place);
});

//You can find by id too :
Place.findOneAndUpdate({_id:req.params.id}, req.body, function (err, place) {
  res.send(place);
});



//AUTRE EXEMPLE AVEC ANGULAR NODE ET MONGOOSE : DOUTEUX
//ANGULAR :
// Works Fine :
$scope.addHabit = function(){
    var newTitle = $scope.newTitle.trim();
    if(!newTitle){  return; }
    var newHabitData = {  title: newTitle, count: 0,  status: 'active' };

    $http.post('http://localhost:3000/api/habits', newHabitData)
        .success(function(data) { $scope.habitList = data;  console.log(data);  })
        .error(function(data)  {  console.log('Error: ' + data);  });
    $('.habit-form__input-title').val('').focus();  $scope.newTitle = '';
}
// Works Fine
$scope.habitDestroy = function (id) {       
    $http.delete('/api/habits/' + id._id)
        .success(function(data) { $scope.habitList = data; console.log(data); })
        .error(function(data)  {  console.log('Error: ' + data); });
};

// NOT WORKING - I WANT TO INCREMENT THE COUNT, THEN SAVE
$scope.habitCheckIn = function(id){             
    id.count = ++id.count;
    $http.put('/api/habits/' + id) 
        .success(function(data) { $scope.habitList = data; console.log(data); })
        .error(function(data)  {  console.log('Error: ' + data); });
}
//NODE :
// Get all habits -- WORKS FINE
router.get('/api/habits', function(req, res) {
    var db = req.db;
    var collection = db.get('habits');
    collection.find({},{},function(e,data){  res.json(data);  });
});
// Create one habit -- WORKS FINE
router.post('/api/habits', function(req, res) {
    var db = req.db;
    var collection = db.get('habits');
    collection.find({},{},function(e,data){     
        collection.insert({   title: req.body.title,   count: req.body.count  
        }, function(err, habit){ 
        	 if(err){  res.send(err);  }
            collection.find({},{},function(e,data){  res.json(data);   });
        });
    });
});
// Delete one habit -- WORKS FINE
router.delete('/api/habits/:habit_id', function(req, res){
    var db = req.db;
    var collection = db.get('habits');
    collection.find({},{},function(e,data){ 
        collection.remove({  _id : req.params.habit_id }, function(err, todo){
            if(err){  res.send(err);  }
			collection.find({},{},function(e,data){  res.json(data);  });
        })
    })
})
// Update Habit -- NOT WORKING    
router.put('/api/habits/:habit_id', function(req, rest){
    var db = req.db;
    var collection = db.get('habits');
   collection.findById(req.params.habit_id, function(e,data){  
        if(e){ res.send(e); }
        data.title = req.body.title;
        data.count = req.body.count;
        data.save(function(err){
            if(err){  res.send(err);  res.json(data);  }
        })
    })
})
// Proposition qui marcherait :
router.put('/api/habits', function(req, res) {
    var db = req.db;
    var collection = db.get('habits');
    var id = req.body._id;
    if(!req.body) {   return res.send(400);   } // 6
    collection.findById(id, function(e,data){  
        if(e) {   return res.send(500, e);  } // 1, 2
        if(!data) {   return res.send(404);   } // 3

        var update = {   title : req.body.title, count : req.body.count  }; // 4
        collection.updateById(id, update, function(err) { // 5
            if(err) {  return res.send(500, err); }
        });
    });
});

//AUTRE EXEMPLE :
//NODE/MONGOOSE :
router.route('/values/:user_id')
        // create
        .post(function(req, res) { //...
        })
        // update
        .put(function(req, res) {
            var values = req.body;
            var user_id = req.params.user_id;
            Value.update({user_id: user_id}, values, function(err, values) {
                if (!err) {
                    res.json("okay");
                } else {
                    res.write("fail");
                }
            });
        })
        // view
        .get(function(req, res) { //...
        });
//ANGULAR/NODE :
return $http({
            method: 'PUT',
            url: '/api/values/' + userId,
            data: values,
            headers: {
                'x-access-token':  token
            }
        })
        .then(function (response) {
            // chained to next step
            // etc

