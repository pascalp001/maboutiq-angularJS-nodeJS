(function(){
angular.module("appPrd")

        .factory("inscService",function($http){
       		var urlBase1 = '/api/inscrit'; 
       		var urlBase2 = '/api/pdm';  
       		var urlBase3 = '/api/adr';         		     		
		return {
				getInsc: function(){					
		    		return $http.get(urlBase1)
				        .then(function(response){ 
				              return response.data; } , 
				              function(err){
				              	alert('là'+err);});	
				},		 		
		 		getInscByParam: function(valeur) {
		 			var arr =[];
		 			return $http.get(urlBase1)
				       .then(function(response){ 
				       		var arr=[{"_id":"0","email":""}];
				       		var res=arr[0]._id;
				           	arr = response.data; 
				          	var len = arr.length;
				          	//alert('len='+len);
				          	//console.log('ici, res='+res);
				          	for (var d=0 ; d<len ; d++)
				          	{	console.log('ici,'+arr[d].email+', valeur='+valeur);	
				          		if (arr[d].email===valeur)
				          		{	console.log('ici,getInscByParam et id='+arr[d]._id+' email='+arr[d].email);
				          			//alert('getInscByParam et id='+arr[d]._id);
				          			res=arr[d];				          			
				          		}
				          	};
				          	console.log('là, res='+res._id);
				          	return res;

				        });	
		 		},
		 		getPdmByParam: function(valeur) {
		 			return $http.get(urlBase2)
				       .then(function(response){ 
				           	var arr = response.data; 
				          	var len = arr.length;
				          	var res = "";
				          	for (var d=0 ; d<len ; d++)
				          	{	if (arr[d].id===valeur)
				          		{	//console.log('trouvé: '+d+' = '+arr[d].dpm);
				          			res = arr[d].dpm;}
				          	};
				          	return res;
				        });	
		 		},
		 		getAdrByParam: function(valeur, type) {
		 			return $http.get(urlBase3)
				       .then(function(response){ 
				           	var arr = response.data; 
				       		console.log('ici, getAdrByParam : '+arr.length+' réponses reçues ; renvoi vers adresse');           	
				          	var len = arr.length;
				          	var res = "";
				          	for (var d=0 ; d<len ; d++)
				          	{	if (arr[d].id===valeur )
				          		{
				          			if(!arr[d].type || arr[d].type==type)
				          			{
				          			 res = arr[d];
				          			}
				          		}
				          	};
				          	return res;
				        });	
		 		},			 		
		 		insertInsc:function (insc) {
		 			var request = $http.post(urlBase1, insc);
		 			return(request.then(function(response){ 
				              return response.data; }));				
		 		},
		 		insertPdm:function (pdm) {
		 			var request = $http.post(urlBase2, pdm);
        			return(request.then(function(response){ 
				              return response.data; }));   					
		 		},	
		 		insertAdr:function (adr) {
		 			var request = $http.post(urlBase3, adr);
		 			return(request.then(function(response){ 
				              return response.data; }));				
		 		},		 		 		
    			updateInsc: function (id,insc) {    	
     				//console.log('ici, dans updateInsc, id='+id);
    				//console.log('ici, dans updateInsc, insc=',insc);
			        return $http.put(urlBase1+'/'+id, insc)
			        	.then(
				        	function(response,status, headers, config){ 
				        		//alert('updateProduit, ça marche !');
		        			},
	    					function(response){ 
	    						alert('erreur, updateInsc marche pas !'); 
	    					}
			        	);	
    			},
    			updateAdr: function (id,adr) {    	
			        return $http.put(urlBase3+'/'+id, adr)
			        	.then(
				        	function(response,status, headers, config){ 
				        		//alert('inscService.updateAdr, ça marche !');
		        			},
	    					function(response){ 
	    						alert('erreur, inscService.updateAdr marche pas !'); 
	    					}
			        	);			        
    			},
				deleteInsc: function (id) {
    			    var request = $http.delete(urlBase1 + '/' + id);
    			    return(request.then(function(response){ 
        				return $http.get(urlBase1)
        					.then(function(response){ 
        						$http.delete(urlBase2 + '/' + id);
				              return response.data; })
        			}));	
    			},
    			deleteAdr: function (id) {
    			    var request = $http.delete(urlBase3 + '/' + id);
    			    return(request.then(function(response){ 
				              return response.data; 
        			}));	
    			}

			};
		})
;
}());
