const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema({

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    // answer will look something like this
    // if question type is Free Text then in option it will save only that text-box value
    // if question type is Rating Radio Buttons then it will save the selected radio button value
    // if question type is Checkbox then answer will have multiple
    options: [{
        type: String,
        required: true
    }],
    question_type: {
        type: String
    },

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    },
    question: {
        type: Schema.Types.ObjectId,
        ref: 'Question'
    },
    survey: {
        type: Schema.Types.ObjectId,
        ref: 'Survey'
    }

});

// surveySchema.pre('remove', function (next) {
//     // 'this' is the staticPage being removed. Provide callbacks here if you want
//     // to be notified of the calls' result.
//     //update the question table answer accordingly
//     Question.remove({questions: this._id}).exec();
//     next();
// });

module.exports = mongoose.model('Answer', answerSchema);
