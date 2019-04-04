const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const staticPageSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    box_1: {
        type: Schema.Types.ObjectId,
        ref: 'Box'
    },
    box_2: {
        type: Schema.Types.ObjectId,
        ref: 'Box'
    }
}, {timestamps: true});

module.exports = mongoose.model('StaticPage', staticPageSchema);