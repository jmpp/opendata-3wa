const User = require('./models/User.model');

module.exports = function(app) {

    /**
     * Configuration des ROUTES de l'application Node
     * 
     * Documentation : http://expressjs.com/en/guide/routing.html
     */

    // Page d'accueil de l'application
    app.get('/', function (request, response) {
        response.render('index', { pageTitle: 'Accueil' });
    });


    // Page de connexion de l'application
    app.get('/login', function (request, response) {
        response.render('login', { pageTitle: 'Connexion' });
    });


    // Page d'inscription de l'application
    app.get('/signup', function (request, response) {
        response.render('signup', { pageTitle: 'Inscription' });
    });

    // Lorsqu'un utilisateur valide le formulaire d'inscription (via la méthode POST)
    app.post('/signup', function (request, response) {
        const { firstname, lastname, email, pass, pass_confirmation } = request.body;

        User.signup(firstname, lastname, email, pass, pass_confirmation).then(() => {
            // Succès de l'opération -> retour sur la home "/""
            response.redirect('/');
        }).catch(err => { 
            // Une erreur est survenue lors de la création d'un utilisateur, on revient sur la page signup avec un message d'erreur pour le client
            response.render('signup', { pageTitle: 'Inscription', error: err.message, user : request.body });
        });

    });

    // Page de recherche de l'application
    app.get('/search', function (request, response) {
        response.render('search', { pageTitle: 'Recherche' });
    });

};