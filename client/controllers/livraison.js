'use strict';

angular
.module('appPrd')
.controller('LivraisonCtrl', 
	function ($scope, 
        $rootScope, 
        $routeParams, 
        $window, 
        $http, 
        $cookieStore, 
        categService, 
        prodService, 
        panierService, 
        inscService, 
        commdeService) {
	    $scope.Math = window.Math;
      $scope.adress=$rootScope.adress;
	//Récupération de la personne inscrite :
  $scope.username=[];
	$scope.titre=""; $scope.prenom=""; $scope.nom="";
	if(localStorage.getItem('inscrit') && localStorage.getItem('inscrit')!=undefined){
      $scope.username=angular.fromJson(localStorage.getItem('inscrit'));
      $scope.id=$scope.username[0].id;
      $scope.titre=$scope.username[0].titre; 
       if($scope.titre!='M' && $scope.titre!='Mme'){$scope.titre='';}
      $scope.prenom=$scope.username[0].prenom; 
      $scope.nom=$scope.username[0].nom;
  }
  //Récupération adresse facturation :
  $scope.adress=$rootScope.adress;
    $scope.adresse1=[]; 
  if(localStorage.getItem('adresse1') && localStorage.getItem('adresse1')!=undefined){
      $scope.adresse1=angular.fromJson(localStorage.getItem('adresse1')); 
      if($scope.id==$scope.adresse1[0].id)
      {
          $scope.id=$scope.adresse1[0].id;       
          $scope.no=$scope.adresse1[0].no;
          $scope.rue=$scope.adresse1[0].rue;
          $scope.complt=$scope.adresse1[0].complt;
          $scope.cp=$scope.adresse1[0].cp;
          $scope.ville=$scope.adresse1[0].ville;
          $scope.pays=$scope.adresse1[0].pays;
          $scope.tel=$scope.adresse1[0].tel;
      }
      else{
          $scope.no="";
          $scope.rue="";
          $scope.complt="";
          $scope.cp="";
          $scope.ville="";
          $scope.pays="";
          $scope.tel="";
      }
   }
  else{
  inscService.getAdrByParam($scope.id)
      .then(function(data ){             
        if(data._id ){  
          alert('ici, getAdrByParam et _id='+data._id);
          $scope.id=data.id;       
          $scope.no=data.no;
          $scope.rue=data.rue;
          $scope.complt=data.complt;
          $scope.cp=data.cp;
          $scope.ville=data.ville;
          $scope.pays=data.pays;
          $scope.tel=data.tel;
          //stockage des données du connecté dans WebStorage:
          $scope.adresse1=[{
            id        :   data._id,
            no      :   data.no,
            rue     :   data.rue,
            complt    :   data.complt,
            cp      :   data.cp,
            ville   :   data.ville,
            pays    :   data.pays,
            tel   :   data.tel
          }];    
          localStorage.setItem('adresse1', angular.toJson($scope.adresse1));
        }
      });
  }
   
  //Paramètrage initial de l'adresse de livraison: 
    $scope.titrel=$scope.titre;
    $scope.prenoml=$scope.prenom;
    $scope.noml=$scope.nom;
    $scope.nol=$scope.no;
    $scope.ruel=$scope.rue;
    $scope.compltl=$scope.complt;
    $scope.cpl=$scope.cp;
    $scope.villel=$scope.ville;
    $scope.paysl=$scope.pays;
    $scope.tell=  $scope.tel;
  //Autres paramètrages :
    $rootScope.livrson={modpost : 0, frport : -1, numcmde : ""}; 
    $scope.numCommde ='';

  //Inscription de l'adresse :
  $scope.inscriAdresse=function(){
    $scope.adrliv=false;
  }

  // CALCUL DES FRAIS DE PORT : ***********************************************  
  //Tarifs envoi France :
  //La poste : lettre suivie
  var tLS1=1.80, pLS1=100 ;
  var tLS2=3.20, pLS2=250 ;
  var tLS3=4.60, pLS3=500 ;
  var tLS4=6.00;
  //La poste : colissimo
  var tCS1=4.90, pCS1=250 ;
  var tCS2=6.10, pCS2=500 ;
  var tCS3=6.90, pCS3=750 ;
  var tCS4=7.50, pCS4=1000 ;
  var tCS5=8.50, pCS5=2000 ;
  var tCS6=12.50, pCS6=5000 ;
  var tCS7=18.50, pCS7=10000 ;
  var tCS8=26.50, pCS8=30000 ;
  //Mondial Relay
  var tMR1=4.50, pMR1=500 ;
  var tMR2=5.20, pMR2=1000 ;
  var tMR3=5.90, pMR3=2000 ;
  var tMR4=6.70, pMR4=3000 ;
  var tMR5=7.90, pMR5=5000 ;
  var tMR6=10.40, pMR6=7000 ;
  var tMR7=12.60, pMR7=10000 ;
  var tMR8=15.20, pMR8=15000 ;
  var tMR9=18.90, pMR9=30000 ;

  //Récupération nombre articles dans panier et panier :
  $scope.countPanier =0;
  $scope.paniers = [];  
  if(localStorage.getItem('panier')!=null)
  {
    $scope.countPanier = angular.fromJson(localStorage.getItem('panier')).length;
    $scope.paniers = angular.fromJson(localStorage.getItem('panier'));
  }
  //Evaluation épaisseur et poids :
  $scope.dim=false;
  var evaldens=function(taille){
    var dens=0; //Poids en g de 1 cm3
    if(taille>210 ){dens=0.13;}  
    if(taille<=210 ){dens=0.14;}   
    if(taille<=190 ){dens=0.16;}
    if(taille<=160 ){dens=0.18;}
    if(taille<=130 ){dens=0.20;}
    if(taille<=100 ){dens=0.22;}
    if(taille<=70 ){dens=0.24;} 
    if(taille<=35){dens=0.25;}
    return dens;
  }

  var evalcoef=function(taille){
    var coef=0; //proportion diamètre coquille/taille
    if(taille>210 ){coef=0.20;} 
    if(taille<=210 ){coef=0.27;} 
    if(taille<=190 ){coef=0.35;}
    if(taille<=160 ){coef=0.50;}
    if(taille<=130 ){coef=0.65;}
    if(taille<=100 ){coef=0.80;} 
    if(taille<=70 ){coef=0.90;}      
    if(taille<=35){coef=1;}
    return coef;
  }

  var evpoids=0, evdim=0;
  for(var i=0; i<$scope.countPanier; i++)
  { 
    var taille=parseInt(/^\d+/.exec($scope.paniers[i].taille)[0]);    
    evpoids+=taille*taille*taille*evalcoef(taille)*evalcoef(taille)/1000*evaldens(taille);
    //alert('taille='+taille+'coef='+evalcoef(taille)+'>>'+taille*taille*taille*evalcoef(taille)*evalcoef(taille)/1000);
    evdim=Math.max(evdim,taille*evalcoef(taille));
  }
  //alert("evpoids="+evpoids+";evdim="+evdim);
  if(evdim<26){$scope.dim=true;}
  //Prix envoi France :
  //La poste : lettre suivie
  $scope.coutPost=0;
  if(evpoids>pLS3){$scope.coutPost=tLS4;} 
  if(evpoids<=pLS3){$scope.coutPost=tLS3;} 
  if(evpoids<=pLS2){$scope.coutPost=tLS2;}
  if(evpoids<=pLS1){$scope.coutPost=tLS1;} 
  //La poste : colissimo
  $scope.coutColi=0;
  if(evpoids>pCS8){$scope.coutColi=tCS8;}
  if(evpoids<=pCS8){$scope.coutColi=tCS8;}  
  if(evpoids<=pCS7){$scope.coutColi=tCS7;} 
  if(evpoids<=pCS6){$scope.coutColi=tCS6;}  
  if(evpoids<=pCS5){$scope.coutColi=tCS5;} 
  if(evpoids<=pCS4){$scope.coutColi=tCS4;} 
  if(evpoids<=pCS3){$scope.coutColi=tCS3;} 
  if(evpoids<=pCS2){$scope.coutColi=tCS2;} 
  if(evpoids<=pCS1){$scope.coutColi=tCS1;}
  //Mondial Relay
  $scope.coutMR=0;
  if(evpoids<=pMR9){$scope.coutMR=tMR9;}
  if(evpoids<=pMR8){$scope.coutMR=tMR8;}
  if(evpoids<=pMR7){$scope.coutMR=tMR7;}
  if(evpoids<=pMR6){$scope.coutMR=tMR6;}
  if(evpoids<=pMR5){$scope.coutMR=tMR5;}
  if(evpoids<=pMR4){$scope.coutMR=tMR4;}
  if(evpoids<=pMR3){$scope.coutMR=tMR3;}
  if(evpoids<=pMR2){$scope.coutMR=tMR2;}
  if(evpoids<=pMR1){$scope.coutMR=tMR1;}

  //Choix par défaut :
  if($scope.dim==true && $scope.coutPost<Math.min($scope.coutMR, $scope.coutColi)){$scope.modpost="3";}
  else{
    if($scope.coutMR<$scope.coutColi){$scope.modpost="1";}
    else{$scope.modpost="2";}
  }
  //Choix effectif :
  if($scope.modpost=="3"){
    $scope.fraisPort=$scope.coutPost;}
  else{
    if($scope.modpost=="2"){$scope.fraisPort=$scope.coutColi;}
    else{$scope.fraisPort=$scope.coutMR;}
  }
  //Franco de port ? **************************************************************
    //Calcul du total :
  $scope.getTotal = function(){
      var total = 0;
      for(var i = 0; i < $scope.paniers.length; i++){
          var art= $scope.paniers[i];
          total += (art.Qte * art.prix);
      }
      total=Math.round(total*100)/100;
      return total;
  }
    //Comparaison au franco :
  var franco = 30;
  if($scope.getTotal()>=franco)
  { 
    $scope.fraisPort=0;
    $scope.coutMR=0;
    $scope.coutColi=0;
    $scope.coutPost=0;
  }


  //Sauvegarde des paramètres de livraison : ***************************************
  $scope.validLivraison=function(){
     
    if($scope.okcgv==true){
      //Génération du numéro de commande :
      if($scope.numCommde ==''){
        commdeService.getNumCommde()
        .then(function(reponse){
          //alert('N° DE COMMANDE='+reponse);
          $scope.numCommde = reponse;
         //Transfert au panier :    
          $rootScope.livrson={
            modpost : $scope.modpost,
            frport  : $scope.fraisPort,
            numcmde : $scope.numCommde
          }  
          //Stockage dans Web-storage :
          $scope.livr=[];
          $scope.livr=[{
            id      : $scope.id,
            titrel  : $scope.titrel,
            prenoml : $scope.prenoml,
            noml    : $scope.noml,
            nol     : $scope.nol,
            ruel    : $scope.ruel,
            compltl : $scope.compltl,
            cpl     : $scope.cpl,
            villel  : $scope.villel,
            paysl   : $scope.paysl,
            tell    : $scope.tell,
            type    :  "L",
            modpost : $scope.modpost,
            frport  : $scope.fraisPort,
            numcmde : $scope.numCommde
          }];
          localStorage.setItem('livr', angular.toJson($scope.livr));
          $cookieStore.put('livr', angular.toJson($scope.livr));
                //Stockage dans MongoDB de l'adresse de livraison :
          var adr =[];      
          adr = {
            "id"    : $scope.id,
            "no"    : $scope.nol,
            "rue"   : $scope.ruel,
            "complt": $scope.compltl,
            "cp"    : $scope.cpl,
            "ville" : $scope.villel,
            "pays"  : $scope.paysl,
            "tel"   : $scope.tell,
            "type"  : "L",
            "titre" : $scope.titrel,
            "prenom": $scope.prenoml,
            "nom"   : $scope.noml
          }; 
          inscService.insertAdr(adr)
            .then(function(res){
               console.log('Adresse envoyée dans MongoDB');
            });
        });
      }

   
 



      //Retour vers panier...
    }
  }

  $scope.annulLivraison=function(){
    $rootScope.livrson={modpost : 0, frport : -1, numcmde : ""}; 
    $scope.kon=true;
    $scope.adress=true;
    $window.location.href ='#/panier/:kon';
  }
});