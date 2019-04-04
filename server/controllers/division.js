const Division = require('../models/division');

//RELATIONAL MODEL
const Organization = require('../models/organization');
//Validation Library
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

//Validation SCHEMA
const divisionSchema = require('../validation/division');

exports.Create = function (req, res, next) {
    const data = req.body;
    const organizationId = req.params.organizationId;
    Joi.validate(data, divisionSchema, (err, value) => {
        if (err) return next(err);

        //First find the employee by id
        //now push this newClient to the employee clients array === employee.clients.push(newPost)
        //now save the employee. this will automatically creates the relationship
        //and the newClient will be added into the staticPage table
        Organization.findById(organizationId, (err, organization) => {
            if (err) return next(err);
            if (!organization) {
                return res.status(404).json({status: false, message: 'No organization found!'})
            }
            const division = new Division(data);
            division.save().then(division => {
                organization.divisions.push(division);
                organization.save(); //This will return another promise
            }).then(() => {
                return res.status(200).send({
                    "success": true,
                    "message": "Division successfully created",
                    division
                })
            }).catch(err => {
                next(err)
            });
        })
    })
}

exports.Find = (req, res, next) => {
    const currentPage = req.query.page || 1; //staticPage number
    const perPage = req.query.perPage || 10; //total items display per staticPage
    let totalItems; //how many items in the database

    //Division.find({name:somename}) this is how we can implement search functionality
    Division.find({})
        .countDocuments()
        .then(count => {
            totalItems = count;
            //This will return a new promise with the posts.
            return Division.find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage);
        }).then(divisions => {
        return res.status(200).json({success: true, divisions, totalItems})
    }).catch(err => {
        next(err)
    });
};

exports.FindById = (req, res, next) => {
    let id = req.params.id;

    Division.findById(id, (err, division) => {
        if (err) return next(err);
        if (!division) {
            return res.status(404).json({
                "success": false,
                "message": "Division not found"
            })
        }
        return res.status(200).send({
            "success": true,
            "message": "Data successfully retrieve",
            division
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
    Division.findByIdAndUpdate(
        // the id of the item to find
        id,
        // the change to be made. Mongoose will smartly combine your existing
        // document with this change, which allows for partial updates too
        data,
        // an option that asks mongoose to return the updated version
        // of the document instead of the pre-updated one.
        {new: true},

        // the callback function
        (err, division) => {
            // Handle any possible database errors
            if (err) return next(err);
            if (!division) return res.status(404).json({success: false, message: "Division not found."});
            return res.send({
                "success": true,
                "message": "Record updated successfully",
                division
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
        Division.findByIdAndRemove(id, (err, division) => {
            // As always, handle any potential errors:
            if (err) return next(err);
            if (!division) return res.status(404).json({success: false, message: "Division not found."});
            // We'll create a simple object to send back with a message and the id of the document that was removed
            // You can really do this however you want, though.
            return res.send({
                "success": true,
                "message": "Record deleted successfully",
                division
            });
        });
    });
};

//RELATIONAL CALLBACK FUNCTION
exports.FindDepartments = (req, res, next) => {
    const divisionId = req.params.divisionId;

    Division.findById(divisionId)
        .populate([{
            path: 'departments',
            model: 'Department',
        }])
        .exec(function (err, division) {
            if (err) return next(err);
            return res.status(200).json({success: true, division})
        });
};

