const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

// define the validation schema
const schema = Joi.object().keys({

    // answer is required
    answer: Joi.string().required(),

    employee: Joi.objectId()

});
module.exports = schema;
