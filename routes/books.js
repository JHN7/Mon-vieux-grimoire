const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const booksCtrl = require ('../controllers/books')
const auth = require ('../middleware/auth')

router.get('/', booksCtrl.getAllBooks);
router.get('/bestrating', booksCtrl.getBestRating);
router.get('/:id', booksCtrl.getOneBook);
router.post('/' , auth, upload, upload.resizeImage, booksCtrl.createBook);
router.post('/:id/rating', auth, booksCtrl.createRating);
router.put('/:id', auth, upload, upload.resizeImage, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);


module.exports = router;
