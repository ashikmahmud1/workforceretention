const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pageSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    menu_title: {
        type: String,
        required: true
    },
    menu_order: {
      type:Number,
      required: true
    },
    home_text: {
        type: String,
        required: true
    },
    page_text: {
        type: String
    },
    is_home: {
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
    },
    box_3: {
        type: Schema.Types.ObjectId,
        ref: 'Box'
    }
}, {timestamps: true});

module.exports = mongoose.model('Page', pageSchema);