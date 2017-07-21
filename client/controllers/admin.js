'use strict';

/**
 * @ngdoc function
 * @name appPrd.controller:AdminCtrl
 * @description
 * # AdminCtrl
 * Controller of the appPrd
 */
angular
.module('appPrd')
.controller('AdminCtrl', function (
      $scope,
      $http, 
      $routeParams, 
      $window,
      $rootScope, 
      categService, 
      prodService, 
      avisService,
      commdeService,
      inscService
      ) 
{
      
	$scope.formData={};
    $scope.formData = {etat:1};
    $scope.stylRef = {'color':'black'};
    $scope.stylPrix = {'color':'black'};
    $scope.stylCateg = {'background-color':'white'};
    $scope.Math = window.Math;
    $scope.comm=false;
    $scope.shAvis=false;
    $scope.creerProd=false;

    $scope.aujui = new Date();


  //Identification : *************************************
    $scope.admin=$rootScope.admin;
    var connecte = [];
    if( sessionStorage.getItem('connecte') &&
      angular.fromJson(sessionStorage.getItem('connecte')).length>0)
      {
        connecte=angular.fromJson(sessionStorage.getItem('connecte'));
        var lenCon = angular.fromJson(sessionStorage.getItem('connecte')).length;
          for (var i = 0; i<lenCon ; i++)
          {
            var testc=connecte[i].connect;
            var testa=connecte[i].admin;
            if (testc && testa) {
              $rootScope.connect=true;
              $rootScope.admin=true;            
              $scope.admin=true;
            }
          }
        }
        else{$window.location.href='/';}


  //Catégories :  ****************************************
    $scope.showCateg={'visibility':'hidden'} ;
      $scope.nvCateg={};
      $scope.nvCateg.libelle="";
      var countCategories=0;
    $scope.showCategorie=function(){ 
       $scope.showCateg={'visibility':'visible'} ;
    };
  
    categService.getCategories()
        .then(function(data){
          $scope.categories=data;
          $scope.countCategories = data.length;
          });

    $scope.addCategorie=function(countCategories) {  
        var nvCateg=$scope.nvCateg.libelle;
        var dataCateg={"libelle": nvCateg};
        categService.insertCategorie(dataCateg)
              .then(function(response){
                $scope.categories=response;
                $scope.showCateg={'visibility':'hidden'} ;})
              .catch(function(response){
                console.log('echec envoi des données'+response);
                $scope.showCateg={'visibility':'hidden'} ;});
      };

    $scope.supprCategorie=function(categorie){
        //Doit tester au préalable si la categorie a déjà été utilisée ou non
        categService.deleteCategorie(categorie._id)
                  .then(function(response) {
                    $scope.categories=response;;
                  });  
      };  

//PRODUITS : ***********************************************  
      $scope.produits = {};

  // Lecture : ****************************
    prodService.getProduits()
          .then(function(data){
            $scope.produits=data;
      });
  // Suppression : ****************************
    $scope.supprProduit=function(produit){
        prodService.deleteProduit(produit._id)
                  .then(function(response) {
                    $scope.produits=response;;
                  });
      };

  // Création : ****************************      
      $scope.date = new Date();
      var prod=[];
    $scope.addProduit=function(){
    	if(!$scope.formData.reference){$scope.stylRef = {'color':'red'};}
    	if(!$scope.formData.prix){$scope.stylPrix = {'color':'red'};}
    	if(!$scope.formData.categorie){$scope.stylCateg = {'background-color':'#F99'};
    	}
      if($scope.formData.reference && $scope.formData.prix && $scope.formData.categorie){
      var prod={
            "nom": $scope.formData.nom,
            "urlimg": $scope.formData.urlimg,
            "categorie": $scope.formData.categorie,
            "taille": $scope.formData.taille,
            "reference": $scope.formData.reference,
            "descCourt": $scope.formData.descCourt,
            "descLong": $scope.formData.descLong,
            "prix": $scope.formData.prix,
            "stock": $scope.formData.stock,
            "poids": $scope.formData.poids,
            "etat": $scope.formData.etat,
            "eval": 0,
            "avis": [],
            "date": $scope.date
          };
        
        prodService.insertProduit(prod)
        	.then(function(response) {
                $scope.formData = {}; // clear the form
                $scope.formData.etat = 1;
                $scope.urlimg="";
                console.log(prod);
          		$scope.produits=response;            
      		});  
      }         
    };
//COMMANDES : **************************************************************
      $scope.commdes=[];
      $scope.nbCommdes=0;
      var statuts=[1,2,3,4,5];
      
    commdeService.getCommde(statuts)
        .then(function(data){
          //alert("len="+data.length );
          console.log('data=',data);
          $scope.commdes=data;
          $scope.nbCommdes=data.length;
          for (var c=0; c<$scope.nbCommdes; c++){
            var nbp = $scope.commdes[c].panier.length;
            var lv=Math.max(0, 15-nbp);
            $scope.commdes[c].lignesVides=[];         
            for (var l=0; l<lv; l++){
            $scope.commdes[c].lignesVides[l]=l;
        	}
            var sum=0;
            for(var p=0; p<nbp; p++){
              sum+=$scope.commdes[c].panier[p].Qte*$scope.commdes[c].panier[p].prix;
            }
            $scope.commdes[c].sstotal=sum;
            $scope.commdes[c].total=sum+$scope.commdes[c].frport;
            switch($scope.commdes[c].modpost){
              case 1:
                $scope.commdes[c].msEnvoi="Envoi par Mondial-Relay";
                break;
              case 2:
                $scope.commdes[c].msEnvoi="Envoi en Colissimo par la poste";
                break;
              default:
                $scope.commdes[c].msEnvoi="Envoi en Lettre-Suivie par la poste";            
            }
            switch($scope.commdes[c].modRegl){
              case 1:
                $scope.commdes[c].msRegl="carte bancaire";
                break;
              case 2:
                $scope.commdes[c].msRegl="virement compte Paypal";
                break;
              case 3:
                $scope.commdes[c].msRegl="virement bancaire";
                break;
              default:
                $scope.commdes[c].msRegl="chèque";            
            }           
            if($scope.commdes[c].frport==0){
                $scope.commdes[c].msFrport="Offerts";
            }else{
                $scope.commdes[c].msFrport=$scope.commdes[c].frport+" €";              
            }
            $scope.commdes[c].poids=200;
            $scope.commdes[c].toggleIBC=false;
            $scope.commdes[c].toggleIF=false;
            $scope.commdes[c].toggleIBL=false;
          }
          $scope.commdes.showEtat=0;
    });

    //Recept paiement commande :
    $scope.payeCmmde = function(commande){
      var id = commande._id;
      commande.statut=2;     
      commdeService.updateCommde(id, commande);     
    };

    //Préparation commande :
    $scope.prepCmmde = function(commande){
      var id = commande._id;
      commande.statut=3; 
      console.log('comde=',commande)  ;  
      commdeService.updateCommde(id, commande);     
    };

    //Départ livraison commande :
    $scope.depLivCmmde = function(commande){
      var id = commande._id;
      commande.statut=4;     
      commdeService.updateCommde(id, commande);     
    };

    //Reception commande :
    $scope.recLivCmmde = function(commande){
      var id = commande._id;
      commande.statut=5;     
      commdeService.updateCommde(id, commande);     
    };

    //Archivage commande :
    $scope.archCmmde = function(commande){
      var id = commande._id;
      commande.statut=9;     
      commdeService.updateCommde(id, commande);     
    };

    //Suppression commande :
    $scope.suppCmmde = function(commande){
      var id = commande._id;
      commande.statut=0;     
      commdeService.updateCommde(id, commande);     
    };   

//AVIS : ******************************************************************* 
      $scope.avis=[];
      $scope.nbavis=0;

  // Lecture avis entrant: ***********************
      avisService.getAvis()
        .then(function(data){
          $scope.avis=data;
          $scope.nbavis=data.length;
        })

  // Suppression avis entrant: *******************
    $scope.suppr=function(index){
        var id=$scope.avis[index]._id;
        avisService.deleteAvi(id)
          .then(function(response){
            $scope.avis=response;
            $scope.nbavis=response.length;
          });
      }

  // Modification / validation : *****************
  // push avis sortant et update produit : *******
        $scope.avisplus=[];
    $scope.valid=function(index){

        var idprod=$scope.avis[index].idprod;
            
        //alert('jq là ça va ; idprod='+idprod);    

        prodService.getProdByParam(idprod)
          .then(function(data){
            var prod=[]; 
            var id=$scope.avis[index]._id;
            prod=data;
            var len=prod.avis.length;
            console.log('ici, nom='+prod.nom+', user='+$scope.avis[index].user+' et len='+len+'avis');
            
                var avi={
                "user"    :   $scope.avis[index].user,
                "note"    :   $scope.avis[index].note,
                "textavi" :   $scope.avis[index].textavi,
                "date"    :   $scope.avis[index].date
              };  
            if(len==0){
              prod.avis[0]=avi;
              console.log('il y a maintenant'+prod.avis.length+' avis pour ce produit : user='+prod.avis[0].user+' id='+id);              
            }
            else{            
              prod.avis.push(avi);
              console.log('il y a maintenant'+prod.avis.length+' avis pour ce produit')
            }
            //alert('nom='+prod.nom+'user='+prod.avis[0].user+' ; note='+prod.avis[0].note+' ; textavi='+prod.avis[0].textavi+' ; date='+prod.avis[0].date);
            prodService.updateProduit(idprod,prod)})
            .then(function(response){
              var id=$scope.avis[index]._id;
                  avisService.deleteAvi(id); 
            })
            .then(function(){
               avisService.getAvis()
              .then(function(data){
                $scope.avis=data;
                $scope.nbavis=data.length;
                alert ('nbavis='+$scope.nbavis);
              });
            });
      
    };  

// CLIENTS ET DROITS : *******************************************************
    inscService.getInsc()
      .then(function(data){
        $scope.clients=data;
        $scope.nbclients=data.length;
      })
    $scope.modifDroits = function(client){
      var id=client._id;
      inscService.updateInsc(id,client)
      .then(function(response){
      	inscService.getInsc()
	      .then(function(data){
	        $scope.clients=data;
	      });
      });
    }

// FONCTIONS DIVERSES : ******************************************************
    //fonction regex / nom : ******************************
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

      //fonction compare >prix, >stock ... :
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
      }

      //fonction imprimer :    
    $scope.imprimer = function(divName){

      var printContents = document.getElementById(divName).innerHTML;
      var originalContents = document.body.innerHTML;      

      if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
          var popupWin = window.open('', '_blank', 'width=600,height=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
          popupWin.window.focus();
          popupWin.document.write('<!DOCTYPE html><html><head>' +
              '<link rel="stylesheet" type="text/css" href="print.css" />' +
              '</head><body onload="window.print()"><div class="reward-body">' + printContents + '</div></html>');
          popupWin.onbeforeunload = function (event) {
              popupWin.close();
              return '.\n';
          };
          popupWin.onabort = function (event) {
              popupWin.document.close();
              popupWin.close();
          }
      } else {
          var popupWin = window.open('', '_blank', 'width=800,height=800');
          popupWin.document.open();
          popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</html>');
          popupWin.document.close();
      }
      popupWin.document.close();

      return true;
  }

});
