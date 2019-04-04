const express = require('express');
const router = express.Router();

const answerController = require('../controllers/answer');

router.post('/update-many', answerController.UpdateAnswers);

router.post('/add-many', answerController.CreateMany);

router.get('/employee/survey', answerController.FindEmployeeSurveyQuestionsAnswers);

router.post('/:questionId', answerController.Create);

router.get('/', answerController.Find);

router.get('/:id', answerController.FindById);

router.put('/:id', answerController.Update);

router.delete('/:id', answerController.Delete);

module.exports = router;
