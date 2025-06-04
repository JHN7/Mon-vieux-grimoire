const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');


// POST => Création de compte
exports.signup = (req, res, next) => {

    // Regex de validation du mot de passe
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    // Si le mot de passe est trop court ou qu'il ne correspond pas au standard attend, on renvoit une erreur
    if (!passwordRegex.test(req.body.password)) {
        return res.status(400).json({
            error: 'Le mot de passe doit contenir au minimum 8 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial.'
        });
    }
    //Appel de la fonction de hachage de bcrypt pour le PW (salé 10 fois)
    bcrypt.hash(req.body.password, 10)
    // Utilisation du hash pour créer un utilisateur
        .then(hash => {
        // Création d'une instance du modèle User
            const user = new User({
                email: req.body.email,
                password: hash
            });
        // Enregistrement dans la base de données
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur crée !' }))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => {
    console.error('Erreur lors du hash :', error);
    res.status(500).json({ error });
});
};


// POST => Connexion
exports.login = (req, res, next) => {
    // Vérification de l'existence de l'utilisateur dans notre base de données
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
        // Comparaison du mot de passe entré avec le hash de la base de données
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                // Si les logins sont valides, on renvoie une réponse contenant userId et un token crypté
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};