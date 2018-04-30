// Inclusion des dépendances (=modules) du projet
const express = require('express');

// Création d'une nouvelle application Express.js (c.f. http://expressjs.com/en/starter/hello-world.html)
const app = express();

// Configuration de l'application Express
app.set('view engine', 'pug'); // Configuration du moteur de template utilisé
app.set('views', 'views'); // Indique que le dossier /views/ contient les fichiers .pug

/**
 * Configuration des middlewares de l'application
 */

app.use(express.static('public')); // Middleware pour les fichiers statiques : http://expressjs.com/fr/starter/static-files.html

/**
 * Configuration des ROUTES de l'application Node
 * 
 * Documentation : http://expressjs.com/en/guide/routing.html
 */

// Page d'accueil de l'application
app.get('/', function(request, response) {
  response.render('index', { pageTitle: 'Accueil' });
});


// Page de connexion de l'application
app.get('/login', function(request, response) {
  response.render('login', { pageTitle: 'Connexion' });
});


// Page d'inscription de l'application
app.get('/signup', function(request, response) {
  response.render('signup', { pageTitle: 'Inscription' });
});


// Page de recherche de l'application
app.get('/search', function(request, response) {
  response.render('search', { pageTitle: 'Recherche' });
});


// Démarrage du serveur
app.listen(1234, function() {
  console.log('Le serveur écoute à l\'adresse suivante : http://localhost:1234');
});
