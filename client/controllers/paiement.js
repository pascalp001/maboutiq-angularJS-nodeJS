'use strict';

angular
.module('appPrd')
.controller('PaiementCtrl', 
	function ($scope, 
    $rootScope, 
    $routeParams, 
    $window, 
    $http, 
    $cookieStore, 
    panierService, 
    inscService, 
    commdeService) 
  {
  	    $scope.Math = window.Math;
        $scope.adress=$rootScope.adress;
      $scope.total=0;
      $scope.total=$routeParams.total;

    //Paramètrage banque :
    $scope.sysSecur   =   "$$$$$$$$";
    $scope.nomBqSecur =   "BBBBBBBB";
    $scope.cpteBq     =   "19406-00005-88812345001-88";
    $scope.IBAN       =   "FR76 1940 6000 0588 8123 4500 188";
    $scope.BIC        =   "AGRIFRPP888";
    $scope.nomBq      =   "BBBBBBBB";

  	//Récupération de la personne inscrite :
    $scope.username=[];
  	$scope.titre=""; $scope.prenom=""; $scope.nom="";

  	if(localStorage.getItem('inscrit') && localStorage.getItem('inscrit')!=undefined)
    {
        $scope.username = angular.fromJson(localStorage.getItem('inscrit'));
        $scope.id     = $scope.username[0].id;
        $scope.titre  = $scope.username[0].titre; 
         if($scope.titre!='M' && $scope.titre!='Mme'){$scope.titre='';}
        $scope.prenom = $scope.username[0].prenom; 
        $scope.nom    = $scope.username[0].nom;
    }
    //Récupération adresse facturation :
    $scope.adress=$rootScope.adress;
      $scope.adresse1=[]; 
    if(localStorage.getItem('adresse1') && localStorage.getItem('adresse1')!=undefined)
    {
        $scope.adresse1=angular.fromJson(localStorage.getItem('adresse1')); 
            $scope.id       =   $scope.adresse1[0].id;       
            $scope.no       =   $scope.adresse1[0].no;
            $scope.rue      =   $scope.adresse1[0].rue;
            $scope.complt   =   $scope.adresse1[0].complt;
            $scope.cp       =   $scope.adresse1[0].cp;
            $scope.ville    =   $scope.adresse1[0].ville;
            $scope.pays     =   $scope.adresse1[0].pays;
            $scope.tel      =   $scope.adresse1[0].tel;
            $rootScope.adress =true;
            $scope.adress   =   $rootScope.adress;
     }else{
      inscService.getAdrByParam($scope.id)
        .then(function(data ){             
          if(data._id)
          {  
            //alert('ici, _id='+data._id);
            $scope.id     =   data.id;       
            $scope.no     =   data.no;
            $scope.rue    =   data.rue;
            $scope.complt =   data.complt;
            $scope.cp     =   data.cp;
            $scope.ville  =   data.ville;
            $scope.pays   =   data.pays;
            $scope.tel    =   data.tel;
            $rootScope.adress=true;
            $scope.adress =   $rootScope.adress;
            //stockage des données du connecté dans WebStorage:

            $scope.adresse1=[{
              id      :   data._id,
              no      :   data.no,
              rue     :   data.rue,
              complt  :   data.complt,
              cp      :   data.cp,
              ville   :   data.ville,
              pays    :   data.pays,
              tel     :   data.tel
            }];    
            localStorage.setItem('adresse1', angular.toJson($scope.adresse1));
          }
        });
    }
     
    //Paramètrage initial : 
      $scope.modbq = 1;
      $scope.showAlerte=false;
      $scope.toggleVue=1;

    //Validation du paiement / envoi de la commande :
    $scope.validPaiement = function(){
      $scope.commande=[];
      if(localStorage.getItem('livr') && 
         localStorage.getItem('livr')!=undefined &&
         localStorage.getItem('livr')!=[{}] &&       
         localStorage.getItem('panier') && 
         localStorage.getItem('panier')!=undefined)
      {
        var livr     = [];     
        livr          = angular.fromJson(localStorage.getItem('livr'));
        $scope.date = new Date();
        alert("livr[0].titrel="+livr[0].titrel );
        $scope.commande={
          "id"      :     $scope.id,
          "titre"   :     $scope.titre,
          "nom"     :     $scope.nom,
          "prenom"  :     $scope.prenom,
          "no"      :     $scope.no,
          "rue"     :     $scope.rue,
          "complt"  :     $scope.complt,
          "cp"      :     $scope.cp,
          "ville"   :     $scope.ville,
          "pays"    :     $scope.pays,
          "tel"     :     $scope.tel,
          "titrel"  :     livr[0].titrel,
          "prenoml" :     livr[0].prenoml,
          "noml"    :     livr[0].noml,
          "nol"     :     livr[0].nol,
          "ruel"    :     livr[0].ruel,
          "compltl" :     livr[0].compltl,
          "cpl"     :     livr[0].cpl,
          "villel"  :     livr[0].villel,
          "paysl"   :     livr[0].paysl,
          "tell"    :     livr[0].tell,
          "modpost" :     livr[0].modpost,
          "frport"  :     livr[0].frport,
          "numcmde" :     livr[0].numcmde,
          "total"   :     $scope.total,
          "modRegl" :     $scope.modbq,
          "date"    :     $scope.date,
          "statut"  :     1,
          "panier"  :     []
        };
        console.log('commde=', $scope.commande );
        var panierIn   = angular.fromJson(localStorage.getItem('panier'));
        var lenPanierIn = panierIn.length;

        for (var i=0; i<lenPanierIn; i++)
        {
          var pan={
            "idP"    : panierIn[i]._id,
            "ref"    : panierIn[i].ref,
            "nom"    : panierIn[i].nom,
            "taille" : panierIn[i].taille,
            "Qte"    : panierIn[i].Qte,
            "prix"   : panierIn[i].prix 
          };
            $scope.commande.panier.push(pan);
        }
        
        console.log('commde=', $scope.commande );
        commdeService.insertCommde($scope.commande);
      }
    }

});