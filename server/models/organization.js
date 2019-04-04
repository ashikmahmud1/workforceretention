const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const organizationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    divisions: [{
        type: Schema.Types.ObjectId,
        ref: 'Divisions'
    }]
}, {timestamps: true});

// surveySchema.pre('remove', function (next) {
//     // 'this' is the staticPage being removed. Provide callbacks here if you want
//     // to be notified of the calls' result.
//     //update the employee table organization accordingly
//     Employee.remove({role: this._id}).exec();
//     next();
// });

module.exports = mongoose.model('Organization', organizationSchema);