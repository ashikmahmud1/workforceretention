const mongoose = require('mongoose');
const Client = require('../models/client');

//RELATIONAL MODEL
const User = require('../models/user');
const Employee = require('../models/employee');
const Email = require('../models/email');

//Validation Library
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

//Validation SCHEMA
const clientSchema = require('../validation/client');

//Email Template
const email_template = require('../helpers/email_template');

exports.Create = function (req, res, next) {
    const data = req.body;

    const userId = req.params.userId;
    if (typeof req.file !== 'undefined') {
        data.image = req.file.filename;
    }

    Joi.validate(data, clientSchema, (err, value) => {
        if (err) {
            return next(err)
        }
        //First find the employee by id
        //now push this newClient to the employee clients array === employee.clients.push(newPost)
        //now save the employee. this will automatically creates the relationship
        //and the newClient will be added into the staticPage table
        User.findById(userId, (err, user) => {
            if (err) return next(err);
            if (!user) {
                //set error that employee not found
                return res.status(404).json({status: false, message: 'No employee found!'})
            }
            // before creating the client. set the client emails
            // so that later time can edit that email

            // read all the emails from the email table
            // then check if the email assign_to_client property is true or not.
            // if true then push that email into the emails
            Email.find({}, function (err, emails) {
                if (err) return next(err);
                let client_emails = [];
                emails.forEach((email) => {
                    if (email.assign_to_client) {
                        delete email._id;
                        client_emails.push(email)
                    }
                });
                data.emails = client_emails;

                const client = new Client(data);
                client.save().then(client => {
                    user.clients.push(client);
                    user.save(); //This will return another promise
                }).then(() => {
                    //Here create The Client Email template for sending employee username and password

                    return res.status(200).send({
                        "success": true,
                        "message": "Client successfully created",
                        client
                    })
                }).catch(err => {
                    return next(err)
                });
            });

        })
    })
};

exports.Find = (req, res, next) => {
    const currentPage = Number(req.query.page || 1); //staticPage number
    const perPage = Number(req.query.perPage || 10); //total items display per staticPage
    let totalItems; //how many items in the database

    Client.find()
        .countDocuments()
        .then(count => {
            totalItems = count;
            //This will return a new promise with the posts.
            return Client.find({}, '-surveys -organizations')
                .populate({
                    path: 'industry',
                    model: 'Industry',
                    select: 'name'
                })
                .skip((currentPage) * perPage)
                .limit(perPage);
        }).then(clients => {
        return res.status(200).json({success: true, clients, totalItems})
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    });
};

exports.FindById = (req, res, next) => {
    let id = req.params.id;

    Client.findById(id).populate({
        path: 'industry',
        model: 'Industry'
    }).exec(function (err, client) {
        if (err) return next(err);
        return res.status(200).json({success: true, "message": "Data successfully retrieve", client})
    });
};

exports.Update = (req, res, next) => {
    // fetch the request data
    const data = req.body;
    let id = req.params.id;

    if (typeof req.file !== 'undefined') {
        data.image = req.file.filename;
    }

    //Update the employee

    // This would likely be inside of a PUT request, since we're updating an existing document, hence the req.params.todoId.
    // Find the existing resource by ID
    Client.findByIdAndUpdate(
        // the id of the item to find
        id,
        // the change to be made. Mongoose will smartly combine your existing
        // document with this change, which allows for partial updates too
        data,
        // an option that asks mongoose to return the updated version
        // of the document instead of the pre-updated one.
        {new: true},

        // the callback function
        (err, client) => {
            // Handle any possible database errors
            if (err) return next(err);
            if (!client) {
                return res.status(404).json({success: false, message: "Client not found."});
            }
            return res.send({
                "success": true,
                "message": "Record updated successfully",
                client
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
        Client.findByIdAndRemove(id, (err, client) => {
            // As always, handle any potential errors:
            if (err) return next(err);
            if (!client) return res.status(404).json({success: false, message: "Client not found."});
            // We'll create a simple object to send back with a message and the id of the document that was removed
            // You can really do this however you want, though.

            // now find all the employees under this client and delete them as well
            // since without the client employee should not exist
            Employee.deleteMany({_id: {$in: client.employees}}, function (err) {
                if (err) return next(err);
                return res.send({
                    "success": true,
                    "message": "Record deleted successfully",
                    client
                });
            });
        });
    });
};


//RELATIONAL DATA FIND FUNCTIONS
exports.FindEmployees = (req, res, next) => {
    const currentPage = Number(req.query.page || 1); //staticPage number
    const perPage = Number(req.query.perPage || 10); //total items display per staticPage
    let totalItems; //how many items in the database
    const clientId = req.params.clientId;
    let prop = req.body.prop;
    let sortProp = {};

    if (typeof prop != 'undefined' && prop != null) {
        sortProp[prop] = req.body.order
    } else {
        sortProp['first_name'] = 'ascending';
    }

    Client.findById(clientId)
        .populate([{
            path: 'employees',
            model: 'Employee',
            options: {
                sort: sortProp,
            }
        }])
        .exec(function (err, client) {
            if (err) return next(err);
            // ********** Pagination Logic ********
            totalItems = client.employees.length;
            let employees = [];
            let startIndex = currentPage * perPage;
            let endIndex = startIndex + perPage;
            for (let i = startIndex; i < endIndex; i++) {
                if (typeof client.employees[i] !== 'undefined')
                    employees.push(client.employees[i]);
            }
            // ********** End of Pagination Logic ***********
            return res.status(200).json({success: true, client, employees, totalItems})
        });
};


exports.FindSurveys = (req, res, next) => {

    const clientId = req.params.clientId;

    Client.findById(clientId)
        .populate([{
            path: 'surveys',
            model: 'Survey',
        }])
        .exec(function (err, client) {
            if (err) return next(err);
            return res.status(200).json({success: true, client})
        });
};
exports.FindEmails = (req, res, next) => {
    const clientId = req.params.clientId;

    Client.findById(clientId)
        .populate([{
            path: 'emails.email'
        }])
        .exec(function (err, client) {
            if (err) return next(err);
            return res.status(200).json({success: true, client})
        });
};
exports.FindEmailById = (req, res, next) => {
    const clientId = req.params.clientId;
    const emailId = req.query.emailId;
    //first find the client
    //search the sub_document and match with the id
    Client.findById(clientId, (err, client) => {
        if (err) return next(err);
        if (!client) {
            return res.status(404).json({
                "success": false,
                "message": "Client not found"
            })
        }
        // find the subdocument
        const email = client.emails.id(emailId);
        return res.status(200).send({
            "success": true,
            "message": "Data successfully retrieve",
            email
        })
    });
    // if id is same then return that subdocument
};
exports.UpdateEmail = (req, res, next) => {
    const clientId = req.params.clientId;
    const emailId = req.query.emailId;
    const data = req.body;

    console.log(data);

    Client.findById(clientId, (err, client) => {
        if (err) return next(err);
        if (!client) {
            return res.status(404).json({
                "success": false,
                "message": "Client not found"
            })
        }
        // find the subdocument
        const email = client.emails.id(emailId);
        //update the subdocument
        email.set(data);
        client.save().then(client => {
            return res.status(200).send({
                "success": true,
                "message": "Client email successfully updated",
                email
            })
        });
    });
};

exports.FindOrganizations = (req, res, next) => {

    const clientId = req.params.clientId;
    Client.findById(clientId)
        .populate({
            path: 'organizations',
            model: 'Organization',
            select: 'name',
            populate: {
                path: 'divisions',
                model: 'Division',
                select: 'name',
                populate: {
                    path: 'departments',
                    model: 'Department',
                    select: 'name'
                }
            }
        })
        .exec(function (err, client) {
            if (err) return next(err);
            return res.status(200).json({success: true, client})
        });
};

exports.AssignSurvey = (req, res, next) => {
    const surveyId = req.query.surveyId;
    const clientId = req.query.clientId;

    //check if the client is found or not
    Client.findById(clientId).then((client) => {
        client.surveys.push(surveyId);
        // Also find all the employees under this client
        // Foreach employee survey list save the survey
        // Finally send email to that employee
        employeeAssignSurvey(client.employees, surveyId).then(
            (employees) => {
                client.save()
            }).then(() => {
            res.json({client, success: true, message: 'Survey successfully assigned'})
        }).catch(err => {
            return next(err);
        });
    })
};

const employeeAssignSurvey = (employees, surveyId) => {
    // here employees is a collection of employee object
    // but we only need employee ids
    let employee_ids = [];
    employees.forEach(employee => {
        employee_ids.push(employee._id);
    });
    return new Promise((resolve, reject) => {
        // here employee is the id of the employee.
        Employee.find({'_id': {$in: employee_ids}}, function (err, docs) {
            if (err) {
                reject(err)
            } else {
                docs.forEach((employee) => {
                    let survey = {survey: surveyId, completed: false};
                    //before pushing the survey check if this employee can do survey or not
                    employee.surveys.push(survey);
                    employee.save();
                });
                resolve(docs)
            }
        });
        // so first we should get the employee
        // we should save the survey in the employee surveys array
        // then we should send an email to that employee that a survey is assign to that employee
    });
};
exports.UnAssignSurvey = (req, res, next) => {
    let surveyId = req.query.surveyId;
    const clientId = req.query.clientId;

    //Check if the client is found or not

    Client.findById(clientId).populate({
        path: 'employees',
        model: 'Employee',
    }).exec((err, client) => {
        client.surveys.map((survey, index) => {
            surveyId = mongoose.Types.ObjectId(surveyId);
            if (survey.equals(surveyId)) {
                client.surveys.splice(index, 1);
                // whoever employee under this client assigned that survey un-assign that survey
            }
        });
        // *************** Checking If any Employees Completed The Survey ***************
        let completedSurvey = false;
        for (let i = 0; i < client.employees.length; i++) {
            if (client.employees[0].surveys[0].completed) {
                completedSurvey = true;
                break;
            }
        }
        // *************** If any employee is not completed the survey. then unAssign Survey from client *******
        if (!completedSurvey) {
            employeeUnAssignSurvey(client.employees, surveyId).then(
                () => {
                    client.save();
                }).then(() => {
                return res.json({client, success: true, message: 'Survey successfully unAssigned'})
            }).catch(err => {
                return next(err);
            });
        } else {
            return next(new Error('Employee under client ' + client.name + ' already completed assign survey. you are not allowed to unAssign survey'));
        }
    })
};

const employeeUnAssignSurvey = (employees, surveyId) => {
    return new Promise((resolve, reject) => {
        // here employee is the id of the employee.
        Employee.find({
            '_id': {$in: employees}
        }, function (err, docs) {
            if (err) {
                reject(err)
            } else {
                docs.forEach((employee) => {
                    //un-assign survey from the employee
                    employee.surveys.map((survey, index) => {
                        // here survey is an object which has two fields one is survey and another is completed
                        let empSurveyId = survey.survey;
                        if (empSurveyId.equals(surveyId)) {
                            employee.surveys.splice(index, 1);
                        }
                    });
                    employee.save();
                });
                resolve(docs)
            }
        });
    });
};
