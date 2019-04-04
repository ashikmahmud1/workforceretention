const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const clientController = require('../controllers/client');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',

};

//http://localhost:8080/images/client/44115915_346503469228786_8386942939963588608_n-1545031334273.jpg

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images/client/'))
    },
    filename: function (req, file, cb) {
        const fileNameWithoutExtension = file.originalname.split('.').slice(0, -1).join('.');
        const name = fileNameWithoutExtension.toLowerCase().split(' ').join('_');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

const upload = multer({storage: storage});

router.post('/:userId', upload.single('image'), clientController.Create);

router.get('/assignSurvey', clientController.AssignSurvey);

router.get('/unAssignSurvey', clientController.UnAssignSurvey);

router.get('/', clientController.Find);

router.get('/:id', clientController.FindById);

router.put('/:id',upload.single('image'), clientController.Update);

router.delete('/:id', clientController.Delete);

//SET UP RELATIONAL ROUTES
router.post('/employees/:clientId', clientController.FindEmployees);

router.get('/surveys/:clientId', clientController.FindSurveys);

router.get('/organizations/:clientId', clientController.FindOrganizations);

router.get('/emails/:clientId', clientController.FindEmails);

router.get('/email_by_id/:clientId', clientController.FindEmailById);

router.post('/emails/update/:clientId', clientController.UpdateEmail);

module.exports = router;
