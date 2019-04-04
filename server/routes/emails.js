const express = require('express');
const router = express.Router();

const emailController = require('../controllers/email');

//Helpers
const emailService = require('../helpers/email');

router.post('/', emailController.Create);

//Send Email
router.post('/send',emailService.sendEmail);

router.get('/', emailController.Find);

router.get('/:id', emailController.FindById);

router.put('/:id', emailController.Update);

router.delete('/:id', emailController.Delete);

module.exports = router;
