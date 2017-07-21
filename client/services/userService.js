(function(){
angular.module("appPrd")
	.factory("userService",function($rootScope, $q, inscService){
		var inscrit = null;
		
	return{
		isConnected:function() {
			return isConnected;
		},
		getConnexion: function(userMail,mp){
			var msg_c="";
			var deferred = $q.defer();
			var isConnected = false;
			var admin=false;
			//sessionStorage.setItem('rd', angular.toJson([{rd:rd,mp:mp}]));
			var data=inscService.getInscByParam(userMail)
				.then(function(data ){  
					 var valeur="", droit=0; 
					 
					 //alert("id récupéré="+data._id+" ");
			      	//Le email saisi existe bien :                    
				  	if(data._id){         
				        valeur=data._id;
				        droit=data.valid;
						msg_c="email ok";
						//récupération et stockage des données du connecté dans WebStorage:
				        var inscrit=[{
				          id      :   data._id,
				          titre   :   data.titre,
				          prenom  :   data.prenom,
				          nom     :   data.nom,
				          email   :   data.email,
				          datnaiss:   data.datnaiss
				        }];    
		    			localStorage.setItem('inscrit', angular.toJson(inscrit));
		    			var rd=rd;
		    			//Vérification du pdm :
				        inscService.getPdmByParam(valeur)
				        .then(function(response){
				        	var admin=false;
		            			//var equiv=angular.fromJson(sessionStorage.getItem('rd'));
		            			//var rd = equiv[0].rd;
		            			var rd = calcMD5(mp);
		            			//alert('reponse connexion>getPdmByParam='+response+', rd='+rd+'droit='+data.valid);
					            if(response==rd){
						            msg_c+=" -> mdp ok";
						            console.log(" connexion>getPdmByParam-> mdp ok ; droit= "+droit);
						            isConnected = true;
						            if(droit==2){
			                			admin=true;
			             			}  
						            $rootScope.$broadcast("connectionStatusChanged", {userMail : userMail, connect : isConnected, admin : admin});
			           				
			           				var inscrit=angular.fromJson(localStorage.getItem('inscrit'));
			           				var id=inscrit[0].id;
			              			var inscr={user:userMail, id:id, pdm:rd, connect:true};
			              			var connecte = [];
			              			if(sessionStorage.getItem('connecte') && angular.fromJson(sessionStorage.getItem('connecte')).length>0){
			              				connecte=angular.fromJson(sessionStorage.getItem('connecte'));
			              				connecte.push(inscr);}
			                		else{connecte[0]=inscr;}
			              			console.log(connecte);
			                		sessionStorage.setItem('connecte', angular.toJson(connecte));

			              			// si adresse existe dans localStorage ... si pas le bon id, on supprime l'adresse
						            if( localStorage.getItem('adresse1') && localStorage.getItem('adresse1')!=undefined){
						                var adresse1=angular.fromJson(localStorage.getItem('adresse1')); 
					                  	if(id!=adresse1[0].id){
					                    	adresse1=[{}]; 
					                   		localStorage.setItem('adresse1', angular.toJson(adresse1));
					                  	}
					              	}
						            // si livraison existe dans localStorage ... si pas le bon id, on supprime livraison
					              	if( localStorage.getItem('livr') && localStorage.getItem('livr')!=undefined){
					                	var livr=angular.fromJson(localStorage.getItem('livr')); 
					                  	if(id!=livr.id){
					                    	livr=[{}]; 
					                    	localStorage.setItem('livr', angular.toJson(livr));
		                  				}
		            				}
		            				console.log('message retourné='+msg_c)
		            				deferred.resolve({msg : msg_c, connect : isConnected, admin : admin});
		            				return deferred.promise;  
		            				
								}
		           				else{
		              				var inscrit=[]; 
		              				localStorage.setItem('inscrit', angular.toJson(inscrit));
		              				msg_c+=" -> mdp pas bon";
		              				console.log(" -> mdp pas bon");
		              				deferred.reject({msg : msg_c, connect : isConnected, admin : admin});
		              				return deferred.promise; 
		            			}
		        			}
		          			,function(err){ console.log(" -> mdp tj pas bon");
			            		var inscrit=[]; 
			            		localStorage.setItem('inscrit', angular.toJson(inscrit));
			            		msg_c+=" -> mdp pas bon";
	              				deferred.reject({msg : msg_c, connect : isConnected, admin : admin});
	              				return deferred.promise; 
		          			}
		    			);

		  			}
		    		//Le email saisi n'existe pas :    
		      		else{msg_c=" -> email inconnu ; inscrivez-vous";
          				deferred.reject({msg : msg_c, connect : isConnected, admin : admin});
          				return deferred.promise; 
		      		} 
				//$scope.kon=$scope.connect;  
    
    			});
    			
			},
		inscription: function(userMail,mp){
			var deferred = $q.defer();
			inscService.getInscByParam(userMail)
				.then(function(data ){  
					var valeur="", droit=0;
					deferred.resolve({droit : droit, connect : true, admin : true});
		            return deferred.promise;  
		            },function(error) {
		            	deferred.reject('ecchec');
		            return deferred.promise; 
		            });
		  },
		deconnexion: function(){

			}
		}
		})
;
}());

/*
angular.module('cfd', [])

.factory('StudentService', ['$http', function ($http) {
    var path = 'data/people/students.json';
    var students = [];

    //* In the real app, instead of just updating the students array
    // * (which will be probably already done from the controller)
    // * this method should send the student data to the server 
    var save = function (student) {
        if (student.id === null) {
            students.push(student);
        } else {
            for (var i = 0; i < students.length; i++) {
                if (students[i].id === student.id) {
                    students[i] = student;
                    break;
                }
            }
        }
    };

    // Populate the students array with students from the server 
    $http.get(path).success(function (data) {
        data.forEach(function (student) {
            students.push(student);
        });
    });

    return {
        students: students,
        save:     save
    };     
}])

.controller('someCtrl', ['$scope', 'StudentService', 
    function ($scope, StudentService) {
        $scope.students = StudentService.students;
        $scope.saveStudent = function (student) {
            // Do some $scope-specific stuff

            // Do the actual saving using the StudentService
            StudentService.save(student);
            // The $scope's `students` array will be automatically updated
            // since it references the StudentService's `students` array

            // Do some more $scope-specific stuff, 
            // e.g. show a notification 
        };
    }
]);
*/