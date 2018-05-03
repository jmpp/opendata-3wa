const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

const User = require('./models/User.model');

module.exports = function(passport) {

    /*
        Serialization/Désérialisation de l'objet 'user'
        c.f. http://www.passportjs.org/docs/configure/#sessions
    */

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    /*
        Définition des stratégies
    */

    // Stratégie Locale
    // ----

    const localStrategyConfig = {
        usernameField: 'email',
        passwordField: 'pass'
    };

    passport.use(new LocalStrategy(localStrategyConfig, (email, password, done) => {

        // Vérification de l'email et du password, et invocation du handler done() pour informer `passport` du succès (ou échec) de l'opération
        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    // Invocation du handler done() de `passport` à la manière d'une erreur --> le middleware `passport.authenticate` répondra avec une erreur
                    done(null, false, {message: 'Adresse email invalide!'});
                    return Promise.reject(); // fait également échouer notre chaîne de Promesses JS
                }
                return user;
            })
            .then(user => User.checkPassword(password, user))
            .then(user => {
                // Si on est arrivé jusqu'ici sans erreur, c'est que les identifiants semblent valides.
                // ---> Fin de l'authentification, on transmet l'objet 'user' à la méthode done() de passport, et le middleware `passport.authenticate` répondra avec une nouvelle session user
                done(null, user);
            })
            .catch(err => {
                if (err)
                    done(null, false, {message: err.message});
            });
    }));

    // Strétégie Twitter
    // ----

    passport.use(new TwitterStrategy({
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: `http://${process.env.SERVER_NAME}:${process.env.SERVER_PORT}/auth/twitter/callback`
    },
    function (token, tokenSecret, profile, cb) {
        User.signupViaTwitter(profile)
            .then(user => cb(null, user))
            .catch(err => cb(err, false));
    }
));

};
