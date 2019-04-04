const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const reportController = require('../controllers/report');

const MIME_TYPE_MAP = {
    'application/pdf': 'pdf'
};

// pdf file download url
//http://localhost:8080/pdf/somefile.pdf

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../pdf'))
    },
    filename: function (req, file, cb) {
        const fileNameWithoutExtension = file.originalname.split('.').slice(0, -1).join('.');
        const name = fileNameWithoutExtension.toLowerCase().split(' ').join('_');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

const upload = multer({storage: storage});

router.get('/manager/details/:id', reportController.ManagerReportDetails);

router.post('/manager/:id', reportController.ManagerReport);

router.post('/data-output', reportController.DataOutput);

//create new file
router.post('/', upload.single('file'), reportController.Create);
// find all files
router.get('/', reportController.Find);
// find file by id
router.get('/:id', reportController.FindById);
// update file
router.put('/:id', upload.single('file'), reportController.Update);
// delete a file
router.delete('/:id', reportController.Delete);

module.exports = router;
