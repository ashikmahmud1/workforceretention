const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const any = Joi.any();

// define the validation schema
const schema = Joi.object().keys({

    // name is required
    name: Joi.string().required(),

    state: Joi.string().required(),

    country: Joi.string().required(),

    org_mgt : Joi.string().required(),

    div_mgt : Joi.string().required(),

    dept_mgt : Joi.string().required(),

    product : Joi.string().required(),

    workforce : Joi.string().required(),

    turnover: Joi.number().integer(),

    image: any,

    email_template: Joi.any(),

    industry: Joi.objectId(),

    aggregate_reports: Joi.string().required()


});
module.exports = schema;
