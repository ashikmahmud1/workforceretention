const express = require('express');
const router = express.Router();

const surveyEmailController = require('../controllers/survey_email');

router.post('/', surveyEmailController.Create);

router.get('/', surveyEmailController.Find);

router.get('/:id', surveyEmailController.FindById);

router.put('/:id', surveyEmailController.Update);

router.delete('/:id', surveyEmailController.Delete);

module.exports = router;