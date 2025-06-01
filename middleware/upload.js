const multer = require('multer');

const MIME_TYPES= {
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
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

//Gère le téléchargement des fichiers
module.exports = multer({storage}).single('image');