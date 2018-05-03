// Utilisation du module npm 'mongoose'
const mongoose = require('mongoose');
const hash = require('../hash');

// Configuration de l'objet Promise utilisé par mongoose (ici, ce seront celles dans Node.js -> global.Promise)
mongoose.Promise = global.Promise;

// Définition du "Schéma" d'un utilisateur
const UserSchema = mongoose.Schema({
	firstname : { type: String },
	lastname : { type: String },
    
    // Validateur personnalisé qui vérifie le format d'une adresse e-mail.
    // Basé sur la documentation de mongoose : http://mongoosejs.com/docs/validation.html#custom-validators 
    email : {
        type: String,
        validate: {
            validator: function(mailValue) {
                // c.f. http://emailregex.com/
                const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return emailRegExp.test(mailValue);
            },
            message: 'L\'adresse email {VALUE} n\'est pas une adresse RFC valide.'
        }
    },

    salt: { type: String },
    hash: { type: String },

    twitterId: { type: String },

});

/*
    Ajout d'une méthode personnalisée "signup" pour inscrire un utilisateur via
    le formulaire d'inscription classique.
    Cette méthode accepte les 5 paramètres obligatoires définissant un User
*/
UserSchema.statics.signup = function(firstname, lastname, email, pass, pass_confirmation) {
    
    if (pass !== pass_confirmation)
        return Promise.reject(new Error('Les mots de passe ne coïncident pas.'));

    if (email.trim() === '')
        return Promise.reject(new Error('Le champs "Email" est requis.'));

    if (firstname.trim() === '')
        return Promise.reject(new Error('Le champs "Nom" est requis.'));
    
    if (lastname.trim() === '')
        return Promise.reject(new Error('Le champs "Prénom" est requis.'));

    return this.findOne({ email: email })
        .then(user => {
            if (user)
                return Promise.reject(new Error('Cette adresse email est déjà utilisée.'));
        })
        .then(() => hash(pass))
        .then(({salt, hash}) => {
            return this.create({
                firstname : firstname,
                lastname : lastname,
                email : email,
                salt : salt,
                hash : hash
            });
        })
        .catch(err => {
            if (err.errors)
                throw new Error(Object.keys(err.errors).map(field => err.errors[field].message).join('<br>'));

            throw err;
        });
};

/*
    Ajout de la méthode permettant de vérifier un mot de passe
*/

UserSchema.statics.checkPassword = function(userPassword, user) {
    return hash(userPassword, user.salt).then(({hash}) => {
        if (user.hash === hash) {
            return Promise.resolve(user);
        }
        return Promise.reject(new Error('Mot de passe invalide!'));
    });
};

/*
    Ajout d'une méthode permettant de récupérer (ou d'inscrire si inexistant) un utilisateur
    qui s'est loggué via Twitter
*/
UserSchema.statics.signupViaTwitter = function(profile) {
    // Recherche si cet utilisateur (loggué via Twitter) n'est pas déjà dans notre base mongo ?
    return this.findOne({ 'twitterId' : profile.id })
        .then(user => {
            // Non ! Donc on l'inscrit dans notre base..
            if (user === null) {
                const [firstname, lastname] = profile.displayName.split(' ');
                return this.create({
                    twitterId : profile.id,
                    firstname : firstname || '',
                    lastname : lastname || ''
                });
            }
            // On renvoie l'utilisateur final
            return user;
        });
};

// Export du Modèle mongoose représentant un objet User
module.exports = mongoose.model('User', UserSchema);
