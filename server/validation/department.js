const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

// define the validation schema
const schema = Joi.object().keys({

    // name is required
    name: Joi.string().min(4).required(),

    organization: Joi.objectId(),

    division: Joi.objectId()

});
module.exports = schema;
