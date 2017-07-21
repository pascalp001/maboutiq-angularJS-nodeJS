(function(){
angular.module("appPrd")
       .factory("avisService",function($http){
       		var urlBase = '/api/avi'; 
		return {
				getAvis: function(){					
		    		return $http.get(urlBase)
		    			.error(function(err){alert('Chez getAvis, '+err);})
				        .then(function(response){ 
				              return response.data; });	
				},		 		
		 		getAviByParam: function(valeur) {
		 			return $http.get(urlBase)
		 				.error(function(err){alert('Chez getAviByParam, '+err);})
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
		 		insertAviProv:function (avi) {
		 			var request = $http.post(urlBase, avi);
        			return(request.then(function(response){ 
				              return response.data; 
        				}));	
		 		},
    			/*updateAvi: function (id,avi) {    	
        			var request =$http({
                		method:'PUT',
                		url:urlBase+'/'+id,
                		data: avi
                		//,headers: {'x-access-token': token}
            		});
			        return (request.success(
			        			function(response,status, headers, config){ //alert('ça marche !');
			        			})
            						.error( function(data){ alert('erreur, updateAvi marche pas !'); })
			        );	
    			},*/
				deleteAvi: function (id) {
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
