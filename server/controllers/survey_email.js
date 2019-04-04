const SurveyEmail = require('../models/survey_email');

//Validation Library
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

//Validation SCHEMA
const surveyEmailSchema = require('../validation/survey_email');

exports.Create = function (req, res, next) {
    const data = req.body;
    Joi.validate(data, surveyEmailSchema, (err, value) => {
        if (err) return next(err);
        //First find the employee by id
        //now push this newPost to the employee clients array === employee.clients.push(newPost)
        //now save the employee. this will automatically creates the relationship
        //and the newPost will be added into the C
        const surveyEmail = new SurveyEmail(data);
        surveyEmail.save(function (err) {
            if (err) next(err);
            return res.status(200).send({
                "success": true,
                "message": "SurveyEmail successfully created",
                surveyEmail
            })
        })
    })
}

exports.Find = (req, res, next) => {
    let currentPage = Number(req.query.page || 1); //staticPage number
    const perPage = Number(req.query.perPage || 10); //total items display per staticPage
    let totalItems; //how many items in the database

    SurveyEmail.find()
        .countDocuments()
        .then(count => {
            totalItems = count;
            //This will return a new promise with the posts.
            return SurveyEmail.find()
                .skip((currentPage) * perPage)
                .limit(perPage);
        }).then(surveyEmails => {
        return res.status(200).json({success: true, surveyEmails, totalItems})
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    });
};

exports.FindById = (req, res, next) => {
    let id = req.params.id;

    SurveyEmail.findById(id, (err, surveyEmail) => {
        if (err) return next(err);
        if (!surveyEmail) {
            const error = new Error('SurveyEmail not found');
            error.statusCode = 404;
            return next(error);
        }
        return res.status(200).send({
            "success": true,
            "message": "Data successfully retrieve",
            surveyEmail
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
    SurveyEmail.findByIdAndUpdate(
        // the id of the item to find
        id,
        // the change to be made. Mongoose will smartly combine your existing
        // document with this change, which allows for partial updates too
        data,
        // an option that asks mongoose to return the updated version
        // of the document instead of the pre-updated one.
        {new: true},

        // the callback function
        (err, surveyEmail) => {
            // Handle any possible database errors
            if (err) return next(err);
            if (!surveyEmail) {
                const error = new Error('SurveyEmail not found');
                error.statusCode = 404;
                return next(error);
            }
            return res.send({
                "success": true,
                "message": "Record updated successfully",
                surveyEmail
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
                success: false,
                message: 'Invalid request data',
                err
            });
        }
        // The "todo" in this callback function represents the document that was found.
        // It allows you to pass a reference back to the staticPage in case they need a reference for some reason.
        SurveyEmail.findByIdAndRemove(id, (err, surveyEmail) => {
            // As always, handle any potential errors:
            if (err) return next(err);
            if (!surveyEmail) {
                const error = new Error('SurveyEmail not found');
                error.statusCode = 404;
                return next(error);
            }
            // We'll create a simple object to send back with a message and the id of the document that was removed
            // You can really do this however you want, though.
            return res.send({
                "success": true,
                "message": "Record deleted successfully",
                surveyEmail
            });
        });
    });
};

