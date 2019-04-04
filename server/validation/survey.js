const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

// define the validation schema
const schema = Joi.object().keys({

    // name is required
    title: Joi.string().min(4).required(),

    description: Joi.string().required(),

    instruction: Joi.string().required(),

    rating_scale: Joi.string().required(),

    survey_type: Joi.string().required(),

    no_of_questions: Joi.number().integer().min(0),

    user: Joi.objectId()

});
module.exports = schema;
