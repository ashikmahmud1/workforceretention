const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const userController = require('../controllers/user');

router.post('/', userController.Create);

// router.get('/', authMiddleware.auth, userController.Find);

router.get('/', userController.Find);

router.get('/:id', userController.FindById);

router.put('/:id', userController.Update);

router.delete('/:id', userController.Delete);

//SET UP RELATIONAL ROUTES
router.get('/clients/:userId',userController.FindClient);

router.get('/surveys/:userId',userController.FindSurveys);

module.exports = router;