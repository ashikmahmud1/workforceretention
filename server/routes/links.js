const express = require('express');
const router = express.Router();

const linkController = require('../controllers/link');

router.post('/:clientId', linkController.Create);

router.get('/', linkController.Find);

router.get('/:id', linkController.FindById);

router.put('/:id', linkController.Update);

router.delete('/:id', linkController.Delete);

module.exports = router;