const User = require('./models/User.model');

module.exports = function(app, passport) {

    // Ce petit middleware met à disposition des variables pour toutes les 'views' Pug de l'application
    app.use((request, response, next) => {
        app.locals.flash = request.flash(); // Récupération des messages flash de l'app
        app.locals.user = request.user; // Récupération de l'objet 'user' (sera existant si une session est ouverte, et undefined dans le cas contraire)
        next();
    });

    // Empêche l'accès aux page de connexion/inscription aux utilisateurs déjà connectés
    app.use(['/login', '/signup', '/auth/twitter'], (request, response, next) => {
        if (request.user)
            return response.redirect('/search');
        next();
    });

    // A contrario, empêche l'accès à la page de recherche aux utilisateurs déconnectés
    app.use('/search', (request, response, next) => {
        if (!request.user)
            return response.redirect('/login');
        next();
    });

    /**
     * Configuration des ROUTES de l'application Node
     * 
     * Documentation : http://expressjs.com/en/guide/routing.html
     */

    // Page d'accueil de l'application
    app.get('/', function (request, response) {
        response.render('index', { pageTitle: 'Accueil' });
    });


    // Déconnexion
    app.get('/logout', function (request, response) {
        request.logout();
        request.flash('success', 'Vous avez bien été déconnecté(e).');
        response.redirect('/');
    });


    // Page de connexion de l'application
    app.get('/login', function (request, response) {
        response.render('login', { pageTitle: 'Connexion' });
    });
    // Lorsqu'on tente de se connecter, c'est le middleware de passport qui prend la main, avec la stratégie "locale" (configurée dans ./passport.js )
    app.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        badRequestMessage : 'Identifiants non renseignés!',
        failureFlash: true,
        successFlash: { message: 'Connexion OK ! Bienvenue !' }
    }));

    // Connexion via Twitter
    app.get('/auth/twitter',
        passport.authenticate('twitter'));

    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', { failureRedirect: '/login' }),
        function (request, response) {
            // Successful authentication, redirect home.
            request.flash('success', 'Connecté en tant que Twitter user !');
            response.redirect('/');
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
            response.render('signup', { pageTitle: 'Inscription', error: err.message, user: request.body });
        });

    });

    // Page de recherche de l'application
    app.get('/search', function (request, response) {
        response.render('search', { pageTitle: 'Recherche' });
    });

};