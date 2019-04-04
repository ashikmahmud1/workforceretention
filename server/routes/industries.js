const express = require('express');
const router = express.Router();

const industryController = require('../controllers/industry');

router.post('/', industryController.Create);

router.get('/', industryController.Find);

router.get('/:id', industryController.FindById);

router.put('/:id', industryController.Update);

router.delete('/:id', industryController.Delete);

module.exports = router;