'use strict';

angular
.module('appPrd')
.controller("BoutiqueCtrl", function ($scope,$rootScope, $http, $window, prodService, categService, inscService) {

  //Initialisation - récupération du panier et des choix page et tri antérieurs : **********
    $scope.connect=$rootScope.connect;
    $scope.userMail=$rootScope.userMail;
    $scope.admin=$rootScope.admin;
    $scope.QteAnt = false;
    $scope.paniers   = [];
    //if(localStorage.getItem('panier')){$scope.paniers = angular.fromJson($window.localStorage.getItem('panier'));}
    $scope.choixPage = [];
    $scope.choixTri  = [];
    if(localStorage.getItem('page')){$scope.choixPage = angular.fromJson(localStorage.getItem('page'));} 
    if(sessionStorage.getItem('tri')){$scope.choixTri  = angular.fromJson(sessionStorage.getItem('tri'));}
    $scope.listlimitpage = [];
    $scope.countPanier=0;

  //Récupérer le nombre d'articles dans le panier : **************************************** 
    $scope.getNbPanier=function(){
      if(localStorage.getItem('panier')) { 
        $scope.paniers = angular.fromJson($window.localStorage.getItem('panier'));
        $scope.countPanier = $scope.paniers.length; }
      else{
        $scope.paniers = [];
        $scope.countPanier = 0; }
    }
    $scope.getNbPanier();
    //$scope.$watch('paniers', function(){ $scope.getNbPanier();});    

  // Choix de la pagination : **************************************************************
    $scope.listlimitpage={ 
      optionsPossibles:[
      {id:'1', name:  '4'},
      {id:'2', name:  '8'},
      {id:'3', name: '12'},
      {id:'4', name: '16'},
      {id:'5', name: '22'},
      {id:'6', name: '30'}],
      limitpage: {id:'2', name: '8'}
    };
    if($scope.choixPage[0] && $scope.choixPage!=[] && $scope.choixPage!=null && $scope.choixPage!=undefined){
      $scope.listlimitpage.limitpage = $scope.choixPage[0]; 
    }
    $scope.Math = window.Math;
    $scope.pageinf="0";
    $scope.pagesup=$scope.listlimitpage.limitpage.name;    

  // Choix du type de tri : ****************************************************************
    $scope.listtri={
      opttri:[
      {id:'1', name: 'Défaut',                                    valtri:'reference',       reverse: false},
      {id:'2', name: 'Nom par ordre croissant (de A à Z)',        valtri:'nom',       reverse: false},
      {id:'3', name: 'Nom par ordre décroissant (de Z à A)',      valtri:'nom',       reverse: true},
      {id:'4', name: 'Prix du plus faible au plus fort',          valtri:'prix',     reverse: false},
      {id:'5', name: 'Prix du plus fort au plus faible',          valtri:'prix',     reverse: true},
      {id:'6', name: 'Évaluation la plus forte',                  valtri:'eval',      reverse: true},
      {id:'7', name: 'Évaluation la plus faible',                 valtri:'eval',      reverse: false},
      {id:'8', name: 'Catégorie par ordre croissant (de A à Z)',  valtri:'categorie', reverse: false},
      {id:'9', name: 'Catégorie par ordre décroissant (de Z à A)',valtri:'categorie', reverse: true}],
      choixtri:{id:1, name: 'Défaut', valtri:'reference', reverse: false}
    };
    if($scope.choixTri[0] && $scope.choixTri!=[] && $scope.choixTri!=null && $scope.choixTri!=undefined){
      $scope.listtri.choixtri = $scope.choixTri[0]; 
    }

  // Récupération des produits : ***********************************************************
    $scope.produits=[];
    prodService.getProduits()
        .then(function(data){
          $scope.produits=data;
          $scope.len=$scope.produits.length;
          });
    $scope.getIndex = function(p){
      return $scope.produits.indexOf(p);
    }

  //Produit sélectionné existant déjà dans le panier ? *************************************
    $scope.djaPanier = function(index, _id){      
      $scope.QteAnt = false;
      if ($scope.paniers) 
        { for (var i=0; i<$scope.countPanier; i++)
          if($scope.paniers[i]._id==_id && $scope.paniers[i].Qte>0)
          { $scope.produits[index].Qte=$scope.paniers[i].Qte;
            $scope.QteAnt=true; }
        }
    }

  //Ajouter au panier : ********************************************************************
    var prod={};
    var page={};
    var tri={};

    $scope.addPanier=function(index) {  
      $scope.paniers=[];
      if($scope.QteAnt==false){        
        $scope.paniers = angular.fromJson($window.localStorage.getItem('panier')); 
        if($scope.paniers!=null)
        {
          $scope.countPanier = $scope.paniers.length;
          prod={id:  $scope.countPanier,
            _id   :  $scope.produits[index]._id,
            ref   :  $scope.produits[index].reference,
            nom   :  $scope.produits[index].nom,
            urlimg:  $scope.produits[index].urlimg,
            taille:  $scope.produits[index].taille,
            Qte   :  $scope.produits[index].Qte,
            prix  :  $scope.produits[index].prix 
          };
          $scope.paniers.push(prod);
        }  
        else{
          $scope.countPanier=0;    
          prod=[{id:  $scope.countPanier,
            _id   :  $scope.produits[index]._id,          
            ref   :  $scope.produits[index].reference,
            nom   :  $scope.produits[index].nom,
            urlimg:  $scope.produits[index].urlimg,
            taille:  $scope.produits[index].taille,
            Qte   :  $scope.produits[index].Qte,
            prix  :  $scope.produits[index].prix 
          }];
          $scope.paniers=prod; 
        }
        window['localStorage'].setItem('panier', angular.toJson($scope.paniers));
        //Mise à jour de countPaniers :
        $scope.countPanier = angular.fromJson($window.localStorage.getItem('panier')).length;
        //$scope.$watch('paniers', function(){$scope.getNbPanier;}); 
      }
    //$scope.setPage();  
    };

  //Menu latéral affichage et tri par catégorie :
  $scope.toggleSwitch=function(){
    $scope.montre = $scope.montre===false?true:false;
  }
    // Récupération des categories : 
    $scope.categories=[];
    categService.getCategories()
        .then(function(data){
          $scope.categories=data;
          $scope.lencateg=$scope.categories.length;
          for (var i=0; i<$scope.lencateg; i++)
          {
            $scope.categories[i].selected=false;
          }
          });
    $scope.categ={};
    $scope.categ.all=true;
    $scope.selectionCateg=[];
    $scope.uncheckAll=function(){
      $scope.selectionCateg=[];
      $scope.lencateg=$scope.categories.length;
      for (var i=0; i<$scope.lencateg; i++)
      {
        $scope.categories[i].selected=false;
      }
    };
    $scope.checkedList = function(condition, categorie){
      var lnCat= $scope.selectionCateg.length;
      if(condition){
        $scope.selectionCateg[lnCat]=categorie;
        //alert('long='+lnCat+'; selectionCateg[lnCat]='+$scope.selectionCateg[lnCat]);
      }
      else{ if(!condition){
        for(var i=0; i<lnCat; i++)
        { if ($scope.selectionCateg[i]==categorie){
            $scope.selectionCateg[i]="";
          }
        }
      }
      }
    }


  //Sauvegarde des paramètres de tri et de pagination : ************************************
    $scope.setPage=function(){
      $scope.choixPage=[];
      $scope.choixTri=[];
      page=$scope.listlimitpage.limitpage;
      tri=$scope.listtri.choixtri;
      $scope.choixPage.push(page);
      $scope.choixTri.push(tri);
        localStorage.setItem('page', angular.toJson($scope.choixPage)); //JSON.stringify
        sessionStorage.setItem('tri', angular.toJson ($scope.choixTri));  //JSON.stringify  
      $scope.$watch('choixPage', function(){angular.fromJson($window.localStorage.getItem('page'));}); 
      $scope.$watch('choixTri', function(){angular.fromJson($window.sessionStorage.getItem('tri'));});
    };
      $scope.setPage();



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
          //récupération et stockage des données du connecté dans WebStorage:
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
                      if( localStorage.getItem('adresse1') && localStorage.getItem('adresse1')!=undefined)
                      {
                        var adresse1=angular.fromJson(localStorage.getItem('adresse1')); 
                        if(id!=adresse1[0].id){
                          $rootScope.adress=false;
                          adresse1=[{}]; 
                          localStorage.setItem('adresse1', angular.toJson(adresse1));
                        }
                      }
                      $rootScope.livrson={modpost : 0, frport : -1, numcmde : ""};  
                      // si livraison existe dans localStorage ... si pas le bon id, on supprime livraison
                      if( localStorage.getItem('livr') && localStorage.getItem('livr')!=undefined)
                      {
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
                      if(msgOut.connect)
                      { $scope.showConnexion=false;      
                        console.log('Connexion réussie');
                      } 
                    } else{
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
                  console.log('Connexion refusée'); 
                }
            );

          }else{
          //Le email saisi n'existe pas :              
            msg_c=" -> email inconnu ; inscrivez-vous";
            msgOut = ({msg : msg_c, connect : isConnected, admin : admin});
            $scope.msg_c=msgOut.msg;
            $scope.connect=msgOut.connect;
            $scope.admin=msgOut.admin;
            console.log('Connexion refusée'); 
          } 
      //$scope.kon=$scope.connect;  
  
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