const express = require('express');
const router = express.Router();

const questionController = require('../controllers/question');

router.post('/update-many/:surveyId', questionController.UpdateSurveyQuestions);

router.post('/add-many/:surveyId', questionController.CreateMany);

router.post('/:surveyId', questionController.Create);

router.get('/', questionController.Find);

router.get('/:id', questionController.FindById);

router.put('/:id', questionController.Update);

router.delete('/:id', questionController.Delete);

module.exports = router;