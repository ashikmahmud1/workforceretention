const Link = require('../models/link');

//RELATIONAL MODEL
const User = require('../models/user');
//Validation Library
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

//Validation SCHEMA
const linkSchema = require('../validation/link');

exports.Create = function (req, res, next) {
    const data = req.body;
    const userId = req.params.clientId;

    Joi.validate(data, linkSchema, (err, value) => {
        if (err) return next(err);

        //First find the employee by id
        //now push this newClient to the employee clients array === employee.clients.push(newPost)
        //now save the employee. this will automatically creates the relationship
        //and the newClient will be added into the staticPage table
        User.findById(userId, (err, user) => {
            if (err) return next(err);
            if (!user) {
                return res.status(404).json({status: false, message: 'No employee found!'})
            }
            const link = new Link(data);
            link.save().then(link => {
                user.links.push(link);
                user.save(); //This will return another promise
            }).then(() => {
                return res.status(200).send({
                    "success": true,
                    "message": "Link successfully created",
                    link
                })
            }).catch(err => {
                next(err)
            });
        })
    })
}

exports.Find = (req, res, next) => {
    const currentPage = Number(req.query.page || 1); //staticPage number
    const perPage = Number(req.query.perPage || 10); //total items display per staticPage
    let totalItems; //how many items in the database

    Link.find()
        .countDocuments()
        .then(count => {
            totalItems = count;
            //This will return a new promise with the posts.
            return Link.find()
                .skip((currentPage) * perPage)
                .limit(perPage);
        }).then(links => {
        return res.status(200).json({success: true, links, totalItems})
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    });
};

exports.FindById = (req, res, next) => {
    let id = req.params.id;

    Link.findById(id, (err, link) => {
        if (err) return next(err);
        if (!link) {
            return res.status(404).json({
                "success": false,
                "message": "Link not found"
            })
        }
        return res.status(200).send({
            "success": true,
            "message": "Data successfully retrieve",
            link
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
    Link.findByIdAndUpdate(
        // the id of the item to find
        id,
        // the change to be made. Mongoose will smartly combine your existing
        // document with this change, which allows for partial updates too
        data,
        // an option that asks mongoose to return the updated version
        // of the document instead of the pre-updated one.
        {new: true},

        // the callback function
        (err, link) => {
            // Handle any possible database errors
            if (err) return next(err);
            if (!link) return res.status(404).json({success: false, message: "Link not found."});
            return res.send({
                "success": true,
                "message": "Record updated successfully",
                link
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
            res.status(422).json({
                status: 'error',
                message: 'Invalid request data',
                data: err
            });
        }
        // The "todo" in this callback function represents the document that was found.
        // It allows you to pass a reference back to the staticPage in case they need a reference for some reason.
        Link.findByIdAndRemove(id, (err, link) => {
            // As always, handle any potential errors:
            if (err) return next(err);
            if (!link) return res.status(404).json({success: false, message: "Link not found."});
            // We'll create a simple object to send back with a message and the id of the document that was removed
            // You can really do this however you want, though.
            return res.send({
                "success": true,
                "message": "Record deleted successfully",
                link
            });
        });
    });
};

