// Utilisation du module npm 'mongoose'
const mongoose = require('mongoose');

// Configuration de l'objet Promise utilisé par mongoose (ici, ce seront celles dans Node.js -> global.Promise)
mongoose.Promise = global.Promise;

// Définition du "Schéma" d'un utilisateur
const UserSchema = mongoose.Schema({
	firstname:  { type: String, required: true },
	lastname:   { type: String, required: true },
    email:      { type: String, required: true },
    pass:       { type: String, required: true }
});

/*
    Ajout d'une méthode personnalisée "signup" pour inscrire un utilisateur
    Cette méthode accepte les 4 paramètres définissant un User
*/
UserSchema.statics.signup = function(firstname, lastname, email, pass) {
    
    /*
        Insertion en base, en utilisant la méthode .create() de d'un Model mongoose
        c.f. http://mongoosejs.com/docs/api.html#create_create

        Cette méthode renvoie une Promesse JS. Avec l'instruction 'return', on renvoie donc
        la promesse comme valeur de 'UserSchema.statics.signup'
    */
    return this.create({
        firstname : firstname,
        lastname : lastname,
        email : email,
        pass : pass
    });
};

// Export du Modèle mongoose représentant un objet User
module.exports = mongoose.model('User', UserSchema);
