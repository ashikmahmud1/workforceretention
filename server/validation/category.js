const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

// define the validation schema
const schema = Joi.object().keys({

    //Category is related with link table
    // name is required
    title: Joi.string().required()

});
module.exports = schema;
