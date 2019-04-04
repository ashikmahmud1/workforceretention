const Industry = require('../models/industry');

//Validation Library
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

//Validation SCHEMA
const industrySchema = require('../validation/industry');

exports.Create = function (req, res, next) {
    const data = req.body;
    Joi.validate(data, industrySchema, (err, value) => {
        if (err) return next(err);

        const industry = new Industry(data);

        industry.save(function (err) {
            if (err) next(err);
            return res.status(200).send({
                "success": true,
                "message": "Industry successfully created",
                industry
            })
        })
    })
}

exports.Find = (req, res, next) => {
    const currentPage = Number(req.query.page || 1); //staticPage number
    const perPage = Number(req.query.perPage || 10); //total items display per staticPage
    let totalItems; //how many items in the database

    Industry.find()
        .countDocuments()
        .then(count => {
            totalItems = count;
            //This will return a new promise with the posts.
            return Industry.find()
                .skip((currentPage) * perPage)
                .limit(perPage);
        }).then(industries => {
        return res.status(200).json({success: true, industries, totalItems})
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    });
};

exports.FindById = (req, res, next) => {
    let id = req.params.id;

    Industry.findById(id, (err, industry) => {
        if (err) return next(err);
        if (!industry) {
            return res.status(404).json({
                "success": false,
                "message": "Organization not found"
            })
        }
        return res.status(200).send({
            "success": true,
            "message": "Data successfully retrieve",
            industry
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
    Industry.findByIdAndUpdate(
        // the id of the item to find
        id,
        // the change to be made. Mongoose will smartly combine your existing
        // document with this change, which allows for partial updates too
        data,
        // an option that asks mongoose to return the updated version
        // of the document instead of the pre-updated one.
        {new: true},

        // the callback function
        (err, industry) => {
            // Handle any possible database errors
            if (err) return next(err);
            if (!industry) return res.status(404).json({success: false, message: "Industry not found."});
            return res.send({
                "success": true,
                "message": "Record updated successfully",
                industry
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
        Industry.findByIdAndRemove(id, (err, industry) => {
            // As always, handle any potential errors:
            if (err) return next(err);
            if (!industry) return res.status(404).json({success: false, message: "Industry not found."});
            // We'll create a simple object to send back with a message and the id of the document that was removed
            // You can really do this however you want, though.
            return res.send({
                "success": true,
                "message": "Record deleted successfully",
                industry
            });
        });
    });
};

