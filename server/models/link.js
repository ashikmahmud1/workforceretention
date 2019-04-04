const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const linkSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link_url: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }
}, {timestamps: true});

// surveySchema.pre('remove', function (next) {
//     // 'this' is the staticPage being removed. Provide callbacks here if you want
//     // to be notified of the calls' result.
//     //update the employee table links accordingly
//     User.remove({role: this._id}).exec();
//     next();
// });

module.exports = mongoose.model('Link', linkSchema);