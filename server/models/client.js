const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const emailSchema = require('../schema/email');

const clientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    state: {
        type: String,
    },
    country: {
        type: Number
    },
    workforce: {
        type: Number
    },
    //Aggregate data only, Individual + Aggregate Data
    org_mgt: {
        type: Number,
    },
    // There are two email template. template-1 and template-2
    // Depending on selected template email will be sent to employee
    // when creating employee client will be set to default email template-one
    email_template: {
        type: String,
        default: 'template-one'
    },
    div_mgt: {
        type: Number
    },
    dept_mgt: {
        type: Number
    },
    product: {
        type: Number
    },
    send_reminder_email: {
        type: Boolean,
        default: true
    },
    turnover: {
        type: Number,
        required: true
    },
    aggregate_reports: {
        type: Number,
    },
    image: {
        type: String
    },
    surveys: [{type: Schema.Types.ObjectId, ref: 'Survey'}],

    industry: {type: Schema.Types.ObjectId, ref: 'Industry'},

    employees: [{type: Schema.Types.ObjectId, ref: 'Employee'}],

    organizations: [{type: Schema.Types.ObjectId, ref: 'Organization'}],

    emails: [emailSchema]

}, {timestamps: true});

module.exports = mongoose.model('Client', clientSchema);
