'use strict';

/**
 * @name appPrd
 *
 * Main module of the application.
 */
angular
.module('appPrd', [
    //'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'AngularPrint'
    //'ngTouch'
  ])

.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/boutique', {
        templateUrl: 'views/boutique.html',
        controller: 'BoutiqueCtrl',
        controllerAs: 'boutique'
      })
      .when('/detail/:id?', {
        templateUrl: 'views/detail.html',
        controller: 'DetailCtrl',
        controllerAs: 'detail'
      })
      .when('/panier/:kon?/:adrs?/:paye?', {
        templateUrl: 'views/panier.html',
        controller: 'PanierCtrl',
        controllerAs: 'panier'
      })
      .when('/connexion', {
        templateUrl: 'views/connexion.html',
        controller: 'ConnexionCtrl',
        controllerAs: 'connexion'
      })
      .when('/inscription/:ori?', {
        templateUrl: 'views/inscription.html',
        controller: 'InscripCtrl',
        controllerAs: 'inscription'
      })
      .when('/adresse', {
        templateUrl: 'views/adresse.html',
        controller: 'AdresseCtrl',
        controllerAs: 'adresse'
      })
      .when('/livraison', {
        templateUrl: 'views/livraison.html',
        controller: 'LivraisonCtrl',
        controllerAs: 'livraison'
      })
      .when('/paiement/:total?', {
        templateUrl: 'views/paiement.html',
        controller: 'PaiementCtrl',
        controllerAs: 'paiement'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/contact', {
        templateUrl: 'views/contact.html',
        controller: 'ContactCtrl',
        controllerAs: 'contact'
      })
      .when('/admin', {
        templateUrl: 'views/admin.html',
        controller: 'AdminCtrl',
        controllerAs: 'admin'
      })
      .when('/modif/:id?', {
        templateUrl: 'views/modif.html',
        controller: 'ModifCtrl',
        controllerAs: 'modif'
      })
      .when('/cgv', {
        templateUrl: 'views/cgv.html',
        controller: 'CgvCtrl',
        controllerAs: 'cgv'
      })
      .otherwise({
        redirectTo: '/'
      });
  })

.run(function($rootScope, $location){
    $rootScope.connect=false;
    $rootScope.admin=false;
    $rootScope.userMail=""; 
    $rootScope.adress=false;
    $rootScope.livrson={modpost : 0, frport : -1, numcmde : ""};    
    $rootScope.chemin=$location.path();
  })

.controller('AppCtrl', function ($scope,$rootScope, $window)
   {
      //$scope.connect=false;
      $scope.usr="";
      $scope.mp="";
      $scope.inscr=[];
      $scope.testc=false;
      $scope.connecte=[];
      $scope.connect=$rootScope.connect;
      $scope.admin=$rootScope.admin;

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
            }
          }
        }
      }
      else{$scope.usersConnect=[];
        $rootScope.connect=false;
        $scope.connect=false;
        }
      }

  //$scope.statutconnexion();
  $scope.kon=$scope.connect;
 
// CONNEXION : ******************************************************************************
  $scope.$on("connectionStatusChanged", function(){
    $scope.connect=$rootScope.connect;
    $scope.userMail=$rootScope.userMail;
    $scope.admin=$rootScope.admin;
    //alert('connectionStatusChanged : appCtrl : admin='+$rootScope.admin+', connect='+$rootScope.connect+', userMail='+$rootScope.userMail);
  });

  $scope.connect=$rootScope.connect;

})
;



