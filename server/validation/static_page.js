const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

// define the validation schema
const schema = Joi.object().keys({

    // name is required
    title: Joi.string().min(4).required(),
    box_1: Joi.objectId(),
    box_2: Joi.objectId(),

});
module.exports = schema;
