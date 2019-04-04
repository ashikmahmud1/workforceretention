const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const surveyEmailSchema = new Schema({

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    survey_type: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    from_address: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('SurveyEmail', surveyEmailSchema);