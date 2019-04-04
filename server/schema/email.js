const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailSchema = new Schema({
    from_address: {
        type: String
    },
    //Initial Exit Email - Non-Confidential
    email_type: {
        type: String
    },
    title: {
        type: String
    },
    assign_to_client: {
        type: Boolean
    },
    editable: {
        type: Boolean
    },
    //This is the initial email that is sent to the employee inviting them to complete an on-line exit interview. For Self-Administered systems.
    description: {
      type: String
    },
    subject: {
        type: String
    },
    body: {
        type: String
    }
});


module.exports =  emailSchema;
