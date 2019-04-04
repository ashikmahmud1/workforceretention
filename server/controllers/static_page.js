const StaticPage = require('../models/static_page');

//Validation Library
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

//Validation SCHEMA
const staticPageSchema = require('../validation/static_page');

exports.Create = function (req, res, next) {
    const data = req.body;
    Joi.validate(data, staticPageSchema, (err, value) => {
        if (err) return next(err);

        const staticPage = new StaticPage(data);

        staticPage.save(function (err) {
            if (err) return next(err);
            return res.status(200).send({
                "success": true,
                "message": "Record successfully created",
                staticPage
            })
        })
    })
}

exports.Find = (req, res, next) => {
    const currentPage = Number(req.query.page || 1); //staticPage number
    const perPage = Number(req.query.perPage || 10); //total items display per staticPage
    let totalItems; //how many items in the database

    StaticPage.find()
        .countDocuments()
        .then(count => {
            totalItems = count;
            //This will return a new promise with the posts.
            return StaticPage.find()
                .skip((currentPage) * perPage)
                .limit(perPage);
        }).then(staticPages => {
        return res.status(200).json({success: true, staticPages, totalItems})
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    });
};

exports.FindById = (req, res, next) => {
    let id = req.params.id;

    StaticPage.findById(id, (err, staticPage) => {
        if (err) return next(err);
        if (!staticPage) {
            return res.status(404).json({
                "success": false,
                "message": "Page not found"
            })
        }
        return res.status(200).send({
            "success": true,
            "message": "Data successfully retrieve",
            staticPage
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
    StaticPage.findByIdAndUpdate(
        // the id of the item to find
        id,
        // the change to be made. Mongoose will smartly combine your existing
        // document with this change, which allows for partial updates too
        data,
        // an option that asks mongoose to return the updated version
        // of the document instead of the pre-updated one.
        {new: true},

        // the callback function
        (err, staticPage) => {
            // Handle any possible database errors
            if (err) return next(err);
            if (!staticPage) return res.status(404).json({success: false, message: "Page not found."});
            return res.send({
                "success": true,
                "message": "Record updated successfully",
                staticPage
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
        StaticPage.findByIdAndRemove(id, (err, staticPage) => {
            // As always, handle any potential errors:
            if (err) return next(err);
            if (!staticPage) return res.status(404).json({success: false, message: "Page not found."});
            // We'll create a simple object to send back with a message and the id of the document that was removed
            // You can really do this however you want, though.
            return res.send({
                "success": true,
                "message": "Record deleted successfully",
                staticPage
            });
        });
    });
};

