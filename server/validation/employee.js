const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

// define the validation schema
const schema = Joi.object().keys({


    first_name: Joi.string().required(),

    last_name: Joi.string().required(),
    // email is required
    // email must be a valid email string
    email: Joi.string().email().min(4).max(32).required(),

    // name is required
    username: Joi.string().min(4).max(32).required(),

    // accepts alphanumeric strings at least 7 characters long
    // password is required
    password: Joi.string().min(6).alphanum().required(),

    phone: Joi.string().allow(''),

    mobile: Joi.string().allow(''),

    organization: Joi.objectId(),

    division: Joi.objectId(),

    department: Joi.objectId(),

    occupational_group: Joi.string().allow(''),

    is_report: Joi.bool(),

    is_online: Joi.bool(),

    is_survey: Joi.bool(),

    is_active: Joi.bool(),

    gender: Joi.any().allow(['Male', 'Female']),

    date_of_birth: Joi.string().required(),

    position: Joi.string().required()


});
module.exports = schema;
