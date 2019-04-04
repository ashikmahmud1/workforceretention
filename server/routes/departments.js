const express = require('express');
const router = express.Router();

const departmentController = require('../controllers/department');

router.post('/:divisionId', departmentController.Create);

router.get('/', departmentController.Find);

router.get('/:id', departmentController.FindById);

router.put('/:id', departmentController.Update);

router.delete('/:id', departmentController.Delete);

module.exports = router;