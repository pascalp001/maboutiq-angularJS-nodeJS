'use strict';

angular
.module('appPrd')
.controller('AdresseCtrl', 
	function ($scope, $rootScope, $routeParams, $window, $http, categService, prodService, panierService, inscService) 
{
	    $scope.Math = window.Math;
      $scope.adress=$rootScope.adress;
      $scope.msg=""; $scope.existedja=false;
      $scope.kon=true;

  //Paramètrage initial :
    $scope.pays="France";

  // RECUPERATION DES DONNEES ANTERIEURES : **********************************************************
	//Récupération dans WebStorage de la personne précèdemment inscrite :
  $scope.username=[];
	$scope.titre=""; $scope.prenom=""; $scope.nom="";
  	if(localStorage.getItem('inscrit') && localStorage.getItem('inscrit')!=undefined)
    {
        $scope.username=angular.fromJson(localStorage.getItem('inscrit'));
        $scope.id=$scope.username[0].id;
        $scope.titre=$scope.username[0].titre; 
         if($scope.titre!='M' && $scope.titre!='Mme'){$scope.titre='';}
        $scope.prenom=$scope.username[0].prenom; 
        $scope.nom=$scope.username[0].nom;
    }
  //Si une adresse existe dans WebStorage pour le même user, on récupère les données de cette adresse ;
  //On la propose en indiquant "Une adresse existe déjà pour ce compte "
//  $scope.adresse1=[]; 
/*    if(localStorage.getItem('adresse1') && localStorage.getItem('adresse1')!=undefined
      && angular.fromJson(localStorage.getItem('adresse1'))[0].id==$scope.id)
    {
        $scope.adresse1=angular.fromJson(localStorage.getItem('adresse1')); 
            $scope.id=$scope.adresse1[0].id;       
            $scope.no=$scope.adresse1[0].no;
            $scope.rue=$scope.adresse1[0].rue;
            $scope.complt=$scope.adresse1[0].complt;
            $scope.cp=$scope.adresse1[0].cp;
            $scope.ville=$scope.adresse1[0].ville;
            $scope.pays=$scope.adresse1[0].pays;
            $scope.tel=$scope.adresse1[0].tel;
            $scope.msg="Une adresse existe déjà pour ce compte :";
            $scope.existedja=true;
      }
    else{*/
      //si une adresse existe dans MongoDB pour ce user, on la propose :
      inscService.getAdrByParam($scope.id,"F")
        .then(function(data ){             
          if(data._id)
          {  
            console.log('ici panier>getAdrByParam F, _id='+data._id);
            $scope._id    =   data._id;
            $scope.id     =   data.id;       
            $scope.no     =   data.no;
            $scope.rue    =   data.rue;
            $scope.complt =   data.complt;
            $scope.cp     =   data.cp;
            $scope.ville  =   data.ville;
            $scope.pays   =   data.pays;
            console.log('ici panier>getAdrByParam F, ville='+data.ville);
            $scope.tel    =   data.tel;
            $scope.msg    =   "Une adresse existe déjà pour ce compte :";
            $scope.existedja=true;
          }
      });
    //}

  // SAUVEGARDE DES DONNEES CONCERNANT L'ADRESSE : *********************************************
  //Inscription de l'adresse saisie (ou modifiée) :
  $scope.inscriAdresse=function(){
    	//1-stockage local des données :
   	$scope.adresse1=[{
        id      : $scope.id,
    		no      : $scope.no,
    		rue     : $scope.rue,
    		complt  : $scope.complt,
    		cp      : $scope.cp,
    		ville   : $scope.ville,
    		pays    : $scope.pays,
        tel     : $scope.tel
    	}];    
    		localStorage.setItem('adresse1', angular.toJson($scope.adresse1));
          console.log('Adresse envoyée dans WebStorage');
        //alert("ici inscriAdresse > setItem('adresse1')");
      //2-stockage MongoDB des données nouvelle adresse :
        var adr =[];      
      adr = {
        "id"    : $scope.id,
        "no"    : $scope.no,
        "rue"   : $scope.rue,
        "complt": $scope.complt,
        "cp"    : $scope.cp,
        "ville" : $scope.ville,
        "pays"  : $scope.pays,
        "tel"   : $scope.tel,
        "type"  : "F",
        "titre" : $scope.titre,
        "prenom": $scope.prenom,
        "nom"   : $scope.nom
      };       
      if($scope.existedja==false)
      {
        //nouvelle adresse :
        inscService.insertAdr(adr)
          .then(function(res){
             console.log('Adresse envoyée dans MongoDB');
             $scope.adress=true;
             $rootScope.adress=true;
             $scope.adrs=true;
             //$rootScope.$apply();
             //$scope.redirect='#/panier/'+$scope.kon+'/'+$scope.adrs;
        });
      }else{    
        //adresse mise à jour :  
        inscService.updateAdr($scope._id,adr)
          .then(function(res){
             console.log('Adresse modifiée dans MongoDB');
             $scope.adress=true;
             $rootScope.adress=true;
             $scope.kon=true;
             $scope.adrs=true;
             $window.location.href = '#/panier/'+$scope.kon+'/'+$scope.adrs;
             //$rootScope.$apply();
             //$scope.redirect='#/panier/:adrs';
        });     
      }

        //$scope.redirect='#/panier';

    }
});