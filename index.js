// Chargement de la configuration selon l'environnement
require('dotenv').config()
// Inclusion des dépendances (=modules) du projet
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

// Création d'une nouvelle application Express.js (c.f. http://expressjs.com/en/starter/hello-world.html)
const app = express();

// Configuration de l'application Express
app.set('view engine', 'pug'); // Configuration du moteur de template utilisé
app.set('views', 'views'); // Indique que le dossier /views/ contient les fichiers .pug
app.locals.cache = (process.env.NODE_ENV !== 'production'); // Désactive la mise en cache des templates .pug en mode développement

/**
 * Configuration des middlewares de l'application
 */

app.use(express.static('public')); // Middleware pour les fichiers statiques : http://expressjs.com/fr/starter/static-files.html
app.use(session({ secret: 'opendata3wa', resave: false, saveUninitialized: false }));
app.use(bodyParser.urlencoded({extended: false}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Gestion des routes de l'application dans un fichier à part
require('./app/passport')(passport);
require('./app/routes.js')(app, passport);

// Configuration de l'objet Promise utilisé par mongoose (ici, ce seront celles dans Node.js -> global.Promise)
mongoose.Promise = global.Promise;
// Connexion à la base mongo ...
const connectionString = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_SERVER}:${process.env.MONGO_PORT}/${process.env.MONGO_DBNAME}`
mongoose
    .connect(connectionString)
    .then(() => {

        // Démarrage du serveur (qui ne démarre QUE si la connexion à la base mongo est bien établie!)
        app.listen(process.env.SERVER_PORT, process.env.SERVER_NAME, function() {
          console.log(`Le serveur écoute à l'adresse suivante : http://${process.env.SERVER_NAME}:${process.env.SERVER_PORT}`);
        });

    })
    .catch(err => console.error(err.message));
