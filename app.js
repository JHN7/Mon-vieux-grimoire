const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const booksRoutes = require('./routes/books')
const userRoutes = require('./routes/user')
const path = require('path');

// Charger variable d'environnement
dotenv.config();

//Connexion à la base de données (mdp à revoir)
mongoose.connect(process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//Création de l'application
const app = express();
//Middleware permettant à Express d'extraire le corps JSON provenant des requêtes POST
app.use(express.json());

//Middleware qui gère les erreurs de CORS
app.use((req, res, next) => {
    //Accès à l'API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    //Autorisation d'ajouter les headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //Autorisation d'envoyer des requêtes avec les méthodes ci-dessous
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Gestion de la ressource images de manière statique 
app.use('/images', express.static(path.join(__dirname, 'images')))

//Enregistrement des routeurs
app.use('/api/books', booksRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;