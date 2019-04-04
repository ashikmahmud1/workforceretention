const express = require('express');
const router = express.Router();

const boxController = require('../controllers/box');

router.post('/', boxController.Create);

router.get('/', boxController.Find);

router.get('/:id', boxController.FindById);

router.put('/:id', boxController.Update);

router.delete('/:id', boxController.Delete);

module.exports = router;