const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

// define the validation schema
const schema = Joi.object().keys({

    // name is required
    name: Joi.string().required(),

    permissions: Joi.any()

});
module.exports = schema;
