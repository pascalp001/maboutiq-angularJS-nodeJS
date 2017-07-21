'use strict';

angular
.module('appPrd')
.controller('PanierCtrl', 
	function ($scope, $rootScope, $routeParams, $http, $location,
				categService, 
				prodService, 
				panierService, 
				inscService,
				commdeService) 
	{
	$scope.Math = window.Math;
	$scope.screen=angular.element(document.body.clientWidth);
	$scope.innerW=window.innerWidth;
	$scope.kon=false;
  $scope.adrs=false;
  $scope.paye=false;
  $scope.showAlerte=false;
  $scope.numCommde="000000";
  /*if($routeParams.kon){
    $scope.kon=$routeParams.kon; 
    $scope.connect=$routeParams.kon;
    $rootScope.connect=$routeParams.kon;
  }
  else{*/
    $scope.connect=$rootScope.connect;    
  /*if($routeParams.adrs){
    $scope.adrs=$routeParams.adrs;
    $scope.adress=$routeParams.adrs;
    $rootScope.adress=$routeParams.adrs;
  }
  else{*/
  $scope.adress=$rootScope.adress;
  if($routeParams.paye){$scope.paye=true;}
  
  //alert('paye='+$scope.paye);
	
  // VERIFICATION DU STATUT 'CONNECTÉ' : ******************************************************
  $scope.statutconnexion=function(){
      if(sessionStorage.getItem('connecte') && sessionStorage.getItem('connecte')!=undefined){
        $scope.usersConnect=angular.fromJson(sessionStorage.getItem('connecte'));
        if ($scope.usersConnect!=null) 
        { for (var i=0; i<$scope.usersConnect.length; i++)
          {
            var test=$scope.usersConnect[i].connect;
            if (test==true) {
              $rootScope.connect=true;
              $scope.connect=true;
              $rootScope.userMail=$scope.usersConnect[i].user;
              $scope.userMail=$rootScope.userMail;
            }
          }
        }
      }
      else{$scope.usersConnect=[];
        $rootScope.connect=false;
        $scope.connect=false;
        }
      }
    $scope.statutconnexion();
 $scope.$watch($scope.connect, $scope.statutconnexion);


// DECONNEXION : ****************************************************************************
  $scope.deconnexion=function(){
    var isConnected   = false;
    var admin         = false;
    $rootScope.$broadcast("connectionStatusChanged", {userMail : $scope.userMail, connect : isConnected, admin : admin});
    $rootScope.connect= false;
    $scope.connect    = false;
    $rootScope.admin  = false;
    $scope.admin      = false;
    $rootScope.adress = false;
    $scope.paye       = false;
    $scope.adress     = $rootScope.adress;
    $rootScope.livrson={modpost : 0, frport : -1, numcmde : ""}; 
    
    if(sessionStorage.getItem('connecte') && sessionStorage.getItem('connecte')!=undefined)
    {
      $scope.usersConnect=angular.fromJson(sessionStorage.getItem('connecte'));
      if ($scope.usersConnect!=null) 
      { for (var i=0; i<$scope.usersConnect.length; i++)
        {
          if ($scope.usersConnect[i].user==$scope.userMail) 
            {$scope.usersConnect[i].connect=false;}
        }
        sessionStorage.setItem('connecte', angular.toJson($scope.usersConnect));
      }
    }
    $scope.userMail='';
    $rootScope.userMail='';
  }

// LE PANIER : ******************************************************************

    $scope.countPanier=0;    
    //Récupérer nombre articles dans panier :
    if(localStorage.getItem('panier')!=null)
    {$scope.countPanier = angular.fromJson(localStorage.getItem('panier')).length;}

    //Récupérer panier :
    $scope.paniers = [];
    $scope.paniers = angular.fromJson(localStorage.getItem('panier'));

    //Récupérer inscription / connexion éventuelle :
  	$scope.username=[];
	$scope.titre=""; $scope.prenom=""; $scope.nom="";
  	if(localStorage.getItem('inscrit') && localStorage.getItem('inscrit')!=undefined){
        $scope.username=angular.fromJson(localStorage.getItem('inscrit'));
        $scope.id=$scope.username[0].id;
        
        $scope.titre=$scope.username[0].titre; 
        if($scope.titre!='M' && $scope.titre!='Mme'){$scope.titre='';}
        if($scope.titre=='M' || $scope.titre=='Mme'){$scope.titre+='.';}
        $scope.prenom=$scope.username[0].prenom; 
        $scope.nom=$scope.username[0].nom;
      }

    //Récupérer adresse éventuelle :
  	$scope.adress=$rootScope.adress;
  		$scope.adresse1=[]; 
  	if(localStorage.getItem('adresse1') && 
       localStorage.getItem('adresse1')!=undefined &&
       angular.fromJson(localStorage.getItem('adresse1'))[0].id==$scope.id &&
       $rootScope.adress==true
       )
    {
        $scope.adresse1=angular.fromJson(localStorage.getItem('adresse1')); 
        if( $scope.id==$scope.adresse1[0].id)
        {
            $scope.id=$scope.adresse1[0].id;       
            $scope.no=$scope.adresse1[0].no;
            $scope.rue=$scope.adresse1[0].rue;
            $scope.complt=$scope.adresse1[0].complt;
            $scope.cp=$scope.adresse1[0].cp;
            $scope.ville=$scope.adresse1[0].ville;
            $scope.pays=$scope.adresse1[0].pays;
            $scope.tel=$scope.adresse1[0].tel;
            $scope.adress=$rootScope.adress;
        } 
    }    
    else if($rootScope.adress==true){
      inscService.getAdrByParam($scope.id,"F")
        .then(function(data ){             
          if(data._id){  
          	console.log('ici panier>getAdrByParam F, _id='+data._id);
            $scope.id=data.id;       
            $scope.no=data.no;
            $scope.rue=data.rue;
            $scope.complt=data.complt;
            $scope.cp=data.cp;
            $scope.ville=data.ville;
            $scope.pays=data.pays;
            $scope.tel=data.tel;
            $scope.adress=$rootScope.adress;
            //stockage des données du connecté dans WebStorage:
/*            $scope.adresse1=[{
              id      	:   data._id,
              no   		:   data.no,
              rue  		:   data.rue,
              complt    :   data.complt,
              cp  		:   data.cp,
              ville 	:   data.ville,
              pays		: 	data.pays,
              tel		: 	data.tel
            }];    
            localStorage.setItem('adresse1', angular.toJson($scope.adresse1));*/
          }
        });
  	}

    $scope.statutadresse = function(){
       $scope.adresse1=[]; 
      if(localStorage.getItem('adresse1') && localStorage.getItem('adresse1')!=undefined
        && angular.fromJson(localStorage.getItem('adresse1'))[0].id==$scope.id)
      {
        $scope.adresse1=angular.fromJson(localStorage.getItem('adresse1'));      
            $scope.no=$scope.adresse1[0].no;
            $scope.rue=$scope.adresse1[0].rue;
            $scope.complt=$scope.adresse1[0].complt;
            $scope.cp=$scope.adresse1[0].cp;
            $scope.ville=$scope.adresse1[0].ville;
            $scope.pays=$scope.adresse1[0].pays;
            $scope.tel=$scope.adresse1[0].tel;
            $scope.adress=true;
            $rootScope.adress=true;
      }
    }

 //Récupérer adresse livraison éventuelle, frais de port et n° de commande :
    $scope.statutlivraison = function(){
   		$scope.frport=$rootScope.livrson.frport;
    		$scope.livr=[]; 
    	if(localStorage.getItem('livr') && localStorage.getItem('livr')[0].id &&
         $scope.adress==true)
      {
          //alert('ici');
          $scope.livr=angular.fromJson(localStorage.getItem('livr')); 
            $scope.id 			   =  $scope.livr[0].id;   
            $scope.titrel 		 =  $scope.livr[0].titrel; 
            $scope.prenoml 		 =  $scope.livr[0].prenoml;  
            $scope.noml 		   =  $scope.livr[0].noml;
            $scope.nol 			   =  $scope.livr[0].nol;
            $scope.ruel			   =  $scope.livr[0].ruel;
            $scope.compltl 		 =  $scope.livr[0].compltl;
            $scope.cpl 			   =  $scope.livr[0].cpl;
            $scope.villel 		 =  $scope.livr[0].villel;
            $scope.paysl 		   =  $scope.livr[0].paysl;
            $scope.tell 		   =  $scope.livr[0].tell;

            $scope.modpost 		=   $scope.livr[0].modpost;
            $scope.frport 		=   $scope.livr[0].frport;
            $scope.numCommde 	=   $scope.livr[0].numcmde;
            console.log('ici, dans statutlivraison, numCommde='+$scope.numCommde);
            $rootScope.livrson 	= {
            	modpost  : $scope.modpost, 
            	frport   : $scope.frport, 
            	numcmde  : $scope.numCommde
            };
            $scope.livrson = $rootScope.livrson;
       }
      else if($scope.adress==true)
      {
      	//alert('là');
        inscService.getAdrByParam($scope.id,"L")
          .then(function(data ){             
            if(data._id)
            {  
            	console.log('ici panier>statutlivraison>getAdrByParam L, _id='+data._id);
              $scope.id       =   data.id;       
              $scope.nol      =   data.no;
              $scope.ruel     =   data.rue;
              $scope.compltl  =   data.complt;
              $scope.cpl      =   data.cp;
              $scope.villel   =   data.ville;
              $scope.paysl    =   data.pays;
              $scope.tell     =   data.tel;
              $scope.titrel   =   data.titre; 
              $scope.prenoml  =   data.prenom;     
              $scope.noml     =   data.nom;  

              $scope.livrson 		= $rootScope.livrson;
              $scope.modpost 		= $scope.livrson.modpost;
              $scope.frport 		= $scope.livrson.frport;
              $scope.numCommde 	= $scope.livrson.numcmde;
              //alert('frport='+$scope.frport);
              //stockage des données du connecté dans WebStorage:
              console.log('là, dans statutlivraison, numCommde='+$scope.numCommde);
              $scope.livr=[{
                id      	:   data._id,
                titrel 	  : 	data.titre,
                prenoml 	: 	data.prenom,
                noml 		  : 	data.nom,
                nol   	  :   data.no,
                ruel 		  :   data.rue,
                compltl   :   data.complt,
                cpl  		  :   data.cp,
                villel 	  :   data.ville,
                paysl		  : 	data.pays,
                tell		  : 	data.tel,
                typel   	:  	"L",
          	    modpost	  : 	$scope.modpost,              
                frport	  : 	$scope.frport,
          	    numcmde 	: 	$scope.numCommde
              }];    
              localStorage.setItem('livr', angular.toJson($scope.livr));
            }
          });
      }
    }
    $scope.statutlivraison();
 
  $scope.annulLivraison = function(){
     $rootScope.livrson  = {
              modpost  : 0, 
              frport   : -1, 
              numcmde  : ""
            };
    $scope.livrson = $rootScope.livrson;
    localStorage.removeItem('livr');
  }
  
    //Calcul du total :
  $scope.getSsTotal = function(){
	    var sstotal = 0;
	    if($scope.paniers.length>0){
		    for(var i = 0; i < $scope.paniers.length; i++){
		        var art= $scope.paniers[i];
		        sstotal += (art.Qte * art.prix);
		    }
		    sstotal=Math.round(sstotal*100)/100;
	    }
	    return sstotal;
	}

  $scope.getTotal = function(){
	    var total = 0;
		    total = $scope.getSsTotal()+Math.max(0,$scope.frport);
	    return total;
	}	

  $scope.total=0;
  if($scope.frport>=0){$scope.total=$scope.getTotal();}
  $scope.$watch('getTotal', function(){
    $scope.total=$scope.getTotal();
  });
	
	//Modifier le panier :
	$scope.modifPanier=function() {  
		if($scope.paniers!=null)
			{nbPdPanier = $scope.paniers.length;}
		else{nbPdPanier=0;}	

		localStorage.setItem('panier', angular.toJson($scope.paniers));
      };
	
    //Supprimer une ligne :
    $scope.deleteProd = function(id){
    	$scope.paniers.splice(id,1);
		localStorage.removeItem(id);  
		localStorage.setItem('panier', angular.toJson($scope.paniers));
		    $scope.paniers = angular.fromJson(localStorage.getItem('panier')) || []; 	
    }

	//Supprimer le panier :
	$scope.deletePanier = function(){
		$scope.paniers=[];
		//localStorage.setItem('panier', angular.toJson($scope.paniers));
		localStorage.clear('panier');	 
	}

});