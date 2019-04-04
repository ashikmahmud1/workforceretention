const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    keywords:{
      type:String
    },
    description: {
        type: String,
        required: true
    },
    order:{
      type: Number,
      default: 0
    },
    box_1: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    box_2: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    box_3: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

module.exports = mongoose.model('Article', articleSchema);