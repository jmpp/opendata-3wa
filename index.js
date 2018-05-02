// Chargement de la configuration selon l'environnement
require('dotenv').config()
// Inclusion des dépendances (=modules) du projet
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./app/models/User.model');

// Création d'une nouvelle application Express.js (c.f. http://expressjs.com/en/starter/hello-world.html)
const app = express();

// Configuration de l'application Express
app.set('view engine', 'pug'); // Configuration du moteur de template utilisé
app.set('views', 'views'); // Indique que le dossier /views/ contient les fichiers .pug

/**
 * Configuration des middlewares de l'application
 */

app.use(express.static('public')); // Middleware pour les fichiers statiques : http://expressjs.com/fr/starter/static-files.html
app.use(bodyParser.urlencoded({extended: false}));

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

// Lorsqu'un utilisateur valide le formulaire d'inscription (via la méthode POST)
app.post('/signup', function(request, response) {
  const { firstname, lastname, email, pass } = request.body;

  User.signup( firstname, lastname, email, pass ).then(() => {
    // Succès de l'opération -> retour sur la home "/""
    response.redirect('/');
  }).catch(err => {
    // Une erreur est survenue lors de la création d'un utilisateur, on revient sur la page signup avec un message d'erreur pour le client
    response.render('signup', { pageTitle: 'Inscription', error: err.message });
  });

});


// Page de recherche de l'application
app.get('/search', function(request, response) {
  response.render('search', { pageTitle: 'Recherche' });
});


// Configuration de l'objet Promise utilisé par mongoose (ici, ce seront celles dans Node.js -> global.Promise)
mongoose.Promise = global.Promise;

// Connexion à la base mongo ...
const connectionString = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_SERVER}:${process.env.MONGO_PORT}/${process.env.MONGO_DBNAME}`
mongoose
    .connect(connectionString)
    .then(() => {

        // Démarrage du serveur (qui ne démarre QUE si la connexion à la base mongo est bien établie!)
        app.listen(1234, function() {
          console.log('Le serveur écoute à l\'adresse suivante : http://localhost:1234');
        });

    })
    .catch(err => console.error(err.message));
