// Utilisation du module npm 'mongoose'
const mongoose = require('mongoose');

// Configuration de l'objet Promise utilisé par mongoose (ici, ce seront celles dans Node.js -> global.Promise)
mongoose.Promise = global.Promise;

// Définition du "Schéma" d'un utilisateur
const UserSchema = mongoose.Schema({
	firstname : { type: String, required: [true, 'Le champs "Prénom" est requis.'] },
	lastname : { type: String, required: [true, 'Le champs "Nom" est requis.'] },
    
    // Validateur personnalisé qui vérifie le format d'une adresse e-mail.
    // Basé sur la documentation de mongoose : http://mongoosejs.com/docs/validation.html#custom-validators 
    email : {
        type: String,
        required: [true, 'Le champs "Email" est requis.'],
        validate: {
            validator: function(mailValue) {
                // c.f. http://emailregex.com/
                const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return emailRegExp.test(mailValue);
            },
            message: 'L\'adresse email {VALUE} n\'est pas une adresse RFC valide.'
        }
    },

    pass: { type: String, required: [true, 'Le champs "Mot de passe" est requis.'] }
});

/*
    Ajout d'une méthode personnalisée "signup" pour inscrire un utilisateur
    Cette méthode accepte les 4 paramètres définissant un User
*/
UserSchema.statics.signup = function(firstname, lastname, email, pass, pass_confirmation) {
    
    if (pass !== pass_confirmation)
        return Promise.reject(new Error('Les mots de passe ne coïncident pas.'));

    return this.findOne({ email: email })
        .then(user => {
            if (user)
                return Promise.reject(new Error('Cette adresse email est déjà utilisée.'));
        })
        .then(() => {
            return this.create({
                firstname : firstname,
                lastname : lastname,
                email : email,
                pass : pass
            });
        })
        .catch(err => {
            if (err.errors)
                throw new Error(Object.keys(err.errors).map(field => err.errors[field].message).join('<br>'));

            throw err;
        });
};

// Export du Modèle mongoose représentant un objet User
module.exports = mongoose.model('User', UserSchema);
