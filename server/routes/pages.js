const express = require('express');
const router = express.Router();

const pageController = require('../controllers/page');

router.post('/', pageController.Create);

router.get('/', pageController.Find);

router.get('/:id', pageController.FindById);

router.put('/:id', pageController.Update);

router.delete('/:id', pageController.Delete);

module.exports = router;