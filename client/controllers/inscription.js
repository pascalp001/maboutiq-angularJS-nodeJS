'use strict';

angular
.module('appPrd')
.controller('InscripCtrl', 
	function ($scope, $rootScope, $routeParams, $window, $http, categService, prodService, panierService, inscService) {
	    $scope.Math = window.Math;

	//Récupération de l'article sélectionné : ************************************************
	$scope.usermail="";
  	if(sessionStorage.getItem('email') && sessionStorage.getItem('email')!=undefined){
        $scope.usermail=angular.fromJson(sessionStorage.getItem('email'));}
    
    $scope.ori=0;
    $scope.ori=$routeParams.ori;
    $scope.maClasse="";
    if($scope.ori==0){$scope.maClasse="inscrpt1";}
    if($scope.ori==1){$scope.maClasse="inscrpt2";}
    $scope.prenom="";
    $scope.nom="";
    $scope.mp="";
    $scope.titre="M";
    
    //Date de naissance : *******************************************************************
    //jour:
    $scope.choixJour=[];
    $scope.listjour={optjour:[{id:'1', name: '1'}], choixjour:{id:'1', name: '1'}};   
    var elt=[];
      for (var i=2; i<32; i++){
      	elt[i]={id:'0', name: '0'};

      	elt[i]['id']=i; elt[i]['name']=i;
      	$scope.listjour.optjour.push(elt[i]);
      }
    //Récupération du jour saisi dans $scope.listjour.choixjour.name
	//Récupération du jour stocké dans choixJour[0]
    if($scope.choixJour[0] && $scope.choixJour!=[] && $scope.choixJour!=null && $scope.choixJour!=undefined){
      $scope.listjour.choixjour = $scope.choixJour[0]; 
    }
    //mois:
    $scope.choixMois=[];
    $scope.listmois={optmois:[{id:'1', name: '1'}], choixmois:{id:'1', name: '1'}};   
    var elt=[];
      for (var i=2; i<13; i++){
      	elt[i]={id:'0', name: '0'};

      	elt[i]['id']=i; elt[i]['name']=i;
      	$scope.listmois.optmois.push(elt[i]);
      }
	//Récupération du mois saisi dans $scope.listmois.choixmois.name
	//Récupération du mois stocké dans choixMois[0]
    if($scope.choixMois[0] && $scope.choixMois!=[] && $scope.choixMois!=null && $scope.choixMois!=undefined){
      $scope.listan.choixmois = $scope.choixMois[0]; 
    }
    //année:
    $scope.choixAn=[];
    $scope.listan={optan:[{id:'1', name: '2010'}], choixan:{id:'21', name: '1990'}};   
    var elt=[];
      for (var i=2; i<90; i++){
      	elt[i]={id:'0', name: '0'};

      	elt[i]['id']=i; elt[i]['name']=2011-i;
      	$scope.listan.optan.push(elt[i]);
      }
    //Récupération de l'année saisi dans $scope.listan.choixan.name
	//Récupération de l'année stockée dans choixAn[0]
    if($scope.choixAn[0] && $scope.choixAn!=[] && $scope.choixAn!=null && $scope.choixAn!=undefined){
      $scope.listan.choixan = $scope.choixAn[0]; 
    }


    //Inscription : ************************************************************************
    $scope.listQuest={optionsQuest:[
      {id:'1',name:'Quel est le nom de votre animal préféré ?'}, 
      {id:'2',name:'Quelle est le nom de jeune-fille de votre mère ?'},
      {id:'3',name:'Quel est le prenom de votre meilleur ami ?'},
      {id:'4',name:'Quel était le nom de votre professeur préféré ?'}],
      question: {id:'2',name:'Quelle est le nom de jeune-fille de votre mère ?'}
    };

    $scope.inscription=function(){
    	$scope.rd = calcMD5($scope.mp);

    	//transfert des données du nouvel inscrit dans MongoDB:
    	var insc=[];     	
    	$scope.date = new Date();
        insc = {
    		"titre": $scope.titre,
    		"prenom": $scope.prenom,
    		"nom": $scope.nom,
    		"email": $scope.usermail,
    		"datnaiss": $scope.listjour.choixjour.name+'/'+$scope.listmois.choixmois.name+'/'+$scope.listan.choixan.name,
    		"date": $scope.date,
    		"valid":1
    	}; 
    	var pdm=[];
    	$scope.user =[];
  		inscService.insertInsc(insc)
  			.then(function(res){
	  			var result={};
          //récupération de l'id d'inscription :
	  			result=inscService.getInscByParam($scope.usermail)
	  				.then(function(data){
	  					//stockage pdm dans MongoDB :
		  				pdm = {"id" : data._id, "dpm": $scope.rd };
		  				inscService.insertPdm(pdm); 
              //stockage clé d'oubli :
              var oubli=[{
                "id"        :   data._id,
                "question"  :   $scope.listQuest.question,
                "reponse"   :   $scope.reponse,
                "mp"        :   $scope.mp
              }];
              /*  ********** A TERMINER inscService.insertOubli(oubli) *************** */

		  				//stockage du nouvel inscrit dans WebStorage:
    					$scope.inscrit=[{
    						id 		    : 	data._id,
    						titre	    : 	data.titre,
				    		prenom	  : 	data.prenom,
				    		nom	    	: 	data.nom,
				    		email	    : 	data.email,
				    		datnaiss  : 	data.datnaiss
				    	}];   	 
				    	localStorage.setItem('inscrit', angular.toJson($scope.inscrit));				
	  				})
            .then(function(){
              console.log('Inscription réussie'); 
              //Connexion :   
              /*  $rootScope.$apply(function(){ $rootScope.connect=true; $scope.connect=true; });*/
              $rootScope.connect=true;
              var admin=false;
              $rootScope.$broadcast("connectionStatusChanged", {userMail : $scope.usermail, connect : true, admin : admin});
              $rootScope.adress=false;
              $scope.connect=$rootScope.connect;
              $rootScope.userMail=$scope.usermail;
              $scope.kon=$scope.connect;

              $scope.inscr={user:$scope.usermail, id: $scope.id, pdm:$scope.rd, connect:$rootScope.connect};
              var connecte = [];
              if(sessionStorage.getItem('connecte') && angular.fromJson(sessionStorage.getItem('connecte')).length>0)
              {
                connecte=angular.fromJson(sessionStorage.getItem('connecte'));
                var lenCon = angular.fromJson(sessionStorage.getItem('connecte')).length;
                for (var i = 0; i<lenCon ; i++)
                {
                  connecte[i].connect=false;
                }
                connecte.push(inscr);
              }
              else{connecte[0]=inscr;}
              console.log(connecte);        
              sessionStorage.setItem('connecte', angular.toJson($scope.connecte));
             
            // on supprime l'adresse existante éventuelle
              var adresse1=[{}]; 
              localStorage.setItem('adresse1', angular.toJson(adresse1));
              $rootScope.adress=false; 
            
            //  on supprime livraison existante éventuelle
              livr=[{}]; 
              localStorage.setItem('livr', angular.toJson(livr));
              $rootScope.livrson={modpost : 0, frport : -1, numcmde : ""}; 
              
              console.log('Connexion réussie'); 
              // Souci pour convertir showConnection en 'se déconnecter' sans reload
            });
	  		});	 
     

        //Redirection :
        if($scope.ori==0){$scope.redirect='#/boutique';}
        if($scope.ori==1){$scope.redirect='#/panier/:kon';}
    
    };

});