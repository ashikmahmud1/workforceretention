const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const divisionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    departments:[{
        type: Schema.Types.ObjectId,
        ref: 'Department'
    }]
}, {timestamps: true});

// surveySchema.pre('remove', function (next) {
//     // 'this' is the staticPage being removed. Provide callbacks here if you want
//     // to be notified of the calls' result.
//     //update the organization table divisions accordingly
//     User.remove({role: this._id}).exec();
//     next();
// });

module.exports = mongoose.model('Division', divisionSchema);