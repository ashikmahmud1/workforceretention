const Organization = require('../models/organization');

//RELATIONAL MODEL
const Client = require('../models/client');
//Validation Library
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

//Validation SCHEMA
const organizationSchema = require('../validation/organization');

exports.Create = function (req, res, next) {
    const data = req.body;
    const clientId = req.params.clientId;
    Joi.validate(data, organizationSchema, (err, value) => {
        if (err) return next(err);
        //First find the employee by id
        //now push this newClient to the employee clients array === employee.clients.push(newPost)
        //now save the employee. this will automatically creates the relationship
        //and the newClient will be added into the staticPage table
        Client.findById(clientId, (err, client) => {
            if (err) return next(err);
            if (!client) {
                return res.status(404).json({status: false, message: 'No staticPage found!'})
            }
            const organization = new Organization(data);
            organization.save().then(organization => {
                client.organizations.push(organization);
                client.save(); //This will return another promise
            }).then(() => {
                return res.status(200).send({
                    "success": true,
                    "message": "Organization successfully created!",
                    organization
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

    Organization.find()
        .countDocuments()
        .then(count => {
            totalItems = count;
            //This will return a new promise with the posts.
            return Organization.find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage);
        }).then(organizations => {
        return res.status(200).json({success: true, organizations, totalItems})
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    });
};

exports.FindById = (req, res, next) => {
    let id = req.params.id;

    Organization.findById(id, (err, organization) => {
        if (err) return next(err);
        if (!organization) {
            return res.status(404).json({
                "success": false,
                "message": "Organization not found"
            })
        }
        return res.status(200).send({
            "success": true,
            "message": "Data successfully retrieve",
            organization
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
    Organization.findByIdAndUpdate(
        // the id of the item to find
        id,
        // the change to be made. Mongoose will smartly combine your existing
        // document with this change, which allows for partial updates too
        data,
        // an option that asks mongoose to return the updated version
        // of the document instead of the pre-updated one.
        {new: true},

        // the callback function
        (err, organization) => {
            // Handle any possible database errors
            if (err) return next(err);
            if (!organization) return res.status(404).json({success: false, message: "Organization not found."});
            return res.send({
                "success": true,
                "message": "Record updated successfully",
                organization
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
        Organization.findByIdAndRemove(id, (err, organization) => {
            // As always, handle any potential errors:
            if (err) return next(err);
            if (!organization) return res.status(404).json({success: false, message: "Organization not found."});
            // We'll create a simple object to send back with a message and the id of the document that was removed
            // You can really do this however you want, though.
            return res.send({
                "success": true,
                "message": "Record deleted successfully",
                organization
            });
        });
    });
};

//RELATIONAL CALLBACK FUNCTION
exports.FindDivisions = (req, res, next) => {
    const organizationId = req.params.organizationId;

    Organization.findById(organizationId)
        .populate([{
            path: 'divisions',
            model: 'Division',
        }])
        .exec(function (err, organization) {
            if (err) return next(err);
            return res.status(200).json({success: true, organization})
        });
};


