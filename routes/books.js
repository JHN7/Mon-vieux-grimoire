const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const booksCtrl = require ('../controllers/books')
const auth = require ('../middleware/auth')

router.get('/', booksCtrl.getAllBooks);
router.get('/:id', booksCtrl.getOneBook);
router.post('/' , auth, upload, booksCtrl.createBook);
router.delete('/:id', auth, booksCtrl.deleteBook);
router.put('/:id', auth, upload, booksCtrl.modifyBook);

module.exports = router;
