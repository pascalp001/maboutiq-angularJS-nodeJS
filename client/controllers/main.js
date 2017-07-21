'use strict';

angular
.module('appPrd')
.controller('MainCtrl', function ($scope, $timeout, $rootScope,$window, inscService)
{ 	
    $scope.connect=$rootScope.connect;
    $scope.userMail=$rootScope.userMail;
	$scope.admin=$rootScope.admin;
	$scope.$on("connectionStatusChanged", function(){
	  	$scope.connect=$rootScope.connect;
	  	$scope.userMail=$rootScope.userMail;
	  	$scope.admin=$rootScope.admin;
	  	//alert('connectionStatusChanged : admin='+$rootScope.admin+', connect='+$rootScope.connect+', userMail='+$rootScope.userMail);
	});


// FABRICATION DE LA COQUILLE : *************************************************************
 		$scope.Math = window.Math;
 		$scope.valInit=function(){
			$scope.nbpas=124;
			$scope.nbsp=9;
			$scope.hauteur=170;
			$scope.gdD=50;
			$scope.ptd=75;
			$scope.dist=1.0;
			$scope.inclinX=0;
			$scope.inclinY=0;
			$scope.inclinZ=0;
		}

		$scope.valInit();
		$scope.connect=false;

	  			//coquillage :
	  	$scope.cagouille = function(){
	  //paramètres principaux :
			  var npas=$scope.nbpas; //nombre d'anneaux par spire
			  var nbspir=$scope.nbsp; //nombre de spires
			  var zmax=$scope.hauteur; //hauteur maximale
			  var Do=Math.pow($scope.gdD,3)/3000+10; //grand diamètre		  
			  var pDwo=$scope.ptd; //petit diamètre
			  var min=3; //diamètre minimum de base
			  var zo=50; //ecart du plafond de base
			  var mxo=160; //ecart de la gauche
			  var inclx=$scope.inclinX;
			  var incly=$scope.inclinY;
			  var inclz=-$scope.inclinZ;
			  var distp=Math.pow($scope.dist, $scope.nbsp*($scope.nbsp-1)/2);

	  //paramètres déduits :
//			  var pas=3.1415*2/npas; //angle de chaque pas
			  var zo = zo + Math.round(Math.max(0 , 30-zmax/5));
			  var totpas=npas*nbspir; //nombre total d'anneaux à créer
			  var pDho=pDwo; //cercle =>hauteur anneau = largeur 
			  var beta=inclx*3.1415*2/360; var cosb=Math.cos(beta); var sinb=Math.sin(beta); //Inclinaison droite-gauche - gèré finalt par rotate
			  var gama=incly*3.1415*2/360; var cosg=Math.cos(gama); var sing=Math.sin(gama); //Inclinaison avant-arrière
			  var delta=inclz*npas/360;
			  //var min=Math.max(1,Math.round(pDwo/Math.pow(1.30,nbspir)),Math.round(Math.sqrt(zmax*zmax + Do*Do)/((1-Math.pow(1.32,nbspir))/(1-1.32))));
	  
	  //Calcul du rapport d'une spire à une autre :
	  //L'anneau de la spire n à son diamétre = spire précédente multiplié par k x dist
	  		  var diagomax = Math.sqrt(zmax*zmax + Do*Do);
	  		  var k=1, kp=1, kv=1.32, kv1=1.32, kv2=1.32, toler1=500, toler2=300;
	  		  //Calcul 1 : à nbspir, diamètre = pDwo	  		  
	  		  var kv1 = Math.pow(pDwo/min/distp, 1/nbspir);	  		  
	  		  //Calcul 2 : à nbspir, hauteur = diagomax
	  		  for (var i=1; i<1000 ; i++){
	  		  	var ki=1+i/1000, kj=1+(i-1)/1000;
	  		  	var kpi=Math.pow(ki,nbspir), kpj=Math.pow(kj,nbspir);
	  		  	if((distp*kpi-1-diagomax/min*(ki-1)>0 && distp*kpj-1-diagomax/min*(kj-1)<0)
	  		  		|| (distp*kpi-1-diagomax/min*(ki-1)<0 && distp*kpj-1-diagomax/min*(kj-1)>0)){
	  		  		kv2 = ki; 
	  		  	}
	  		  }
	  		
	  		  //Composition entre kv1 et kv2 :
	  		  $scope.pct=0.5;
	  		  if($scope.dist<1){$scope.pct=Math.min(1,0.5+0.25/$scope.dist)}
	  		  if($scope.dist>1){$scope.pct=Math.max(0,0.5-0.25*$scope.dist)}
	  		  kv=$scope.pct*kv1+(1-$scope.pct)*kv2;
				//alert('kv1='+kv1+'kv2='+kv2);
	  //paramètres annexes :
			  var Eo = 5; var eta= 2; var HW = 1; var cosa=1; 
			  var t=0; var pdiam = min; var z= min/2 ; var gdiam=min/2; var zt=0;
			  var pdiami1 = min, pdiami2=pdiami1, pdiamH=pdiami1, pdiamV=pdiami1, zi1=min/2, zi2=zi1, npasi=10;
			  $scope.stopspire=false;

	  //Fonction principale de calcul :
		 	$scope.zzz=function(){		
		 		//Boucle pour l'ensemble des spires :
		 		var kvi=kv, zzi=0, i=0;
		 		while(i<nbspir && $scope.stopspire==false)
			    //for (var i=0 ;i<nbspir;i++)
			    {	
			    	pdiami2=pdiami1*kvi; //diametre(n+1) = kv x diamètre(n) x dist
			    	zi2=zi1+pdiami1/2+pdiami2/2; //écart de hauteur entre (n+1) et (n)
			    	//Nombre de pas d'une spire ( un tour) :
    				npasi = parseInt(Math.round(10+Math.max(0,(npas-10))*pdiami2/pDwo));
    				//Angle de chaque pas :
    				var pas=3.1415*2/npasi; 
    				//hauteur atteinte :
    				
    				if(pdiami2<=pDwo && zi2<=diagomax)
    				{
	    				//Boucle pour une spire :
				    	for(var dt=0;dt<npasi; dt++)
				    	{
				      		var t=dt+i*npasi;
				    		var alpha = -pas*(dt-delta+2); var sina = Math.sin(alpha); var cosa=Math.cos(alpha); 

				    		//Diamètre du tube (dimensions H et V de l'ellipse) :
				    		pdiam=pdiami1*(npasi-dt)/npasi+pdiami2*dt/npasi;
				    		pdiamH=parseInt(pdiam*Math.abs(cosa));
				    		pdiamV=parseInt(pdiam*(Math.abs(cosg)+Math.abs(sina)*(1-Math.abs(cosg))));	
				    		//	a=0  ; a= 45  ; a=90
				    		//g=0  ;  1  ;  1     ;  1
				    		//g=90 ;  0  ; 0.707  ;  1  		
				    		//g=45 ; 0.707 ; 0.707*0.707;  1 		

							//distance du plafond z0 :
				    		z=(zi1*(npasi-dt)/npasi+zi2*dt/npasi)*zmax/diagomax; 

				    		//Diamètre du tour :
				    		gdiam=Math.max(min, (zi1*(npasi-dt)/npasi+zi2*dt/npasi)*Do/diagomax);   

				    		//Mise en avant ou en arrière des ellipses :
				    		var zindex = parseInt(npasi*1000-npasi*1000*sina+dt+10*i);

				    		//Modification de l'épaisseur des ellipses :
				    		var E=1;
				    		if(pdiam>20) {E=1+Math.round(1*pdiami2/pDwo+cosa*1);} //épaisseur de la bordure
				    		if (pdiam>20 && dt%parseInt(Math.round(npasi/10))==0){E=parseInt(Math.round((Eo-eta*sina)*pdiam/20)); }
							
							//Positionnement horizontal :
				    		var mx=gdiam/2*cosa-Math.abs(pdiam/2*cosa); //distance à l'axe vertical plan x
				    		var mxb=mxo+mx+sinb*Do*0.1+cosb*Do/2-Do/2; //décalage de l'axe vertical plan x
				    		var my=(gdiam/2*sina); //distance à l'axe vertical plan y
				    		
				    		//Positionnement de la hauteur (axe z) :
				    		var zbg=zmax-(zmax-z)*cosg+my*sing; //z*cosg+(zmax*0.7+zo)*(1-cosg)+my*sing-sinb*zmax;
				    		//  
				    		//			a=0 	; 	a= 45  		; a=90		;   zmax 	;  zmin			;
				    		// my  ;     0		;    d/2x0.7	;  d/2		;
				    		//		
				    		//g=0  ; 	 z  	;	  z     	;  z		;	zmax+z0 ;  z0			;
				    		//g=90 ;     z  	; z+0.7d/2		;  z+d/2	; 	zmax+z0	; zmax+z0		;
				    		//g=45 ;     z		; z+0.7x0.7d/2 	;  z+0.7d/2 ;	zmax+z0	; zmaxx0.707+z0	;


				    		//Variation de l'opacité :
				    		var opac=Math.min(1,0.7-(0.2*sina*Math.abs(cosg))+0.1*Math.abs(cosa)+0.2*Math.abs(sing));

				    		//Paramètrage final et positionnement de chaque elipse :
			      			var elt=angular.element(document.querySelector("#conteneur"));
			      			elt.prepend("<div class='anneau' style=' border: "+E+"px solid rgba(250, 70, 10, "+opac+") ;  left: "+mxb+"px ; top: "+(zbg+zo)+"px; width:  "+pdiamH+"px ; height:  "+pdiamV+"px ; Z-index: "+zindex+"' >&nbsp </div>");
				    		var r = 'rotate(' + inclx + 'deg)';
	               			elt.css({  '-moz-transform': r,
					                    '-webkit-transform': r,
					                    '-o-transform': r,
					                    '-ms-transform': r });
				   			//if(i==1 && dt%10==0){alert('a='+Math.round(alpha*100)/100+' sina'+Math.round(sina*100)/100+' cosa'+Math.round(cosa*100)/100+'; gdiam='+Math.round(gdiam)+' ; mx='+Math.round(mx)+' ; pdiam='+Math.round(pdiam)+' ; zindex='+zindex);}
				    	}
				    		// passage d'une spire à l'hautre :
				    	pdiami1=pdiami2;
				    	zi1=zi2; // passage d'une spire à l'hautre
				    	kvi=kvi*$scope.dist; //facteur de distorsion de la coquille
				    	//alert("kvi="+kvi+" ; pdiami1="+pdiami1)	;
				    	
			    	}
			    	else{ 
			    		if(i<nbspir-1){$scope.stopspire=true;}}	
			    	i++;	    	
			    }
		  	}
			$scope.zzz();
		};

		$scope.cagouille();


		$scope.ajust = function(){
			var elt=angular.element(document.querySelector("#conteneur"));
		      	elt.children().remove();
			 $scope.cagouille();
		};
		$scope.reset = function(){
			var elt=angular.element(document.querySelector("#conteneur"));
		      	elt.children().remove();
		    $scope.valInit();
			$scope.cagouille();
		};

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
              $scope.admin=$rootScope.admin;
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

			              			// si adresse existe dans localStorage ... si pas le bon id, on supprime l'adresse
						            if( localStorage.getItem('adresse1') && localStorage.getItem('adresse1')!=undefined){
						                var adresse1=angular.fromJson(localStorage.getItem('adresse1')); 
					                  	if(id!=adresse1[0].id){
					                    	adresse1=[{}]; 
					                   		localStorage.setItem('adresse1', angular.toJson(adresse1));
					                  	}
					              	}
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
									console.log('Connexion réussie');	}	
		            				
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
