const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boxSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    large_image: {
        type: String
    },
    thumb_image: {
        type: String
    }
}, {timestamps: true});

module.exports = mongoose.model('Box', boxSchema);