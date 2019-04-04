const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

// define the validation schema
const schema = Joi.object().keys({

    // from address field is required
    // from address email must be a valid email string
    from_address: Joi.string().email().min(4).required(),

    // name is required
    subject: Joi.string().min(4).required(),

    // accepts alphanumeric strings at least 7 characters long
    // password is required
    body: Joi.string().min(50).required(),

    editable: Joi.boolean(),

    assign_to_client: Joi.boolean(),

    description: Joi.string(),

    email_type: Joi.string(),

    title: Joi.string()



});
module.exports = schema;
