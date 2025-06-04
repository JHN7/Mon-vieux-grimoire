const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

//Configuration multer
const storage = multer.diskStorage({
    //On enregistre des fichier dans un dossier, ici "images"
    destination: (req, file, callback) => {
        callback(null, 'images')
    },

    //Nom des images => nom d'origine, remplacement des espaces par des underscores, ajout d'un timestamp
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_').split('.')[0];
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

//Gère le téléchargement des fichiers
module.exports = multer({ storage }).single('image');

//Gestion du redimensionnement image
module.exports.resizeImage = (req, res, next) => {
    if (!req.file) {
        return next();
    }
    
    const filePath = req.file.path;
    const fileName = req.file.filename;
    const outputFilePath = path.join('images', `resized_${fileName}`);

    sharp(filePath)
        .resize(206, 260, {
            fit: 'contain',
            background: {r: 255, g: 255, b:255, alpha: 1},
        })
        .toFile(outputFilePath)
        .then(() => {
            fs.unlink(filePath, () => {
                req.file.path = outputFilePath;
                next();
            });
        })
}