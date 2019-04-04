const express = require('express');
const router = express.Router();

const staticPageController = require('../controllers/static_page');

router.post('/', staticPageController.Create);

router.get('/', staticPageController.Find);

router.get('/:id', staticPageController.FindById);

router.put('/:id', staticPageController.Update);

router.delete('/:id', staticPageController.Delete);

module.exports = router;