const jwt = require('jsonwebtoken');

//Middleware d'authentification
module.exports = (req, res, next) => {
    try {
        // On extrait le token du header Authorization de la requête
        const token = req.headers.authorization.split(' ')[1];
        //On décode le token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        //On extrait de l'ID de l'utilisateur qui est maintenant authentifié
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};