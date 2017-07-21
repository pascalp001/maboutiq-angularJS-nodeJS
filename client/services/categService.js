(function(){
angular.module("appPrd")
       .factory("categService",function($http){
       		var showCateg={};
       		var result={};
       		var urlBase = '/api/categorie'; //data/categories.json
		return {
				getCategories: function(){
		    		return $http.get(urlBase)
		    			.error(function(err){alert('là'+err);})		    		
				       	.then(function(response){ 
				              return response.data; });			
		 		},

		 		insertCategorie:function (dataCateg) {
		 			var request = $http.post(urlBase, dataCateg);
		 			console.log('envoi vers MongoDB categorie='+dataCateg.libelle);
        			return(request.then(function(response){ 
        				return $http.get(urlBase)
        					.then(function(response){ 
				              return response.data; })
        				}));
		 		},
				deleteCategorie: function (id) {
    			    var request = $http.delete(urlBase + '/' + id);
    			    return(request.then(function(response){ 
        				return $http.get(urlBase)
        					.then(function(response){ 
				              return response.data; })
        				}));			 		
    			}
			};
		});
}());
