'use strict';

angular
.module('appPrd')
.controller('DetailCtrl',  function($scope, $rootScope, $routeParams, $http, categService, prodService, avisService, inscService) {

  //Récupérer nombre articles dans panier : ***********************
    $scope.countPanier=0; 
    $scope.test=true;
    $scope.getNbPanier=function(){
      if(localStorage.getItem('panier')){
        $scope.paniers = angular.fromJson(localStorage.getItem('panier'));
        $scope.countPanier = $scope.paniers.length;
      }else{
        $scope.paniers = [];
        $scope.countPanier = 0;
      }
    }
    $scope.getNbPanier();
    //$scope.$watch('paniers', $scope.getNbPanier());  

  //Récupération des données du produit : *********************** 	
      $scope._id=$routeParams.id; 
      var valeur=$scope._id;
      $scope.detailData={};
      $scope.QteAnt=0;
      $scope.nbAvis =0;
      
      prodService.getProdByParam(valeur)
      	.then(function(data){
      		$scope.detailData=data;
          $scope.detailData.Qte=1;
          //Récupération des avis :
          $scope.nbAvis = $scope.detailData.avis.length;
          var sNote=0;
          for (var i=0; i<$scope.nbAvis ; i++)
          {
            sNote+=$scope.detailData.avis[i].note;
          }
          if($scope.nbAvis >0){
            $scope.prodRating=Math.round(sNote/$scope.nbAvis *10)/10+0.5;
          }
          else{ $scope.prodRating=0;}
          //incrémentation de l'évaluation :
          var prod=data;
          //alert('eval='+prod.eval);
          prod.eval++;
          console.log('ici, dans detail.js, valeur='+valeur+' et prod.eval='+prod.eval);
          prodService.updateProduit(valeur, prod);
        })
        .then(function(){
          if ($scope.paniers)      
          { for (var i=0; i<$scope.countPanier; i++)
            {
            //alert('ici, i='+i+';'+$scope.paniers[i]._id+'=?'+$scope.detailData._id+';'+$scope.paniers[i].Qte);
              if($scope.paniers[i]._id==$scope.detailData._id && $scope.paniers[i].Qte>0)
              { 
                $scope.detailData.Qte=$scope.paniers[i].Qte;               
                $scope.QteAnt=1; 
              }  
            }
          }
      	}) ; 


  //Identification : ********************************************

    $scope.connect=$rootScope.connect;
    $scope.user=$rootScope.userMail;    

  //Ajouter au panier : ******************************************
    var prod={};
    $scope.addPanier=function() {  
      $scope.paniers=[];
      if($scope.QteAnt==0){        
        $scope.paniers = angular.fromJson(localStorage.getItem('panier'));  
        if($scope.paniers!=null)
          {
            $scope.countPanier = $scope.paniers.length;
            prod={id  :  $scope.countPanier,
              _id     :  $scope.detailData._id,
              ref     :  $scope.detailData.reference,
              nom     :  $scope.detailData.nom,
              urlimg  :  $scope.detailData.urlimg,
              taille  :  $scope.detailData.taille,
              Qte     :  $scope.detailData.Qte,
              prix    :  $scope.detailData.prix
            };
           $scope.paniers.push(prod); 
          }
        else{
          $scope.countPanier = 0;
           prod=[{id  :  $scope.countPanier,
              _id     :  $scope.detailData._id,
              ref     :  $scope.detailData.reference,
              nom     :  $scope.detailData.nom,
              urlimg  :  $scope.detailData.urlimg,
              taille  :  $scope.detailData.taille,
              Qte     :  $scope.detailData.Qte,
              prix    :  $scope.detailData.prix
            }];
           $scope.paniers=prod;
          }   
        localStorage.setItem('panier', angular.toJson($scope.paniers));
        $scope.getNbPanier();
        $scope.QteAnt=2;
      }
    };

  //Rating 5 étoiles : *******************************************
    //$scope.prodRating=4.2;  
    $scope.toggle=false;
    $scope.currentRating=0;
    $scope.rates=[1,2,3,4,5];
    $scope.mouseover=function(toggle, rate){
      if(!toggle){$scope.currentRating=rate}
    }

  //Ajouter un avis : ********************************************
      
    $scope.avi=[];   
    $scope.envoiAvi=function(){     
      $scope.prodRating=(($scope.prodRating*$scope.nbAvis)+$scope.currentRating)/($scope.nbAvis+1);
      $scope.nbAvis++;
      $scope.statutconnexion();
      if($scope.user==""){
        console.log('1'+$rootScope.userMail );
        $scope.user=$rootScope.userMail; 
      }
      if($scope.user){
        console.log('2'+$scope.user );
        $scope.date = new Date();
        $scope.avi={
          idprod  :   $scope.detailData._id,
          nom     :   $scope.detailData.nom,
          urlimg  :   $scope.detailData.urlimg,
          taille  :   $scope.detailData.taille,
          prix    :   $scope.detailData.prix,
          note    :   $scope.currentRating,
          textavi :   $scope.aviPlus,
          user    :   $scope.user,
          date    :   $scope.date,
          valid   :   0
        };
          avisService.insertAviProv($scope.avi)
            .then(function(response) {
                  $scope.currentRating = 0; // clear the form
                  $scope.aviPlus="";
                  $scope.addAvi=false;
                  console.log(prod);
                $scope.produits=response;
            });
      }
    };
  

  //Mise à jour évaluation du produit : ***************************




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
              $scope.user=$rootScope.userMail; 
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

// CONNEXION : ******************************************************************************

  $scope.$on("connectionStatusChanged", function(){
  $scope.connect=$rootScope.connect;
  $scope.userMail=$rootScope.userMail;
  $scope.admin=$rootScope.admin;
  //alert('connectionStatusChanged : admin='+$rootScope.admin+', connect='+$rootScope.connect+', userMail='+$rootScope.userMail);
  });

    $scope.connexion=function(){
      var msg_c="";
      
      var isConnected = false;
      var admin=false;
      var msgOut = [];
      //sessionStorage.setItem('rd', angular.toJson([{rd:rd,mp:mp}]));
      var data=inscService.getInscByParam($scope.userMail)
        .then(function(data ){  
           var valeur="", droit=0; 
           
           //alert("id récupéré="+data._id+" ");
              //Le email saisi existe bien :                    
            if(data._id){         
                valeur=data._id;
                droit=data.valid;
            msg_c="email ok";
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

                        $rootScope.adress=false; 
                        // si adresse existe dans localStorage ... si pas le bon id, on supprime l'adresse
                      if( localStorage.getItem('adresse1') && localStorage.getItem('adresse1')!=undefined){
                          var adresse1=angular.fromJson(localStorage.getItem('adresse1')); 
                            if(id!=adresse1[0].id){
                              adresse1=[{}]; 
                              localStorage.setItem('adresse1', angular.toJson(adresse1));
                            }
                        }

                        $rootScope.livrson={modpost : 0, frport : -1, numcmde : ""};  
                      // si livraison existe dans localStorage ... si pas le bon id, on supprime livraison
                        if( localStorage.getItem('livr') && localStorage.getItem('livr')!=undefined){
                          var livr=angular.fromJson(localStorage.getItem('livr')); 
                            if(id!=livr.id){
                              livr=[{}]; 
                              localStorage.setItem('livr', angular.toJson(livr));
                            }
                      }
                      console.log('message retourné='+msg_c)
                      msgOut = ({msg : msg_c, connect : isConnected, admin : admin});
                  $scope.msg_c=msgOut.msg;
                  $scope.connect=msgOut.connect;
                  $scope.admin=msgOut.admin;
                if(msgOut.connect){$scope.showConnexion=false;      
                console.log('Connexion réussie'); } 
                      
              }
                      else{
                          var inscrit=[]; 
                          localStorage.setItem('inscrit', angular.toJson(inscrit));
                          msg_c+=" -> mdp incorrect";
                          console.log(" -> mdp pas bon");
                          msgOut = ({msg : msg_c, connect : isConnected, admin : admin});
                          $scope.msg_c=msgOut.msg;
                    $scope.connect=msgOut.connect;
                    $scope.admin=msgOut.admin;
                  console.log('Connexion refusée'); 
                      }
                  }
                    ,function(err){ console.log(" -> mdp tj pas bon");
                      var inscrit=[]; 
                      localStorage.setItem('inscrit', angular.toJson(inscrit));
                      msg_c+=" -> mdp inconnu";
                        msgOut = ({msg : msg_c, connect : isConnected, admin : admin});
                        $scope.msg_c=msgOut.msg;
                  $scope.connect=msgOut.connect;
                  $scope.admin=msgOut.admin;
                console.log('Connexion refusée'); 
                    }
              );

            }
            //Le email saisi n'existe pas :    
              else{msg_c=" -> email inconnu ; inscrivez-vous";
                  msgOut = ({msg : msg_c, connect : isConnected, admin : admin});
                  $scope.msg_c=msgOut.msg;
              $scope.connect=msgOut.connect;
              $scope.admin=msgOut.admin;
            console.log('Connexion refusée'); 
              } 
        $scope.kon=$scope.connect;  
    
          });
      };
// PRE-INSCRIPTION - vérification de la validité du email - *********************************
  $scope.msg="-";
  $scope.inscription=function(){
    if($scope.usr.indexOf("@",1)==-1){
        $scope.msg="Ce n'est pas une adresse email valide";}
    else{
      $scope.msg="";
      $scope.testc=true;}
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
            $window.location.href='/#/inscription/0';
          }
        }
      });
  }

// DECONNEXION : ****************************************************************************
  $scope.deconnexion=function(){
    var isConnected = false;
    var admin=false;
    $rootScope.$broadcast("connectionStatusChanged", {userMail : $scope.userMail, connect : isConnected, admin : admin});
    $rootScope.connect=false;
    $scope.connect=false;
    $rootScope.admin=false;
    $scope.admin=false;
    
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

});