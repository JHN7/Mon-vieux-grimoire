const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config');
const booksCtrl = require ('../controllers/books')
const auth = require ('../middleware/auth')

router.get('/', booksCtrl.getAllBooks);
router.get('/:id', booksCtrl.getOneBook);
router.post('/' , auth, multer, booksCtrl.createBook);
router.delete('/:id', auth, booksCtrl.deleteBook);
router.put('/:id', auth, booksCtrl.modifyBook);

module.exports = router;
