const Survey = require('../models/survey');
const path = require('path');
const puppeteer = require('puppeteer');
//RELATIONAL MODEL
const Question = require('../models/question');
const Answer = require('../models/answer');
const Employee = require('../models/employee');

const User = require('../models/user');

//Validation Library
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

//Validation SCHEMA
const surveySchema = require('../validation/survey');

exports.Create = function (req, res, next) {
    const data = req.body;

    const userId = req.params.userId;

    Joi.validate(data, surveySchema, (err, value) => {
        if (err) return next(err);
        //First find the employee by id
        //now push this newSurvey to the employee surveys array === employee.surveys.push(newPost)
        //now save the employee. this will automatically creates the relationship
        //and the newSurvey will be added into the survey table
        User.findById(userId, (err, user) => {
            if (err) return next(err);
            if (!user) {
                return res.status(404).json({status: false, message: 'No user found!'})
            }
            data.user = userId;
            const survey = new Survey(data);
            survey.save().then(survey => {
                user.surveys.push(survey);
                user.save(); //This will return another promise
            }).then(() => {
                return res.status(200).send({
                    "success": true,
                    "message": "Survey successfully created",
                    survey
                })
            }).catch(err => {
                next(err)
            });
        })
    })
};

exports.Clone = (req, res, next) => {
    let surveyId = req.params.surveyId;
    let userId = req.query.userId;

    Survey.findById(surveyId)
        .populate([{
            path: 'questions',
            model: 'Question',
        }])
        .exec(function (err, survey) {
            if (err) return next(err);
            // here we will get all the survey questions
            // create a new survey with the existing survey.
            // survey will return a new promise
            // after getting the survey set the survey questions with the returned questions
            // survey fields answer_rating(Array), questions(Array), rating_labels(Array),survey_type, rating_scale, title, description, instruction, user
            // user will be who is cloning the survey
            let new_survey = {
                title: survey.title + ' COPY',
                description: survey.description,
                instruction: survey.instruction,
                rating_labels: survey.rating_labels,
                questions: [],
                ratings: [],
                no_of_questions: survey.no_of_questions,
                survey_type: survey.survey_type,
                rating_scale: survey.rating_scale,
                answer_rating: [],
                user: userId
            };
            User.findById(userId, (err, user) => {
                if (err) return next(err);
                if (!user) {
                    return res.status(404).json({status: false, message: 'No user found!'})
                }
                // create a new survey object
                const survey_object = new Survey(new_survey);
                survey_object.save((err) => {
                    if (err) return next(err);
                    // user surveys push the newly created survey
                    user.surveys.push(survey_object);
                    // push the question id to the survey questions array
                    CreateQuestions(survey.questions).then((questions) => {
                        questions.forEach((question) => {
                            survey_object.questions.push(question._id);
                        });
                        survey_object.save();
                    }).then(() => {
                        user.save(); //This will return another promise
                    }).then(() => {
                        return res.status(200).send({
                            "success": true,
                            "message": "Survey successfully created",
                            survey_object
                        })
                    }).catch(err => {
                        next(err);
                    })
                })
            });
        });
};

const CreateQuestions = function (questions) {
    let questionArray = [];
    // question property
    // title, type, exit_reason, exit_reporting_label, answers, options(optional)
    questions.map((question) => {
        let new_formatted_question = {
            title: question.title,
            exit_reason: question.exit_reason,
            exit_reporting_label: question.exit_reporting_label,
            type: question.type,
            answers: []
        };
        if (!isNullOrEmpty(question.options)) {
            new_formatted_question.options = question.options;
        }
        questionArray.push(new_formatted_question);

    });
    return new Promise((resolve, reject) => {
        //Save the Questions into the database
        Question.insertMany(questionArray, (err, docs) => {
            if (err) {
                reject(err)
            } else {
                resolve(docs)
            }
        });
    })
};

const isNullOrEmpty = function (obj) {
    return typeof obj === "undefined" || obj === null;
};

exports.Find = (req, res, next) => {
    const currentPage = Number(req.query.page || 1); //staticPage number
    const perPage = Number(req.query.perPage || 10); //total items display per staticPage
    let totalItems; //how many items in the database

    Survey.find()
        .countDocuments()
        .then(count => {
            totalItems = count;
            //This will return a new promise with the posts.
            return Survey.find()
                .skip((currentPage) * perPage)
                .limit(perPage);
        }).then(surveys => {
        return res.status(200).json({success: true, surveys, totalItems})
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    });
};

exports.FindById = (req, res, next) => {
    let id = req.params.id;

    Survey.findById(id, (err, survey) => {
        if (err) return next(err);
        if (!survey) {
            return res.status(404).json({
                "success": false,
                "message": "Survey not found"
            })
        }
        return res.status(200).send({
            "success": true,
            "message": "Data successfully retrieve",
            survey
        })
    });
};

exports.PrintCompletedSurvey = async (req, res) => {
    // here we will get the url from the request body
    //here we need to configure puppeteer for printing pdf
    const url = req.body.url;
    const baseUrl = 'http://skydeveloperonline.com:8080';
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // here generate a unique name for the file
    const fileName = Date.now() + '_employee_survey.pdf';
    const filePath = path.join(__dirname, '../pdf/' + fileName);
    const options = {
        path: filePath,
        format: 'A4',
        printBackground: true
    };
    await page.goto(baseUrl + url, {waitUntil: 'networkidle2'});
    await page.pdf(options);
    await browser.close();
    res.json({fileName: fileName});
};

exports.Update = (req, res, next) => {
    // fetch the request data
    const data = req.body;
    let id = req.params.id;

    //Update the employee

    // This would likely be inside of a PUT request, since we're updating an existing document, hence the req.params.todoId.
    // Find the existing resource by ID
    Survey.findByIdAndUpdate(
        // the id of the item to find
        id,
        // the change to be made. Mongoose will smartly combine your existing
        // document with this change, which allows for partial updates too
        data,
        // an option that asks mongoose to return the updated version
        // of the document instead of the pre-updated one.
        {new: true},

        // the callback function
        (err, survey) => {
            // Handle any possible database errors
            if (err) return next(err);
            if (!survey) return res.status(404).json({success: false, message: "Survey not found."});
            return res.send({
                "success": true,
                "message": "Record updated successfully",
                survey
            });
        }
    );
};

exports.Delete = (req, res, next) => {
    let id = req.params.id;

    const schema = Joi.object({
        id: Joi.objectId()
    });

    Joi.validate({id}, schema, (err, value) => {
        if (err) {
            // send a 422 error response if validation fails
            return res.status(422).json({
                status: 'error',
                message: 'Invalid request data',
                err
            });
        }
        // The "todo" in this callback function represents the document that was found.
        // It allows you to pass a reference back to the survey in case they need a reference for some reason.
        Survey.findByIdAndRemove(id, (err, survey) => {
            // As always, handle any potential errors:
            if (err) return next(err);
            if (!survey) return res.status(404).json({success: false, message: "Survey not found."});
            // We'll create a simple object to send back with a message and the id of the document that was removed
            // You can really do this however you want, though.
            return res.send({
                "success": true,
                "message": "Record deleted successfully",
                survey
            });
        });
    });
};


//RELATIONAL DATA FIND FUNCTIONS
// Get survey question

exports.SurveyQuestions = (req, res, next) => {
    let surveyId = req.params.surveyId;

    Survey.findById(surveyId)
        .populate([{
            path: 'questions',
            model: 'Question',
        }])
        .exec(function (err, survey) {
            if (err) return next(err);
            return res.status(200).json({success: true, survey})
        });
};
//
exports.SurveyWithQuestionAnswer = (req, res, next) => {
    let surveyId = req.params.surveyId;
    let employeeId = req.query.employeeId;

    let response_object = {};

    Survey.findById(surveyId)
        .populate([{
            path: 'questions',
            model: 'Question',
        }])
        .exec(function (err, survey) {
            if (err) return next(err);
            response_object.survey = survey;
            surveyQuestionAnswer(surveyId, employeeId).then(
                (answers) => {
                    // here find the employee
                    response_object.answers = answers;
                    return findEmployee(employeeId)
                }).then((employee) => {
                response_object.success = true;
                response_object.employee = employee;
                return res.status(200).json(response_object);
            })
        });
};

const findEmployee = function (employeeId) {
    return new Promise((resolve, reject) => {
        Employee.findById(employeeId, (err, employee) => {
            if (err) {
                reject(err);
            } else {
                resolve(employee);
            }
        })
    });
};

const surveyQuestionAnswer = function (surveyId, employeeId) {
    return new Promise((resolve, reject) => {
        Answer.find({survey: surveyId, employee: employeeId}, (err, answers) => {
            if (err) {
                reject(err);
            } else {
                resolve(answers);
            }

        })
    })
};
// Get survey question answer by employee
exports.SurveyQuestionsAnswers = (req, res, next) => {
    let surveyId = req.params.surveyId;

    Survey.findById(surveyId)
        .populate([{
            path: 'questions',
            model: 'Question',
            populate: {
                path: 'questions.answers'
            }
        }])
        .exec(function (err, survey) {
            if (err) return next(err);
            return res.status(200).json({success: true, survey})
        });
};
