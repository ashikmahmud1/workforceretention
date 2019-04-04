const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: {
        type: String,
        required: 'First name is required'
    },
    last_name: {
        type: String
    },
    username: {
        type: String,
        required: 'Username is required',
        min: [4, 'Too short, min is 4 characters'],
        max: [32, 'Too long, max is 32 characters']
    },
    email: {
        type: String,
        min: [4, 'Too short, min is 4 characters'],
        max: [32, 'Too long, max is 32 characters'],
        unique: true,
        lowercase: true,
        required: 'Email is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password: {
        type: String,
        min: [4, 'Too short, min is 4 characters'],
        max: [32, 'Too long, max is 32 characters'],
        required: 'Password is required'
    },

    surveys: [{type: Schema.Types.ObjectId, ref: 'Survey'}],

    clients: [{type: Schema.Types.ObjectId, ref: 'Client'}],

    links: [{type: Schema.Types.ObjectId, ref: 'Link'}],

    articles: [{type: Schema.Types.ObjectId, ref: 'Article'}],
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role'
    }

});

module.exports = mongoose.model('User', userSchema);
