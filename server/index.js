const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// date format is used united states format which is mm/dd/yyyy
// but we need to use australian date format which is dd/mm/yyyy
// when uploading employee we need to convert the date from australian format dd/mm/yyyy to united states format mm/dd/yyyy

// ********************************* LIBRARY ******************************
// Mongoose is used for Connecting to MongoDB Database and Query
// ngx-charts is used for Charting in Angular
// ngx-datatable is used for showing data in Table in Angular
// ngx-toastr is used for showing toast notification in angular
// angular2-toaster is used for showing toast notification in Angular
// bcryptjs is used for encrypting password
// body-parser is used to parse the data from the request body
// ckeeditor is used for editable textbox
// csv-parse is used for parsing csv data
// convert-csv-to-json is used for converting csv data to json format
// Joi is used for validation
// multer is used for file upload in node.js
// puppeteer is used for converting html to pdf in node.js
// jsonwebtoken is used for generating token for authentication
// uuid is used for generating unique id
// generate-password is used for generating password
// cors is used for enabling cross origin resource sharing (Allow ajax request from other domain)
// nodemailer is used for sending email

// ********************************* CODING CONVENTION ******************************
// router name will be plural, model and controller name will be singular
// Will use camel-case convention for declaring variable and functions
// For Schema Design Multiple Word Property will declare such a way is_active [underscore will be the separator]
// Sometimes we don't need a table rather we need a Schema that's why I created Schema folder
// We should never store the token in the database.
// We don't need any individual routes for logout because we are not saving the token anywhere in the server. just need to delete the token from staticPage

//CONFIG
const config = require('./config');

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const questionRoutes = require('./routes/questions');
const answerRoutes = require('./routes/answer');
const articleRoutes = require('./routes/articles');
const departmentRoutes = require('./routes/departments');
const emailRoutes = require('./routes/emails');
const linkRoutes = require('./routes/links');
const employeeRoutes = require('./routes/employees');
const industryRoutes = require('./routes/industries');
const organizationRoutes = require('./routes/organizations');
const pageRoutes = require('./routes/pages');
const surveyRoutes = require('./routes/surveys');
const clientRoutes = require('./routes/clients');
const divisionRoutes = require('./routes/divisions');
const roleRoutes = require('./routes/roles');
const boxRoutes = require('./routes/boxs');
const categoryRoutes = require('./routes/categories');
const staticPageRoutes = require('./routes/static_pages');
const surveyEmailRoutes = require('./routes/survey_emails');
const reportRoutes = require('./routes/reports');

//Connect with the mongodb database
mongoose.connect(config.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true
}).then(() => console.log('Connected to MongoDB'))
    .catch(error => console.log('could not connect', error));
mongoose.set('useFindAndModify', false);

//body-parser configuration for reading data from request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false})); // x-www-form-urlencoded

//ENABLE CORS. FOR CROSS ORIGIN RESOURCE SHARING
app.use(cors());

app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//SET UP ROUTES
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/clients', clientRoutes);
app.use('/api/v1/surveys', surveyRoutes);
app.use('/api/v1/questions', questionRoutes);
app.use('/api/v1/answers', answerRoutes);
app.use('/api/v1/articles', articleRoutes);
app.use('/api/v1/emails', emailRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/links', linkRoutes);
app.use('/api/v1/departments', departmentRoutes);
app.use('/api/v1/pages', pageRoutes);
app.use('/api/v1/static_pages', staticPageRoutes);
app.use('/api/v1/industries', industryRoutes);
app.use('/api/v1/organizations', organizationRoutes);
app.use('/api/v1/divisions', divisionRoutes);
app.use('/api/v1/roles', roleRoutes);
app.use('/api/v1/boxes', boxRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/survey_emails', surveyEmailRoutes);
app.use('/api/v1/reports', reportRoutes);

//Angular DIST output folder
const appPath = path.join(__dirname, '..', 'dist');
app.use(express.static(appPath));

// This route is for downloading file
app.get('/:file(*)', function (req, res) { // this routes all types of file

    const file = req.params.file;

    const filePath = path.resolve(".") + '/' + file;

    res.download(filePath); // magic of download function

});
// Serve the Angular index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(appPath, 'index.html'))
});

//Middleware function for handling error
//This Middleware function will execute if any error is thrown
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({message, success: false})
});


app.listen(8080, () => {
    console.log('server is running')
});
