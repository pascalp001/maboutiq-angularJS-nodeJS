(function(){
angular.module("appPrd")
.factory("panierService",function($http){

	if(localStorage.getItem('panier')!=null)
	{nbPdPanier = localStorage.getItem('panier').length;}
	else{nbPdPanier=0;}

   	return {
   		getVisites : function(){
       		if(typeof localStorage!='undefined'){
       			var nbvisites = localStorage('visites')
       			if(nbvisites!=null){  nbvisites = parseInt(nbvisites)}
       			else {nbvisites = 1;}
       			nbvisites++;
       			localStorage.setItem('visites', nbvisites);
       		return nbvisites;
       		}
       		else{ 
       		return("localStorage n'est pas supporté");}
   		},
		getNbPdPanier : function(){
			return nbPdPanier;
		},
   		getPdPanier : function(){
   			return angular.fromJson(localStorage.getItem('panier')) || [];
   		},
   		getPdPanierById : function(id){
   			return angular.fromJson(localStorage.getItem('panier'.id)) || [];
   		},
   		setPdPanier: function(prods){
   				
   				var enreg = angular.fromJson(localStorage.getItem('panier')) || [];
   				prods=prods.unshift({id:nbPdPanier+1});
   				enreg.push(prods);
   			return localStorage.setItem('panier'._Id, angular.toJson(enreg));
   		},
   		updatePdPanier: function(id, data){
   			var enreg 	= 	angular.fromJson(localStorage.getItem('panier'.id)) || [];   		
   			var name	= 	data.Nom; 	if(name!=enreg.Nom){enreg.Nom=name;}
   			var qte 	= 	data.Qte;	if(qte!=enreg.Qte){enreg.Qte=qte;}
   			var price 	= 	data.Prix; 	if(price!=enreg.Prix){enreg.Prix=price;}

   			return localStorage.setItem('panier', angular.toJson(enreg));
   		},
   		deletePdPanier: function (id){
   			return localStorage.removeItem('panier'._Id);
   		}
   	};
});
}());