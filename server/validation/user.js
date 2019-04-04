const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

// define the validation schema
const schema = Joi.object().keys({

    // email is required
    // email must be a valid email string
    email: Joi.string().email().min(4).max(32).required(),

    // name is required
    username: Joi.string().min(4).max(32).required(),

    // accepts alphanumeric strings at least 7 characters long
    // password is required
    password: Joi.string().min(6).alphanum().required(),

    role: Joi.objectId().required()

});
module.exports = schema;
