const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/category');

router.post('/', categoryController.Create);

router.get('/', categoryController.Find);

router.get('/:id', categoryController.FindById);

router.put('/:id', categoryController.Update);

router.delete('/:id', categoryController.Delete);

module.exports = router;