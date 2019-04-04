const express = require('express');
const router = express.Router();

const surveyController = require('../controllers/survey');

router.post('/download-completed-survey', surveyController.PrintCompletedSurvey);

router.post('/:userId', surveyController.Create);

router.get('/survey-question-answer/:surveyId', surveyController.SurveyWithQuestionAnswer);

router.get('/questions/answers/:surveyId', surveyController.SurveyQuestionsAnswers);

router.get('/questions/:surveyId', surveyController.SurveyQuestions);

router.get('/clone/:surveyId', surveyController.Clone);

router.get('/', surveyController.Find);

router.get('/:id', surveyController.FindById);

router.put('/:id', surveyController.Update);

router.delete('/:id', surveyController.Delete);

module.exports = router;
