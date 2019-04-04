const mongoose = require('mongoose');
const Question = require('../models/question');

//RELATIONAL MODEL
const Survey = require('../models/survey');

//Validation Library
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

//Validation SCHEMA
const questionSchema = require('../validation/question');

exports.Create = function (req, res, next) {
    const data = req.body;

    const surveyId = req.params.surveyId;

    Joi.validate(data, questionSchema, (err, value) => {
        if (err) return next(err);
        //First find the employee by id
        //now push this newClient to the employee clients array === employee.clients.push(newPost)
        //now save the employee. this will automatically creates the relationship
        //and the newClient will be added into the staticPage table
        Survey.findById(surveyId, (err, survey) => {
            if (err) return next(err);
            if (!survey) {
                return res.status(404).json({status: false, message: 'No survey found!'})
            }
            const question = new Question(data);
            question.save().then(question => {
                survey.questions.push(question);
                survey.save(); //This will return another promise
            }).then(() => {
                return res.status(200).send({
                    "success": true,
                    "message": "Question successfully created",
                    question
                })
            }).catch(err => {
                next(err)
            });
        })
    })
};

exports.CreateMany = (req, res, next) => {
    let surveyId = req.params.surveyId;
    let data = req.body;

    // from data we should remove the _id
    data.forEach((question) => {
        delete question._id;
    });
    //get the survey by the surveyId
    Survey.findById(surveyId, (err, survey) => {
        if (err) return next(err);
        if (!survey) {
            return res.status(404).json({status: false, message: 'No survey found!'})
        }
        //Save the Questions into the database
        Question.insertMany(data, (err, docs) => {
            if (err) return next(err);
            //After saving the employees insert all the employees id to the
            //client employees array
            docs.forEach((question) => {
                survey.questions.push(question);
            });
            //Finally save the client
            survey.save().then(() => {
                res.status(200).json({
                    questions: docs,
                    success: true,
                    message: 'Question successfully saved'
                });
            });
        });
    });
};

exports.UpdateSurveyQuestions = (req, res, next) => {
    // here we should make a transactional query.
    // first we need to delete question if any.
    // which question we will delete we also need to remove that question id from the survey question array

    // we need to insert question if any
    // this will return an array of promise with the questions
    // we don't need to return array of promise if we use insertMany query where promise will resolve with docs

    // we need to update question if any
    // this will also return an array of promise

    // finally we also need to update the survey no_of_questions label with the new value

    let surveyId = req.params.surveyId;
    let data = req.body;

    let delete_question_ids = [];
    let new_questions = [];
    let update_questions = [];
    // loop through the data array and separate the collections into delete_question_ids, new_questions, update_questions
    data.forEach((question) => {
        if (question._id == null) {
            // This means this is a new question which needs to be inserted
            delete question._id;
            new_questions.push(question);
        } else if (question.deleted) {
            // this means this question has been deleted so we need to delete from the database as well
            delete_question_ids.push(question._id);
        } else {
            // this means question has been updated
            update_questions.push(question);
        }
    });

    //get the survey by the surveyId
    Survey.findById(surveyId, (err, survey) => {
        if (err) return next(err);
        if (!survey) {
            return res.status(404).json({status: false, message: 'No survey found!'});
        }
        DeleteMany(delete_question_ids).then(() => InsertMany(new_questions)).then((questions) => {
            questions.forEach((question) => {
                survey.questions.push(question);
            });
            UpdateMany(update_questions);
        }).then(() => {
            delete_question_ids.map((id) => {
                let objId = mongoose.Types.ObjectId(id);
                survey.questions = survey.questions.filter(sq => !sq.equals(objId));
            });
            // no of questions will be the survey questions
            survey.no_of_questions = update_questions.length + new_questions.length;
            survey.save();
        }).then(() => {
            return res.send({success: true, message: 'Survey question successfully updated'})
        }).catch(err => {
            return next(err)
        });
    })
    // console.log('************** Deleted Items ************');
    // console.log(delete_question_ids);
    // console.log('************** Insert Items ************');
    // console.log(new_questions);
    // console.log('************** Update Items ************');
    // console.log(update_questions);
    // return res.send({success: true});
};
const DeleteMany = function (delete_question_ids) {
    return new Promise((resolve, reject) => {
        Question.deleteMany({_id: {$in: delete_question_ids}}, function (err) {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        });
    });
};
const InsertMany = function (new_questions) {
    return new Promise((resolve, reject) => {
        Question.insertMany(new_questions, (err, docs) => {
            if (err) {
                reject(err)
            } else {
                resolve(docs);
            }
        })
    });
};
const UpdateMany = function (update_questions) {
    const questionPromises = [];
    update_questions.map((question) => {
        let question_id = question._id;
        delete question._id;
        questionPromises.push(new Promise((resolve, reject) => {
            Question.findById(question_id, function (err, prev_question) {
                if (err) {
                    reject(err);
                } else {
                    prev_question.title = question.title;
                    prev_question.type = question.type;
                    prev_question.options = question.options;
                    prev_question.exit_reason = question.exit_reason;
                    prev_question.exit_reporting_label = question.exit_reporting_label;

                    prev_question.save(function (err, updatedQuestion) {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(updatedQuestion)
                        }
                    });
                }
            });
        }))
    });
    return Promise.all(questionPromises);
};

exports.Find = (req, res, next) => {
    const currentPage = req.query.page || 1; //staticPage number
    const perPage = req.query.perPage || 10; //total items display per staticPage
    let totalItems; //how many items in the database

    Question.find()
        .countDocuments()
        .then(count => {
            totalItems = count;
            //This will return a new promise with the posts.
            return Question.find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage);
        }).then(questions => {
        return res.status(200).json({success: true, questions, totalItems})
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    });
};

exports.FindById = (req, res, next) => {
    let id = req.params.id;

    Question.findById(id, (err, question) => {
        if (err) return next(err);
        if (!question) {
            return res.status(404).json({
                "success": false,
                "message": "Question not found"
            })
        }
        return res.status(200).send({
            "success": true,
            "message": "Data successfully retrieve",
            question
        })
    });
};

exports.Update = (req, res, next) => {
    // fetch the request data
    const data = req.body;
    let id = req.params.id;

    //Update the employee

    // This would likely be inside of a PUT request, since we're updating an existing document, hence the req.params.todoId.
    // Find the existing resource by ID
    Question.findByIdAndUpdate(
        // the id of the item to find
        id,
        // the change to be made. Mongoose will smartly combine your existing
        // document with this change, which allows for partial updates too
        data,
        // an option that asks mongoose to return the updated version
        // of the document instead of the pre-updated one.
        {new: true},

        // the callback function
        (err, question) => {
            // Handle any possible database errors
            if (err) return next(err);
            if (!question) return res.status(404).json({success: false, message: "Question not found."});
            return res.send({
                "success": true,
                "message": "Record updated successfully",
                question
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
        // It allows you to pass a reference back to the staticPage in case they need a reference for some reason.
        Question.findByIdAndRemove(id, (err, question) => {
            // As always, handle any potential errors:
            if (err) return next(err);
            if (!question) return res.status(404).json({success: false, message: "Question not found."});
            // We'll create a simple object to send back with a message and the id of the document that was removed
            // You can really do this however you want, though.
            return res.send({
                "success": true,
                "message": "Record deleted successfully",
                question
            });
        });
    });
};
