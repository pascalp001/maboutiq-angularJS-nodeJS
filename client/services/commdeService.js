(function(){
angular.module("appPrd")
       .factory("commdeService",function($http){
       		var urlBase1 = '/api/numcommde'; 
       		var urlBase2 = '/api/commde'; 
       		//var urlBase3 = '/api/arch'
		return {
				getNumCommde: function(){					
		    		return $http.get(urlBase1)
		    			.error(function(err){alert('là'+err);})
				        .then(function(response){ 
	//Le numero de commande comprend :
	//Une lettre pour désigner l'année : K=2015, L=2016
	//Une série de 5 chiffres issu de l'incrémentation des commandes Exemple 00012 pour le 12ème numéro de commande créé
	//Un nombre de 2 chiffres aléatoire afin d'éviter la co-existance de 2 numéros de commande identiques
				        	var ladate = new Date();
				        	var codeAn = String.fromCharCode(65+ladate.getFullYear()-2005);
				        	var l=90000; 
				        	l=response.data.length;
				        	//alert('l='+l);
				        	var cd='';
				        	var rd = parseInt(Math.random()*100).toString();
				        	if (l<10000){cd+='0'}
				        	if (l<1000){cd+='0'}
				        	if (l<100){cd+='0'}
				        	if (l<10){cd+='0'}
				        	cd+=l.toString();
				        	var numcommde = codeAn+cd+rd;
				        	console.log("Numero de la commande créé : "+numcommde);
				        	var numero = {numero: numcommde};
				        	return $http.post(urlBase1, numero)
				        		.then(function(){
				        			return numcommde;
				        		});
				        });       						
				},
				getCommde: function(statuts){					
		    		return $http.get(urlBase2)
		    			.error(function(err){alert('là'+err);})
				        .then(function(response){ 
				        	var arr = response.data;
				        	var commdes=[];
				        	//console.log('ici, data=',arr);
				        	var len = arr.length;
				        	var i=0;
				          	for (var d=0 ; d<len ; d++)
				          	{	
				          		for(var s in statuts)
				          		{
				          			if (!arr[d].statut && arr[d].numcmde){arr[d].statut=1;}			          			
				          			if (arr[d].statut==s)
				          			{	
				          				commdes[i]=arr[d];
				          				i++;
				          			}
				          		}
				          	}
				          	return commdes;
				        });
				},		 		
		 		getCommdeByParam: function(valeur) {
		 			return $http.get(urlBase2)
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
		 		getCommdeByResource: function($resource, param, valeur){
		 			var id=0;
		 			return $resource(urlBase2 + '/:' + param, {param: valeur}).get();
		 		},
		 		insertCommde:function (commde) {
		 			$http.post(urlBase2, commde)
        			.then(function(response){ 
				        return response.data; 
        			});	
		 		},
    			updateCommde: function (id,commde) {    	
    				//console.log('ici, dans updateCommde, id='+id);
    				//console.log('ici, dans updateCommde, commde=',commde);
			        return $http.put(urlBase2+'/'+id, commde)
			        	.then(
				        	function(response,status, headers, config){ 
				        		//alert('updateCommde, ça marche !');
		        			},
	    					function(response){ 
	    						alert('erreur, updateCommde marche pas !'); 
	    					}
			        	);	
    			},
				deleteCommde: function (id) {
    			    var request = $http.delete(urlBase2 + '/' + id);
    			    return(request.then(function(response){ 
        				return $http.get(urlBase2)
        					.then(function(response){ 
				              return response.data; })
        			}));	
    			}/*,
		 		insertArch:function (commde) {
		 			$http.post(urlBase3, commde)
        			.then(function(response){ 
				        return response.data; 
        			});	
		 		}  */ 			

			};
		})
;
}());