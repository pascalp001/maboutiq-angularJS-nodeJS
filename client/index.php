<?php
/**
**Programme d'envoi mail "basique" et "mail plus élaboré" en html, vers serveur SMTP 
**Pour contrôler en local la réception des mails envoyés par le serveur, on crée un serveur SMTP "local"
**Avec node installé, npm install -g maildev ; 
**puis, wampserver>PHP>php.ini et modifier après SMTP = localhost, smtp_port = 1025 ;
**Re-démarrer wampserver ; lancer maildev ; 
**maildev reçoit du serveur PHP sur le port 1025 
**et envoie vers le client sur son port 1080 (localhost:1080)
**/

if(isset($_POST['mailHtml'])){
	$to = 'pascalp001@free.fr';
	$subject='Petit email en html';
	$message = '
<html lang="fr" style="box-sizing: border-box; font-family: sans-serif;">
<head>
	<meta charset="utf-8">
</head>
<body style="margin:0; padding:0; color:#fff;">
	<center style="background-color: rgb(24,188,156);padding-top:25px; padding-bottom: 25px;">
		<img src="http://www.prog-d.com/images/LogoProG8.PNG" style="max-width: 150px; padding: 3px; background-color: grey;" />
	</center>
	<center style="rgb(44,62,80);padding-top:10px; padding-bottom: 50px;">
		<div style="padding: 20px; width: 94%; background-color:#888;">
			<h2>Pascal</h2>
			<p>
				Une personne a répondu à votre question ayant pour sujet 
				<b><i>Envoyer un mail en retour</i></b>
				<br/>
				Pour voir cette réponse, cliquez sur le lien ci-dessous qui vous redirigera vers votre ...
			</p>

			<a href="#" style="display: block; color: inherit; text-decoration: none; background-color: yellow;" >Clic</a>
			<h4 style="margin-bottom:0; padding-bottom:0;" >Attention!</h4>
			<p style="margin-top:0;">Si cette réponse résout votre problème, n\'oubliez pas de le faire savoir</p>
		</div>
	</center>
	<center style="background-color: rgb(24,188,156); padding-bottom: 5px; padding-top: 5px;" >
		Vous avez reçu cet email car vous avez posé une question sur le site de Pascal.
		<br/>
	</center>

</body>
</html>
	';
$header  = "MIME VERSION 1.0\r\n";
$header .= "Content-type: text/html; charset=UTF-8\r\n";
$header .= "From: no-reply@progdev.com"."\r\n"."Reply-To: contact@progdev.com"."\r\n";
$header .= "X-Mailer: PHP/".phpversion();

	mail($to, $subject, $message, $header);

}else if(isset($_POST['mailBasique']))
{
	mail('contact@progdev.com',
		"Petit email basique",
		"Vous avez reçu cet email car vous avez posé une question sur le site de Pascal");
}
?>
<?php session_start(); $_SESSION['test']="ici"; ?>
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Ma Boutique en ligne</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width">
    <link rel="stylesheet" href="styles/bootstrap/css/bootstrap.css">
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="styles/print.css" media="print">
    <link rel="stylesheet" href="styles/angularPrint.css" media="print">
    <script type="text/javascript" src="./js/vendor/jquery/jquery.min.js"></script>
    <script type="text/javascript" src="./js/vendor/angular.js"></script>
    <!--<script type="text/javascript" src="./js/vendor/angular-animate.js"></script>-->    
    <script type="text/javascript" src="./js/vendor/angular-cookies.js"></script>
    <script type="text/javascript" src="./js/vendor/angular-resource.js"></script>
    <script type="text/javascript" src="./js/vendor/angular-route.js"></script>
    <script type="text/javascript" src="js/vendor/angular-sanitize.js"></script>   
    <script type="text/javascript" src="js/vendor/angularPrint.js"></script>   
    <!-- <script type="text/javascript" src="./js/vendor/angular-ui-routeur.js"></script> -->
    <!-- <script type="text/javascript" src="./js/vendor/angular-touch.js"></script> -->
    <script type="text/javascript" src="styles/bootstrap/js/bootstrap.min.js"></script>
     <script type="text/javascript" src="./js/vendor/md5.js"></script>
    <!--<script type="text/javascript" src="./js/vendor/rating.js"></script>-->
    <style>
    </style>
  </head>

  <body ng-app="appPrd" class="body-color" ng-controller="AppCtrl">
    <!--[if lte IE 8]>
      <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->
    <div class=""  >
<!-- Barre de menu : *****************************************************-->
      <nav class="navbar navbar-default navbar-color"  role="navigation">
        <div class="" >
          <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#example-navbar-collapse">
              <span class="sr-only ">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>

            <a class="navbar-brand active" href="#/">Accueil</a>
          </div>

          <div class="collapse navbar-collapse " id="example-navbar-collapse">

            <ul class="nav navbar-nav">
              <li class=""><a href="#/boutique">Boutique</a></li>
              <li><a ng-href="#/about">Découvrir</a></li>
              <li><a ng-href="#/contact">Contact</a></li>
              <li><a ng-href="#/admin" ng-show="admin">Admin</a></li>
              <li><span style="font-size:8px; color: #999; ">Test 2+2={{2+2}} </span></li>
            </ul>
          </div>

        </div>
      </nav>
    </div>


  <section >


    <!-- Template :******************************************************* -->
    <div class="container"><p style="color:white;"><?php echo($_SESSION['test']); ?></p>
      <div ng-view="">
     
      </div>
    </div>
    <!-- ***************************************************************** -->

    <!-- Footer :**********************************************************-->
    <div class="footer">
      <div class="container">
        <p><span class="glyphicon glyphicon-heart"></span> Merci de votre visite !</p>
        <hr class="hrF" />
        <div class="row bordBas">
          <div class="col-sm-3">
            <a href="" >A PROPOS DE BIG'ORNO</a>
          </div>
          <div class="col-sm-3">
            <a href="" >INFORMATIONS LÉGALES</a>
          </div>
          <div class="col-sm-3">
            <a href="" >PROFESSIONNELS</a>
          </div>
          <div class="col-sm-3">
            <a href="" >DES QUESTIONS ?</a>
          </div>
        </div> 
       
        <div class="row" >
          <div class="col-sm-3">
            <a href="" >Qui sommes nous ?</a>
          </div>
          <div class="col-sm-3">
            <a href="" >Conditions générales d'utilisation</a>
          </div>
          <div class="col-sm-3">
            <a href="" >Publicitaires</a>
          </div>
          <div class="col-sm-3">
            <a href="" >Plan du site</a>
          </div>
        </div> 
        <div class="row bordBas" >
          <div class="col-sm-3">
            <a href="" >Nous rejoindre</a>
          </div>
          <div class="col-sm-3">
            <a href="#/cgv" >Conditions Générales de Vente</a>
          </div>
          <div class="col-sm-3">
            <a href="" >Distributeurs</a>
          </div>
          <div class="col-sm-3">
            <a href="" >Nous contacter</a>
          </div>
        </div> 
        
        <Center style="color: #99d">
            Conception de ce site (Factice) : Pascal PLUMET - Mai 2016.
        </Center>
      </div>
    </div>

<!-- ********************************************************************* -->

<!-- Boîte dialogue vers connexion :***************************************-->
  <div ng-show="showConnexion==true">
        <div class="layer_cart_overlay" ></div>
        <div class="layer_cart" >
          <div class="layer_cart_product">

          <div class="row">
            <div class="col-xs-12 col-sm-6 bordure" >
              <div  >
                <h3 class="connexion">PAS ENCORE MEMBRE, INSCRIVEZ-VOUS</h3>
              </div>  

              <form>
              <div class="row"><div class="wedge30">&nbsp;</div>
                <div class="col-xs-12 col-sm-12">
                  <center>
                    <input type="text" class="inputConn" placeholder="Adresse email" ng-model="usr"  />
                  </center>
                </div>
              </div><div style="height:80px; color:red; font-weight:600; padding:10px;"> &nbsp; {{msg}}</div>

              <div class="row">    
                <div class="col-xs-12 col-sm-12">
                  <center>
                    
                    <a  href="#/inscription/0"  ng-show="testc==true" ng-click="" style="color:#0d0"><button type="button" class="seConnect" ng-click="inscription();  " title="Vers le module d'inscription" >S'inscrire</button></a>
                    <button type="button" ng-show="testc==false" class="seConnect" ng-click="inscription(); " title="Saisir une adresse mail" >S'inscrire</button>
                    
                  </center>
                </div>
              </div><div style="height:40px">&nbsp;</div>
              </form>
            </div>

            <div class="col-xs-12 col-sm-6 bordure" >
              <div  >
                <h3 class="connexion">DÉJÀ CLIENT OU MEMBRE, IDENTIFIEZ-VOUS</h3>
              </div>       
              <div>

                <form>
                <div class="row">
                  <div class="col-xs-12 col-sm-12">
                    <center>
                      <input type="text" class="inputConn" placeholder="Adresse email" ng-model="userMail" required />
                    </center>
                  </div>
                </div><br/>

                <div class="row">    
                  <div class="col-xs-12 col-sm-12">
                    <center>
                      <input type="password" class="inputConn" placeholder="Mot de passe" ng-model="mp"  />
                    </center>
                  </div>
                </div>
                 {{msg_c}}
                <br/>

                <div class="row">    
                  <div class="col-xs-12 col-sm-12">
                    <center>
                      <button type="button" class="seConnect" ng-click="connexion(); " title="Entrez une adresse e-mail"  >Se connecter</button>
                    </center>
                  </div>
                </div> <br/>

                </form>
                 
                 
                <div class="row">               
                  <div class="col-xs-12 col-sm-12">
                    <center>
                      <a  class="mdpOublie" style="" title="Option non fonctionnelle, désolé !" >Mot de passe oublié ?</a>
                    </center>
                  </div>
                </div>

              </div>
            </div> 
              <a href="" class="closePopin"  >
                <i class=" icon-close-circle-outline icon-3x"  ><span class="glyphicon glyphicon-remove-circle" ng-click="showConnexion=false;" ></span></i>
              </a>
          </div>                       

          </div>
        </div >
      </div >
        <!-- fin boîte dialogue vers connexion / inscription -->
</section>

<!-- Google Analytics: change UA-XXXXX-X to be your site's ID §§§§§§§§§§§§§§§§-->
     <script>
       !function(A,n,g,u,l,a,r){A.GoogleAnalyticsObject=l,A[l]=A[l]||function(){
       (A[l].q=A[l].q||[]).push(arguments)},A[l].l=+new Date,a=n.createElement(g),
       r=n.getElementsByTagName(g)[0],a.src=u,r.parentNode.insertBefore(a,r)
       }(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

       ga('create', 'UA-XXXXX-X');
       ga('send', 'pageview');

    </script>
<eltscript></eltscript>
<!-- Scripts de fonctionnement : §§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§-->
    <script src="app.js"></script>
    <script src="controllers/main.js"></script>
    <script src="controllers/boutique.js"></script>
    <script src="controllers/about.js"></script>
    <script src="controllers/contact.js"></script>
    <script src="controllers/admin.js"></script>
    <script src="controllers/modif.js"></script>
    <script src="services/categService.js"></script>
    <script src="services/prodService.js"></script>
    <script src="services/panierService.js"></script>
    <script src="services/avisService.js"></script> 
    <script src="services/inscService.js"></script>
    <script src="services/userService.js"></script>
    <script src="services/commdeService.js"></script>  
    <script src="controllers/detail.js"></script>
    <script src="controllers/connexion.js"></script>     
    <script src="controllers/inscription.js"></script>      
    <script src="controllers/panier.js"></script>
    <script src="controllers/adresse.js"></script>
    <script src="controllers/livraison.js"></script>
    <script src="controllers/paiement.js"></script>
    <script src="controllers/cgv.js"></script>
</body>
</html>
