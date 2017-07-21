(function(){
angular.module("appPrd")
       .factory("prodService",function($http){
       		var urlBase = '/api/produit'; //= 'data/produits.json' ;
		return {
				getProduits: function(){					
		    		return $http.get(urlBase)
		    			.error(function(err){alert('là'+err);})
				        .then(function(response){ 
				              return response.data; });	
				},
		 	//	getProduits: function (id) {
			//       return $http.get(urlBase + '/' + id)
			//       	.then(function(response){ 
			//	              return response.data; });			
		 	//	},
		 		
		 		getProdByParam: function(valeur) {
		 			return $http.get(urlBase)
				       .then(function(response){ 
				           	var arr = response.data; 
				          	var len = arr.length;
				          	for (var d=0 ; d<len ; d++)
				          	{	if (arr[d]._id===valeur)
				          		{	return arr[d];
				          		//alert('ici'+len+'valeur='+valeur+'id='+arr[1]._id);
				          		 }
				          	};
				        });	
		 		},
/*		 		getProdByResource: function($resource, param, valeur){
		 			var id=0;
		 			return $resource(urlBase + '/:' + param, {param: valeur}).get();
		 		},*/
		 		insertProduit:function (prod) {
		 			var request = $http.post(urlBase, prod);
        			return(request.then(function(response){ 
        				return $http.get(urlBase)
        					.then(function(response){ 
				              return response.data; })
        				}));	
		 		},
		 		getProduitsPHP:function(){
		 			$http.get("../server/php/controllers/get.php")
    				.then(function (response) {$scope.prod = response.data.produits;});

				},
		 		insertProduitPHP:function(prod){
       				$http.post("../server/php/controllers/insert.php", prod )
           			.then( function(data, status, headers, config){
           			 console.log( "data insérées avec succès")  
           			});
				},
    			updateProduit: function (id,prod) {    	
    				//console.log('ici, dans updateProduit, id='+id);
    				//console.log('ici, dans updateProduit, prod=',prod);
			        return $http.put(urlBase+'/'+id, prod)
			        	.then(
				        	function(response,status, headers, config){ 
				        		//alert('updateProduit, ça marche !');
		        			},
	    					function(response){ 
	    						alert('erreur, updateProduit marche pas !'); 
	    					}
			        	);	
			        
    			},
 /*   			addAviProduit: function (id,avi){
    				var request =$http({
    					method: 'PUT',
    					url:urlBase+'/avi/'+id,
    					data: avi
    				});
			        return (request.success( function(response,status, headers, config){ //alert('ça marche !');
			        				})
            						.error( function(data){ alert('erreur, addAviProduit marche pas !');
            						})
            				);  				
    			},*/
				deleteProduit: function (id) {
    			    var request = $http.delete(urlBase + '/' + id);
    			    return(request.then(function(response){ 
        				return $http.get(urlBase)
        					.then(function(response){ 
				              return response.data; })
        			}));	
    			}

			};
		})
;
}());
