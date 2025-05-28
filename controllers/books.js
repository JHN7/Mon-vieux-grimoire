const Book = require('../models/book');


// POST => Ajout d'un livre 
exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._id;
    const book = new Book ({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    book.save()
        .then(() => { res.status(201).json({ message : 'Objet enregistré!' }) })
        .catch(error => {res.status(400).json( { error }) })
}

// GET => Récupération d'un livre spécifique
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }))
}

// GET => Récupération de tous les livres
exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(404).json({ error }));
}

// DELETE => Suppression d'un livre
exports.deleteBook = (req, res, next) => {
    // Récupération du livre à supprimer
    Book.findOne({ _id: req.params.id })
        .then(book => {
            // Seul le créateur de la fiche peut la supprimer, sinon on renvoit une erreur
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: '403: unauthorized request' });
            } else {
                // Séparation du nom du fichier image
                const filename = book.imageUrl.split('/images/')[1];
                // Suppression du fichier image puis suppression du livre dans la base de données dans la callback
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                        .catch(error => res.status(400).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(404).json({ error });
        });
};

// PUT => Modification d'un livre existant
exports.modifyBook = (req, res, next) => {
    // Stockage de la requête en JSON dans une constante
    // (ici, nous recevons soit un élément form-data, soit des données JSON, selon si le fichier image a été modifié ou non)
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/resized_${req.file.filename}` 
    } : { ...req.body };
    // Suppression de _userId auquel on ne peut faire confiance
    delete bookObject._userId;
    // Récupération du livre existant à modifier
    Book.findOne({_id: req.params.id})
        .then((book) => {
            // Le livre ne peut être mis à jour que par le créateur de sa fiche
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message : '403: unauthorized request' });
            } else {
                // Séparation du nom du fichier image existant
                const filename = book.imageUrl.split('/images/')[1];
                // Si l'image a été modifiée, on supprime l'ancienne
                req.file && fs.unlink(`images/${filename}`, (err => {
                        if (err) console.log(err);
                    })
                );
                // Mise à jour du livre
                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch((error) => {
            res.status(404).json({ error });
        });
};

