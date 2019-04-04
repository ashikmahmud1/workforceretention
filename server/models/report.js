// report fields title, description, original_filename, filename, client, is_organization, is_division, is_department, updated_at
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    title: {
        type: String,
        required: 'First name is required'
    },
    description: {
        type: String
    },
    filename: {
        type: String
    },
    is_organization: {
        type: Boolean
    },
    is_division: {
        type: Boolean
    },
    is_department: {
        type: Boolean
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client'
    }

}, {timestamps: true});

module.exports = mongoose.model('Report', reportSchema);
