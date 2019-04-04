const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

// define the validation schema
const schema = Joi.object().keys({

    // name is required
    title: Joi.string().min(4).required(),

    menu_title: Joi.string().required(),

    home_text: Joi.string().required(),

    page_text: Joi.string().required(),
    box_1: Joi.objectId(),
    box_2: Joi.objectId(),
    box_3: Joi.objectId(),
    is_home: Joi.boolean(),
    menu_order: Joi.number()

});
module.exports = schema;
