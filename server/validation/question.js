const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

// define the validation schema
const schema = Joi.object().keys({

    // name is required
    title: Joi.string().min(4).required(),

    number_of_options: Joi.number().min(0).max(4).required(),

    answer: Joi.string().required(),

    type: Joi.string().required(),

    options: Joi.any()

});
module.exports = schema;
