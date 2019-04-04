const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const articleController = require('../controllers/article');
//Authenticate means that route is protected.

router.post('/:clientId', articleController.Create);

router.get('/', articleController.Find);

router.get('/:id', articleController.FindById);

router.put('/:id', articleController.Update);

router.delete('/:id', articleController.Delete);

module.exports = router;