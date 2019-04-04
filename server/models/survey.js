const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Question = require('./question');

const surveySchema = new Schema({

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    instruction: {
        type: String,
        required: true
    },
    survey_type: {
      type: String,
      required: true
    },
    no_of_questions: {
        type: Number,
        required: true
    },
    rating_scale: {
        type: Number
    },
    // if rating_scale is 5. then the rating labels possibility is
    // 1. Not at all like me 2. Unlike me 3. Neutral 4. Like me 5. Very much like me
    rating_labels:[{
        type: String
    }],
    survey_schedule: {
        type: String
    },
    schedule_period: {
        type: String
    },
    schedule_months: {
        type: String
    },
    schedule_days: {
        type: String
    },
    answer_rating: [{
       type: String
    }],

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    questions: [{
        type: Schema.Types.ObjectId,
        ref: 'Question'
    }],
    ratings: [{
        type: Schema.Types.ObjectId,
        ref: 'Rating'
    }]
}, {timestamps: true});

// surveySchema.pre('remove', function (next) {
//     // 'this' is the staticPage being removed. Provide callbacks here if you want
//     // to be notified of the calls' result.
//     //delete all the related questions
//     Question.remove({questions: this._id}).exec();
//     next();
// });
module.exports = mongoose.model('Survey', surveySchema);