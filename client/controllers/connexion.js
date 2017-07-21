'use strict';

angular
.module('appPrd')
.controller('ConnexionCtrl', 
	function ($scope, $rootScope, $routeParams, $http, $location,
				categService, 
				prodService, 
				panierService, 
				inscService,
				commdeService) 
	{
	$scope.Math = window.Math;
	$scope.kon=false;
  $scope.adrs=false;
  if($routeParams.kon){
    $scope.kon=$routeParams.kon; 
    $scope.connect=$routeParams.kon;
    $rootScope.connect=$routeParams.kon;
  }
  else{$scope.connect=$rootScope.connect;}    
  if($routeParams.adrs){
    $scope.adrs=$routeParams.adrs;
    $scope.adress=$routeParams.adrs;
    $rootScope.adress=$routeParams.adrs;
  }
  else{$scope.adress=$rootScope.adress;}

 
 // CONNEXION : ******************************************************************************
 
  $scope.connexion=function(){
    var msg_c="";
    
    var isConnected = false;
    var admin=false;
    var msgOut = [];
    //sessionStorage.setItem('rd', angular.toJson([{rd:rd,mp:mp}]));
    //On cherche le email et on récupère le fichier 'inscrit' correspondant dans MongoDB :
    var data=inscService.getInscByParam($scope.userMail)
      .then(function(data ){  
         var valeur="", droit=0;         
         //alert("id récupéré="+data._id+" ");
          if(!data._id)
          {  
            //Le email saisi n'existe pas :   
            msg_c=" -> email inconnu ; inscrivez-vous";
            msgOut = ({msg : msg_c, connect : isConnected, admin : admin});
            $scope.msg_c=msgOut.msg;
            $scope.connect=msgOut.connect;
            $scope.admin=msgOut.admin;
            console.log('Connexion refusée -> email inconnu');
          }else{    
            //Le email saisi existe bien :       
            valeur  = data._id;
            droit   = data.valid;
            msg_c   = "email ok";

            //Transfert des données de 'inscrit' dans WebStorage:
              var inscrit=[{
                id      :   data._id,
                titre   :   data.titre,
                prenom  :   data.prenom,
                nom     :   data.nom,
                email   :   data.email,
                datnaiss:   data.datnaiss
              }];    
            localStorage.setItem('inscrit', angular.toJson(inscrit));
            var rd=rd;

            //Vérification du pdm :
            inscService.getPdmByParam(valeur)
              .then(function(response){
                $scope.admin=false;
                var rd = calcMD5($scope.mp);
                //alert('reponse connexion>getPdmByParam='+response+', rd='+rd+'droit='+data.valid);
                if(response==rd){
                  msg_c+=" -> mdp ok";
                  console.log(" connexion>getPdmByParam-> mdp ok ; droit= "+droit);
                  isConnected = true;
                  if(droit==2){
                      $scope.admin=true;
                      $rootScope.admin=true;
                  }  
                  $rootScope.connect=isConnected;
                  $rootScope.$broadcast("connectionStatusChanged", {userMail : $scope.userMail, connect : isConnected, admin : $scope.admin});
                  $rootScope.connect=true;
                  var inscrit=angular.fromJson(localStorage.getItem('inscrit'));
                  var id=inscrit[0].id;
                  var email=inscrit[0].email;
                    var inscr={user:email, id:id, pdm:rd, connect:true, admin:$scope.admin};
                    // Rajout à la liste des connectés :
                  var connecte = [];
                  if(sessionStorage.getItem('connecte') && angular.fromJson(sessionStorage.getItem('connecte')).length>0){
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
                  sessionStorage.setItem('connecte', angular.toJson(connecte));

                    // si adresse existe dans localStorage ... si pas le bon id, on supprime l'adresse
                  if( localStorage.getItem('adresse1') && localStorage.getItem('adresse1')!=undefined){
                    var adresse1=angular.fromJson(localStorage.getItem('adresse1')); 
                    if(id!=adresse1[0].id)
                    {
                      $rootScope.adress=false;
                      adresse1=[{}]; 
                      localStorage.setItem('adresse1', angular.toJson(adresse1));
                    }
                  }
                  // si livraison existe dans localStorage ... si pas le bon id, on supprime livraison
                  if( $rootScope.livrson.frport >=0 && localStorage.getItem('livr') && localStorage.getItem('livr')!=undefined){
                    var livr=angular.fromJson(localStorage.getItem('livr')); 
                    if(id!=livr.id)
                    {
                      $rootScope.livrson={modpost : 0, frport : -1, numcmde : ""}; 
                      livr=[{}]; 
                      localStorage.setItem('livr', angular.toJson(livr));
                    }
                  }

                  console.log('message retourné='+msg_c)
                  msgOut = ({msg : msg_c, connect : isConnected, admin : admin});
                  $scope.msg_c=msgOut.msg;
                  $scope.connect=msgOut.connect;
                  $rootScope.connect=$scope.connect;
                  $scope.admin=msgOut.admin;
                  if(msgOut.connect){    
                    console.log('Connexion réussie'); 
                  } 
                  //$rootScope.$apply();   
                }else{
                  var inscrit=[]; 
                  localStorage.setItem('inscrit', angular.toJson(inscrit));
                  msg_c+=" -> mdp incorrect";
                  msgOut = ({msg : msg_c, connect : isConnected, admin : admin});
                  $scope.msg_c=msgOut.msg;
                  $scope.connect=msgOut.connect;
                  
                  $scope.admin=msgOut.admin;
                  console.log('Connexion refusée -> mdp incorrect'); 
                }
              },
              function(err){ 
                console.log(" -> mdp tj pas bon");
                var inscrit=[]; 
                localStorage.setItem('inscrit', angular.toJson(inscrit));
                msg_c+=" -> mdp inconnu";
                msgOut = ({msg : msg_c, connect : isConnected, admin : admin});
                $scope.msg_c=msgOut.msg;
                $scope.connect=msgOut.connect;
                $scope.admin=msgOut.admin;
                console.log('Connexion refusée -> mdp inconnu'); 
              }
            );
            // Fin Vérification du pdm.
          }
      $scope.kon=$scope.connect;  
      //$location.url('/panier/:'+$scope.kon);
      //$rootScope.$apply();
    });
  };

// PRE-INSCRIPTION - vérification de la validité du email - *********************************
  $scope.msg="-";
  $scope.inscription=function(){
    if($scope.usr.indexOf("@",1)==-1){
        $scope.msg="Ce n'est pas une adresse email valide";
    }else{
      $scope.msg="";
      $scope.testc=true;
    }
      //$scope.user1=$scope.usermail.slice(0,$scope.usermail.indexOf("@",1));
      //$scope.user2=$scope.usermail.slice($scope.usermail.indexOf("@",1)+1,$scope.usermail.length);

  //test cet email existe t-il déjà ?   
      var result={};   
    result=inscService.getInscByParam($scope.usr)
      .then(function(data){         
        if(data._id && data._id!="0"){
          $scope.msg="Cette adresse email existe déjà"; 
          //alert($scope.msg);
          $scope.testc=false;}
        else{
          $scope.msg="Adresse email créée";
          if($scope.testc==true){
            $scope.showConnexion=false;
            sessionStorage.setItem('email', angular.toJson($scope.usr));
            $window.location.href='/#/inscription/1';
          }
        }
      });
  }

});