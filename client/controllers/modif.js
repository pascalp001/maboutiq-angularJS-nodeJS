'use strict';

angular
.module('appPrd')
.controller('ModifCtrl',  function ($scope, $rootScope, $resource, $routeParams, $http, categService, prodService) {
     	
    	$scope.editData={};
    	$scope._id=$routeParams.id;
      $scope.admin=true;
      $rootScope.admin=$scope.admin;
      
     	$scope.showCateg2={'visibility':'hidden'} ;
     	$scope.nvCateg2={};
    	$scope.nvCateg2.libelle="";
    	var countCategories=0;

      categService.getCategories()
        .then(function(data){
          $scope.categories=data;
          $scope.countCategories = data.length;
      });

      prodService.getProduits()
        .then(function(data){
          $scope.produits=data;
      });

      var valeur=$scope._id;
      prodService.getProdByParam(valeur)
      	.then(function(data){
      		$scope.editData=data;
      });  

      $scope.showCategorie2=function(){ 
       $scope.showCateg2={'visibility':'visible'} ;
      };

      $scope.addCategorie2=function(countCategories) {  
          var nvCateg2=$scope.nvCateg2.libelle;
        var dataCateg={"libelle": nvCateg2};
        categService.insertCategorie(dataCateg)
              .then(function(response){
                $scope.showCateg2={'visibility':'hidden'} ;})
              .catch(function(response){
                console.log('echec envoi des données'+response);
                $scope.showCateg2={'visibility':'hidden'} ;});
      };

      $scope.supprCategorie=function(categorie){
        //Doit tester au préalable si la categorie a déjà été utilisée ou non
        categService.deleteCategorie(categorie._id)
                  .then(function(response) {
                    $scope.categories=response;;
                  });
      };

      $scope.date = new Date();

      $scope.updateProduit=function(){
        //alert('ds updateProduit, nom='+$scope.editData.nom);
        var prod=$scope.editData;
        prod.date=$scope.date;
        //alert("id="+prod._id);

          prodService.updateProduit(prod._id,prod)
                    .then(function(response) {
                $scope.editData = {}; // clear the form
                $scope.editData.etat = 1;
                $scope.urlimg="";
              });
          prodService.insertProduitPHP(prod);
      };

      $scope.deleteProduit=function(){
          var prod={
            "_id": $scope._id,
            "nom": $scope.editData.nom,
            "urlimg": $scope.editData.urlimg,
            "categorie": $scope.editData.categorie,
            "taille": $scope.editData.taille,
            "reference": $scope.editData.reference,
            "descCourt": $scope.editData.descCourt,
            "descLong": $scope.editData.descLong,
            "prix": $scope.editData.prix,
            "stock": $scope.editData.stock,
            "etat": $scope.editData.etat,
            "date": $scope.editData.date
          };
        $scope.supprProduit(prod);
      }

      $scope.supprProduit=function(produit){
        prodService.deleteProduit(produit._id)
                  .then(function(response) {
                    $scope.produits=response;;
                  });
      }


      $scope.reg=function(a,b){
        if (!b || b==' '){
          if(!a || a=='>' || a=='<'){return true;}
          else{return false;}
        }
        if (a==null || a==undefined || a==''){return true;}
        else{var rega = new RegExp(a.toLowerCase()); 
           if (b.toString().length>0) {
            b = b.toString().toLowerCase(); 
            //alert('b='+b);
            if(rega.test(b)) {return true;} 
            else {return false;}
           } 
           else {return false;}
        }
      }


      $scope.comp=function(a,b,c)
      {
        var res=false;   
        if (b==null || b==undefined || b==''){res = false;}
        if (a==null || a==undefined || a==''){res = true;}
        if (c==null || c==undefined || c==''){res = true;}
        else {
        //alert('ici '+b+' '+c+' '+a+'='+res);
        
        if(c=='>'){   if(b>a){
          res = true;} }
        if(c=='='){   if(b==a){res = true;} }
        if(c=='<'){   if(b<a){res = true;} }
        }
        return res;
      };

});
