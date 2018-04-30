/**
 * index.js
 **/

const express = require('express');

// Création d'une nouvelle application Express.js
// http://expressjs.com/en/starter/hello-world.html
const app = express();


/**
 * Configuration des routes de l'application Node
 * 
 * Documentation : http://expressjs.com/en/guide/routing.html
 */


// Page d'accueil de l'application
app.get('/', function(request, response) {
  response.end('Bienvenue sur la page d\'accueil !');
});


// Page de connexion de l'application
app.get('/login', function(request, response) {
  response.end('Page LOGIN');
});


// Page d'inscription de l'application
app.get('/signup', function(request, response) {
  response.end('Page INSCRIPTION');
});


// Page de recherche de l'application
app.get('/search', function(request, response) {
  response.end('Page RECHERCHE');
});


/**
 * Configuration des middlewares de l'application
 */

app.use(express.static('public')); // Middleware pour les fichiers statiques : http://expressjs.com/fr/starter/static-files.html


// Démarrage du serveur
app.listen(1234, function() {
  console.log('Le serveur écoute à l\'adresse suivante : http://localhost:1234');
});
