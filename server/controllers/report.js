const Employee = require('../models/employee');
const Client = require('../models/client');
const Survey = require('../models/survey');
const Answer = require('../models/answer');
const Report = require('../models/report');
const path = require('path');
const mongoose = require('mongoose');

const Joi = require('joi');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

exports.ManagerReportDetails = (req, res, next) => {

    let employeeId = req.params.id;
    // here we will get the information
    // how many employees under this employee client
    // how many people completed the survey

    // find the employee from the database

    // get the client employees under the manager organization
    Employee.findById(employeeId)
        .populate([{
            path: 'organization',
            model: 'Organization',
            populate: {
                path: 'divisions',
                model: 'Division',
                populate: {
                    path: 'departments',
                    model: 'Department'
                }
            }
        }])
        .exec(function (err, employee) {
            if (err) return next(err);
            if (!employee) {
                return res.status(404).json({
                    "success": false,
                    "message": "Employee not found"
                })
            }
            // needs to find the client organizations
            // get the client employees under the manager organization
            let message = '';
            let match = {};
            if (employee.is_report === '0') {
                match = {organization: employee.organization};
            }
            Client.findById(employee.client).populate({
                path: 'employees',
                model: 'Employee',
                match: match
            }).populate([{
                path: 'organizations',
                model: 'Organization',
                populate: {
                    path: 'divisions',
                    model: 'Division',
                    populate: {
                        path: 'departments',
                        model: 'Department'
                    }
                }
            }]).exec(function (err, client) {
                // client.employees contains all the employees
                // client.employees.length will be the total length of the
                // now foreach employees check who have completed the survey or not
                // if completed survey then count that employee
                let completedSurveys = 0;
                client.employees.forEach((employee) => {
                    employee.surveys.map((survey) => {
                        if (survey.completed) {
                            completedSurveys++;
                        }
                    });
                });
                if (err) return next(err);
                if (employee.is_report === '0') {
                    message = `${completedSurveys} surveys have been completed by Employees of organization ${employee.organization.name}`;
                } else {
                    message = `${completedSurveys} surveys have been completed by Employees under client ${client.name}`;
                }
                return res.status(200).json({
                    success: true,
                    message: message,
                    name: employee.first_name,
                    organizations: client.organizations,
                    organization: employee.organization,
                    employees: client.employees.length,
                    completedSurveys
                })
            });
        });

};

exports.ManagerReport = (req, res, next) => {

    const {start_date, end_date, level, occupational_group, gender, tenure} = req.body;
    let employeeId = req.params.id;

    let filter_object = {};
    // we need to split level by _. if split levels length is one that means selected organization level
    // if split levels length is two that means selected division level
    // if split levels length is three that means selected department level
    let split_levels = level.split('_');
    if (split_levels.length === 1 && split_levels[0] !== '') {
        filter_object.organization = split_levels[0];
    } else if (split_levels.length === 2) {
        filter_object.division = split_levels[1];
    } else if (split_levels.length === 3) {
        filter_object.department = split_levels[2];
    }

    if (!IsNullOrEmpty(occupational_group) && occupational_group !== '') {
        filter_object.occupational_group = occupational_group;
    }

    if (!IsNullOrEmpty(gender) && gender !== '') {
        filter_object.gender = gender
    }

    // we need to filter employee first by occupational_group, gender, tenure and organization level
    // after getting the employees we will checkout the survey start_date and end_date

    // here in the request body we will get the filterObject
    // filterObject will contain view_level (filter the employee by organization level, division level and department level),
    // start_date, end_date, gender, tenure, occ

    // ********* we need to filter data foreach filterObject *************

    // first we need to find the manager by his/her id
    // then we need to checkout if the manager is set to full report or not
    // if employee is set to full reporting then we need to find all the employees from the organization who have completed this survey
    // if employee is not access to full reporting then we need to find all the employee under the manager organization who have completed this survey

    Employee.findById(employeeId, '-password').populate({
        path: 'organization',
        model: 'Organization'
    }).populate({
        path: 'division',
        model: 'Division'
    }).populate({
        path: 'department',
        model: 'Department'
    }).exec(function (err, employee) {
        if (err) return next(err);
        if (!employee) {
            return res.status(404).json({
                "success": false,
                "message": "Employee not found"
            })
        }

        // get the client employees under the manager organization
        Client.findById(employee.client)
            .populate([{
                path: 'employees',
                model: 'Employee',
                match: filter_object
            }])
            .exec(function (err, client) {
                // client.employees contains all the employees
                // client.employees.length will be the total length of the
                // now foreach employees check who have completed the survey or not
                // if completed survey then count that employee
                if (err) return next(err);
                // first get the survey questions
                const surveyId = employee.surveys[0].survey;
                Survey.findById(surveyId)
                    .populate([{
                        path: 'questions',
                        model: 'Question',
                    }])
                    .exec(function (err, survey) {
                        if (err) return next(err);
                        // filter the employees who have completed the survey first
                        let filtered_employees = client.employees;
                        filtered_employees = filtered_employees.filter(e => e.surveys[0].completed === true); // this will filter all the employees who have completed the survey
                        // also filter the employees by completed survey start_date and end_date
                        if (!IsNullOrEmpty(start_date) && start_date !== '') {
                            filtered_employees = filtered_employees.filter(e => e.surveys[0].start_date >= new Date(start_date));
                        }
                        if (!IsNullOrEmpty(end_date) && end_date !== '') {
                            filtered_employees = filtered_employees.filter(e => e.surveys[0].end_date <= new Date(end_date));
                        }
                        // filter the employees by tenure
                        // tenures = [
                        //     {id: 1, value: "< 1 year"},
                        //     {id: 2, value: "1 - 2 years"},
                        //     {id: 3, value: "3 - 5 years"},
                        //     {id: 4, value: "6 - 10 years"},
                        //     {id: 5, value: "> 10 years"},
                        // ];
                        if (!IsNullOrEmpty(tenure) && tenure !== '') {
                            if (tenure === '1') {
                                // < 1 year
                                filtered_employees = filtered_employees.filter(e => getAge(e.hire_date) <= 1);
                            } else if (tenure === '2') {
                                // 1-2 years
                                filtered_employees = filtered_employees.filter(e => getAge(e.hire_date) > 1 && getAge(e.hire_date) <= 2);
                            } else if (tenure === '3') {
                                // 3-5 years
                                filtered_employees = filtered_employees.filter(e => getAge(e.hire_date) > 2 && getAge(e.hire_date) <= 5);
                            } else if (tenure === '4') {
                                // 6-10 years
                                filtered_employees = filtered_employees.filter(e => getAge(e.hire_date) > 5 && getAge(e.hire_date) <= 10);
                            } else if (tenure === '5') {
                                // greater than 10 > 10 years
                                filtered_employees = filtered_employees.filter(e => getAge(e.hire_date) > 10);
                            }
                        }
                        // filter the employees if employee.is_report is 0. that means full reporting set to no
                        // employee.organization._id.equals(filter_employee.organization)
                        if (employee.is_report === '0') {
                            // filter those employees who are not in the same organization
                            filtered_employees = filtered_employees.filter(fe => employee.organization._id.equals(fe.organization));
                        }
                        // filtered_employees.map((fe) => {
                        //     console.log(employee.organization._id.equals(fe.organization));
                        //     console.log(`manager organization = ${employee.organization._id} filtered employee organization = ${fe.organization}`)
                        // });

                        // from the filtered employees find out the below things
                        // Gender Split that means we need to find how many employee is Male and how Many is Female
                        // Age Split <25, 25-34, 35-50, 50 >
                        // Tenure Split < 1 year, 1-2 years, 3-5 years, 6-10 years, > 10 years
                        let genders = [];
                        let male = 0;
                        let female = 0;
                        filtered_employees.forEach((e) => {
                            if (e.gender === 'Male') {
                                male++
                            } else {
                                female++
                            }
                        });
                        genders.push({name: "Male", value: male});
                        genders.push(({name: 'Female', value: female}));


                        let ages = [];
                        // Calculate Age
                        let less_than_twenty_five = 0;
                        let twenty_five_to_thirty_fourth = 0;
                        let thirty_five_to_fifty = 0;
                        let greater_than_fifty = 0;
                        filtered_employees.forEach((e) => {
                            // calculate age
                            if (!IsNullOrEmpty(e.date_of_birth)) {
                                let age = getAge(e.date_of_birth);
                                if (age <= 25) {
                                    less_than_twenty_five++;
                                } else if (age > 25 && age <= 34) {
                                    twenty_five_to_thirty_fourth++
                                } else if (age > 34 && age <= 50) {
                                    thirty_five_to_fifty++
                                } else if (age > 50) {
                                    greater_than_fifty++
                                }
                            }
                        });

                        ages.push({name: "< 25", value: less_than_twenty_five});
                        ages.push({name: "25 - 34", value: twenty_five_to_thirty_fourth});
                        ages.push({name: "35 - 50", value: thirty_five_to_fifty});
                        ages.push({name: "50 >", value: greater_than_fifty});

                        let tenures = [];
                        // calculate tenures
                        let less_than_one_year = 0;
                        let one_to_two_year = 0;
                        let three_to_five_year = 0;
                        let six_to_ten_year = 0;
                        let greater_than_ten_year = 0;

                        filtered_employees.forEach((e) => {
                            // first check e.hire_date is null or not
                            // if hire_date not null then execute the following code
                            if (!IsNullOrEmpty(e.hire_date)) {
                                let hire_time = getAge(e.hire_date);
                                if (hire_time <= 1) {
                                    less_than_one_year++;
                                } else if (hire_time > 1 && hire_time <= 2) {
                                    one_to_two_year++;
                                } else if (hire_time > 2 && hire_time <= 5) {
                                    three_to_five_year++;
                                } else if (hire_time > 5 && hire_time <= 10) {
                                    six_to_ten_year++;
                                } else if (hire_time > 10) {
                                    greater_than_ten_year++;
                                }
                            }
                        });

                        tenures.push({name: '< 1 year', value: less_than_one_year});
                        tenures.push({name: '1 - 2 years', value: one_to_two_year});
                        tenures.push({name: '3 - 5 years', value: three_to_five_year});
                        tenures.push({name: '6 - 10 years', value: six_to_ten_year});
                        tenures.push({name: '> 10 years', value: greater_than_ten_year});

                        const response_array = [];

                        // here get all the answers
                        employeeQuestionAnswers(filtered_employees).then(
                            (employee_answers) => {
                                survey.questions.forEach((question) => {
                                    // filter the answer by the question
                                    const answers = employee_answers.filter(d => d.question.equals(question._id));
                                    //here check the employees under this organization answered this question
                                    // foreach option check how many employee selected an option
                                    // for example option 1 - Not Like (count how many employees selected this option)
                                    // option 2 - Not Like at All (count how many employees selected this option)

                                    // we need to find the answers for the question category

                                    // {id: 1, value: 'Career Opportunities'},
                                    // {id: 2, value: 'Meaningful Work'},
                                    // {id: 3, value: 'Communication'},
                                    // {id: 4, value: 'Effective Leadership'},
                                    // {id: 5, value: 'Induction'},
                                    // {id: 6, value: 'Learning & Development'},
                                    // {id: 7, value: 'Manager'},
                                    // {id: 8, value: 'Pay & Benefits'},
                                    // {id: 9, value: 'Work Conditions'},
                                    // {id: 10, value: 'Being Valued'},
                                    // {id: 11, value: 'Operational'},
                                    // {id: 12, value: 'Restructure'},
                                    //  exit_reason 13 means this is the final question

                                    // question_types = [
                                    //     {id: 1, value: 'Rating Radio Buttons'},
                                    //     {id: 2, value: 'Free Text'},
                                    //     {id: 3, value: 'Exit Interview - Exit Reasons'},
                                    //     {id: 4, value: 'Yes / No Radio'},
                                    //     {id: 5, value: 'Radio Labels'},
                                    //     {id: 6, value: 'Multiple Choice'},
                                    // ];
                                    let options = [];
                                    if (question.type === '1') {
                                        //here get the ratings from the survey
                                        // survey.rating_labels
                                        survey.rating_labels.forEach((label, label_index) => {
                                            const option_object = {
                                                label,
                                                label_index,
                                                percentage: 0.0,
                                                answered: 0
                                            };// answered is used for how many employee selected
                                            // the option.
                                            options.push(option_object)
                                        })
                                    } else if (question.type === '3' || question.type === '5' || question.type === '6') {
                                        // Exit Interview -  Exit Reasons Question
                                        question.options.forEach((label, label_index) => {
                                            // only we should insert which one is checked
                                            const option_object = {
                                                label,
                                                label_index,
                                                percentage: 0.0,
                                                answered: 0
                                            };// answered is used for how many employee selected
                                            // the option.
                                            options.push(option_object)
                                        })
                                    } else if (question.type === '4') {
                                        // Yes / No Radio Question
                                        // we need to push two thing yes and no
                                        const option_yes_object = {
                                            label: 'Yes',
                                            label_index: 1,
                                            percentage: 0.0,
                                            answered: 0
                                        };// answered is used for how many employee selected
                                        const option_no_object = {
                                            label: 'No',
                                            label_index: 0,
                                            percentage: 0.0,
                                            answered: 0
                                        };
                                        options.push(option_yes_object, option_no_object);
                                    }
                                    const question_object = {
                                        id: question._id,
                                        options: options,
                                        question_type: question.type,
                                        exit_reason: question.exit_reason,
                                        exit_reporting_label: question.exit_reporting_label
                                    };
                                    // now here we are getting answers for the question
                                    // here we need to check if the question is the final question
                                    // foreach question options we need to do two things how many employees selected an option
                                    // 2nd thing calculate the percentage
                                    // check the question type as well

                                    // here check answer for multiple choice and also check answer for radio buttons
                                    // for multiple choice answer user can select multiple answer
                                    answers.forEach((answer) => {
                                        // check which option is selected.
                                        // get the question options by label_index and increase the answered
                                        if (answer.question_type === '1' || answer.question_type === '4' || answer.question_type === '5') {
                                            // this means question is radio type. so there will be only one answer
                                            // this means answer.options array has only one element
                                            question_object.options.forEach((option) => {
                                                if (JSON.parse(answer.options[0]) === JSON.parse(option.label_index)) {
                                                    // this means selected the option. so we need to increase the answered by one
                                                    option.answered = option.answered + 1;
                                                }
                                            })

                                        } else if (answer.question_type === '3' || answer.question_type === '6') {
                                            // this is the multiple choice question
                                            question_object.options.forEach((option) => {
                                                let question_index = '' + option.label_index;
                                                // check the answer array contains the label_index or not
                                                if (answer.options.includes(question_index)) {
                                                    option.answered = option.answered + 1;
                                                }
                                            })
                                        } else if (answer.question_type === '7') {
                                            // This is the final and special question
                                            question_object.options.forEach((option) => {
                                                // we have to increase label_index by 1 because when question is answered
                                                // it inputs the exit_reason id which is 1 increased than it's index
                                                let first_choice_index = '1st-choice-' + (option.label_index + 1);
                                                let second_choice_index = '2nd-choice-' + (option.label_index + 1);

                                                if (answer.options.includes(first_choice_index) || answer.options.includes(second_choice_index)) {
                                                    option.answered = option.answered + 1;
                                                }
                                            });
                                            // for final question we need both first choice ans also second choice
                                            // how many employee selected first choice and how many employee selected 2nd choice
                                        }
                                    });

                                    response_array.push(question_object);
                                });
                                return res.status(200).json({
                                    success: true,
                                    survey,
                                    client,
                                    response_array,
                                    manager: employee,
                                    genders,
                                    ages,
                                    tenures,
                                    completed: filtered_employees.length
                                })
                            });

                    });
            });
    });

    // ************** After Filtering Data **************
    // for final question check which employee select which option
    // for example Career Opportunities 1st choice(10 Employee) and 2nd choice (2 employee)
    // Pay & Benefits 1st choice (8 Employee) and 2nd choice (2 employee)

    // we can do this way foreach question we should find out how many employee selected which option
    // so our data will be look something like this
    // {question_id: 1, which category this question is for example being valued category, options:[{id:1, how many employees selected this option}],
    // charting_label (exit_reporting_label)}


    // *************** RULES ***************
    // first find the top 3 reasons for leaving the exit interview
    // calculation
    // Reason                1st choice     2nd choice   total points     percentage
    // Career Opportunities    10               2            12
    // Pay & Benefits          8                2            10
    // Work Conditions         4                5            9
    // Operational             2                2            4
    // Learning & Development  2                2            4
    // Manager                 2                1            3
    // Meaningful Work         2                0            2
    // Effective Leadership    0                1            1

    // Percentage Calculation
    // total points = 45
    // Career Opportunities Percentage = (12 /45) * 100 = 26.66 %

    // for all Question under Career Opportunities for each question there will be a bar in the chart
    // For example there are 4 questions in the Career Opportunities Category So there will be 4 bar in the chart
    // Now calculate how many people Agree, Neutral and Disagree (Need to calculate percentage as well)
    // Agree and Strongly Agree --------------------- 11
    // Disagree and Strongly Disagree --------------- 4
    // Neutral -------------------------------------- 0

    // Percentage of Agree and Strongly Agree ------ (11 / 15) * 100 = 73.33 %
    // Percentage of Disagree and Strongly Disagree -(4/15) * 100 = 26.66 %
    // Percentage of Neutral ------------------------(0/15) * 100 = 0 %


    // response will be something like this
    // top_reasons (Array of objects) {label: Career Opportunities, percentage: 26.66 }
    // answers (Array of objects) {question_id : 1, category_label: Career Opportunities, answers : [{label:Agree and Strongly Agree, percentage: 73.33}]}

    // re-arrange the answers by the category label (highest leaving reason)
};

const employeeQuestionAnswers = (employees) => {
    // since An employee will have only one survey
    // so we can find the employee answer directly by employee id
    return new Promise((resolve, reject) => {
        let employee_ids = [];
        employees.forEach((employee) => {
            employee_ids.push(employee._id);
        });
        Answer.find({employee: {$in: employee_ids}}, function (err, docs) {
            if (err) {
                reject(err);
            } else {
                resolve(docs);
            }
        });
    })

};

exports.Create = function (req, res, next) {
    const data = req.body;
    if (typeof req.file !== 'undefined') {
        data.filename = req.file.filename;
    }
    const report = new Report(data);
    report.save(function (err) {
        if (err) return next(err);
        return res.status(200).send({
            "success": true,
            "message": "Report successfully created",
            report
        })
    })
};

exports.Find = (req, res, next) => {
    const currentReport = Number(req.query.page || 1); //staticReport number
    const perPage = Number(req.query.perPage || 10); //total items display per staticReport
    let totalItems; //how many items in the database

    Report.find()
        .countDocuments()
        .then(count => {
            totalItems = count;
            //This will return a new promise with the posts.
            return Report.find().populate({
                path: 'client',
                model: 'Client',
            }).skip((currentReport) * perPage)
                .limit(perPage);
        }).then(reports => {
        return res.status(200).json({success: true, reports, totalItems})
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    });
};

exports.FindById = (req, res, next) => {
    let id = req.params.id;

    Report.findById(id, (err, report) => {
        if (err) return next(err);
        if (!report) {
            return res.status(404).json({
                "success": false,
                "message": "Report not found"
            })
        }
        return res.status(200).send({
            "success": true,
            "message": "Data successfully retrieve",
            report
        })
    });
};

exports.Update = (req, res, next) => {
    // fetch the request data
    const data = req.body;
    let id = req.params.id;

    //Update the report
    if (typeof req.file !== 'undefined') {
        data.filename = req.file.filename;
    }

    // This would likely be inside of a PUT request, since we're updating an existing document, hence the req.params.todoId.
    // Find the existing resource by ID
    Report.findByIdAndUpdate(
        // the id of the item to find
        id,
        // the change to be made. Mongoose will smartly combine your existing
        // document with this change, which allows for partial updates too
        data,
        // an option that asks mongoose to return the updated version
        // of the document instead of the pre-updated one.
        {new: true},

        // the callback function
        (err, report) => {
            // Handle any possible database errors
            if (err) return next(err);
            if (!report) return res.status(404).json({success: false, message: "Report not found."});
            return res.send({
                "success": true,
                "message": "Record updated successfully",
                report
            });
        }
    );
};

exports.Delete = (req, res, next) => {
    let id = req.params.id;

    const schema = Joi.object({
        id: Joi.objectId()
    });

    Joi.validate({id}, schema, (err, value) => {
        if (err) {
            // send a 422 error response if validation fails
            return res.status(422).json({
                success: false,
                message: 'Invalid request data',
                err
            });
        }
        // It allows you to pass a reference back to the staticReport in case they need a reference for some reason.
        Report.findByIdAndRemove(id, (err, report) => {
            // As always, handle any potential errors:
            if (err) return next(err);
            if (!report) return res.status(404).json({success: false, message: "Report not found."});
            // We'll create a simple object to send back with a message and the id of the document that was removed
            // You can really do this however you want, though.
            return res.send({
                "success": true,
                "message": "Record deleted successfully",
                report
            });
        });
    });
};

exports.DataOutput = (req, res, next) => {
    const filter_data = req.body;
    const filename = Date.now() + '__exit_interview_data.csv';
    const data_path = path.join(__dirname, '../uploads/' + filename);
    // header will create dynamically header will have option below
    // survey_title, client_id, client_name,employee_id, employee_number,employee_FirstName
    // employee_LastName, employee_title,employee_type, employee_org, employee_div
    // employee_dept,employee_HireDate,employee_ResignDate, Employee_ExitDate, Employee_Gender,Employee DOB,
    // survey_id, survey_StartTime, survey_EndTime,
    // all the survey questions

    const headers = [];
    // first get the selected survey also populate the survey questions as well
    Survey.findById(filter_data.survey)
        .populate([{
            path: 'questions',
            model: 'Question',
            populate: {
                path: 'answers'
            }
        }])
        .exec(function (err, survey) {
            if (err) return next(err);
            // here find the clients
            // foreach client
            // get all the client employees who have completed the selected survey as well as employee survey answers

            // here survey has questions
            // foreach survey questions it has answers

            // build the survey headers
            headers.push({id: 'survey_title', title: 'Survey Title'});
            headers.push({id: 'client_id', title: '`client ID`'});
            headers.push({id: 'client_name', title: 'Client Name'});
            headers.push({id: 'employee_id', title: 'Employee ID'});
            headers.push({id: 'employee_firstname', title: 'Employee FirstName'});
            headers.push({id: 'employee_lastname', title: 'Employee LastName'});
            headers.push({id: 'employee_position', title: 'Employee Title'});
            headers.push({id: 'employee_type', title: 'Employee Type'});
            headers.push({id: 'employee_org', title: 'Employee Org'});
            headers.push({id: 'employee_div', title: 'Employee Div'});
            headers.push({id: 'employee_dept', title: 'Employee Dept'});
            headers.push({id: 'employee_hiredate', title: 'Employee HireDate'});
            headers.push({id: 'employee_resigndate', title: 'Employee ResignDate'});
            headers.push({id: 'employee_exitdate', title: 'Employee ExitDate'});
            headers.push({id: 'employee_gender', title: 'Employee Gender'});
            headers.push({id: 'employee_dob', title: 'Employee DOB'});
            headers.push({id: 'survey_id', title: 'Survey ID'});
            headers.push({id: 'survey_starttime', title: 'Survey StartTime'});
            headers.push({id: 'survey_endtime', title: 'Survey EndTime'});
            headers.push({id: 'completed_online', title: 'Completed Online'});
            headers.push({id: 'completed_admin', title: 'Completed Admin'});

            let question_no = 0;
            survey.questions.forEach((question) => {
                question_no++;
                headers.push({id: question._id, title: `Question ${question_no} - ` + question.title});
            });

            const csvWriter = createCsvWriter({
                path: data_path,
                header: headers
            });

            //re-arrange data
            // foreach employee populate the client as well
            Employee.find({'client': {$in: filter_data.clients}}).populate({
                path: 'client',
                model: 'Client'
            }).populate({
                path: 'organization',
                model: 'Organization'
            }).populate({
                path: 'division',
                model: 'Division'
            }).populate({
                path: 'department',
                model: 'Department'
            }).exec(function (err, employees) {
                let output_data = [];
                let filtered_employees = [];
                // foreach employee there will be a row in the table
                employees.forEach((employee) => {
                    // check if the employee has an available survey or not
                    // check if the employee survey is same as the survey._id
                    // check if the survey has completed or not
                    if (filter_data.start_date !== null && filter_data.end_date !== null) {
                        let start_date = new Date(filter_data.start_date);
                        let end_date = new Date(filter_data.end_date);
                        if (employee.surveys[0].start_date >= start_date && employee.surveys[0].end_date <= end_date) {
                            filtered_employees.push(employee);
                        }
                    }
                    if (filter_data.start_date === null) {
                        if (filter_data.end_date !== null) {
                            // convert the date string to date
                            let end_date = new Date(filter_data.end_date);
                            if (employee.surveys[0].end_date <= end_date) {
                                filtered_employees.push(employee);
                            }
                        }
                    }
                    if (filter_data.end_date === null) {
                        if (filter_data.start_date !== null) {
                            // convert the date string to date
                            let start_date = new Date(filter_data.start_date);
                            // then check if the date is inside the range
                            if (employee.surveys[0].start_date >= start_date) {
                                filtered_employees.push(employee);
                            }
                        }
                    }
                    if (filter_data.start_date == null && filter_data.end_date == null) {
                        filtered_employees.push(employee)
                    }

                    // first check if the filterData.start_date is null or not. if null don't do anything. if not null check if the survey start_date is inside date range
                    // then check if the filterData.end_date is null or not. if null don't do anything
                });
                filtered_employees.forEach((employee) => {
                    if (employee.surveys.length > 0) {
                        // now check if the filterData.start_date and filterData.end_date is null or not
                        let surveyId = mongoose.Types.ObjectId(filter_data.survey);
                        if (survey._id.equals(surveyId) && employee.surveys[0].completed) {
                            let data_object = {
                                survey_title: survey.title,
                                client_id: employee.client._id,
                                client_name: employee.client.name,
                                employee_id: employee._id,
                                employee_firstname: employee.first_name,
                                employee_lastname: employee.last_name,
                                employee_position: employee.position,
                                employee_type: employee.is_manager === '0' ? 'Employee' : 'Manager',
                                employee_org: employee.organization === null || typeof employee.organization == 'undefined' ? '' : employee.organization.name,
                                employee_div: employee.division === null || typeof employee.division == 'undefined' ? '' : employee.division.name,
                                employee_dept: employee.department === null || typeof employee.department == 'undefined' ? '' : employee.department.name,
                                employee_hiredate: employee.hire_date == null ? '' : format_date(employee.hire_date),
                                employee_resigndate: employee.resign_date == null ? '' : format_date(employee.resign_date),
                                employee_exitdate: employee.exit_date == null ? '' : format_date(employee.exit_date),
                                employee_gender: employee.gender,
                                employee_dob: employee.date_of_birth == null ? '' : format_date(employee.date_of_birth),
                                survey_id: survey._id,
                                survey_starttime: employee.surveys[0].start_date == null ? '' : format_date(employee.surveys[0].start_date),
                                survey_endtime: employee.surveys[0].end_date == null ? '' : format_date(employee.surveys[0].end_date),
                                completed_online: employee.surveys[0].completed_online,
                                completed_admin: employee.surveys[0].completed_admin
                            };
                            let answers = [];
                            // first push all the question answers in the answers array
                            survey.questions.forEach((question) => {
                                question.answers.forEach((answer) => {
                                    answers.push(answer);
                                })
                            });
                            survey.questions.forEach((question) => {
                                let answer = answers.find(a => a.employee.equals(employee._id) && a.question.equals(question._id));
                                let question_id = question._id;
                                // this means the question has first choice and second choice
                                let exit_reason_checkbox = [
                                    {id: 1, value: 'Career Opportunities'},
                                    {id: 2, value: 'Meaningful Work'},
                                    {id: 3, value: 'Communication'},
                                    {id: 4, value: 'Effective Leadership'},
                                    {id: 5, value: 'Induction'},
                                    {id: 6, value: 'Learning & Development'},
                                    {id: 7, value: 'Manager'},
                                    {id: 8, value: 'Pay & Benefits'},
                                    {id: 9, value: 'Work Conditions'},
                                    {id: 10, value: 'Being Valued'},
                                    {id: 11, value: 'Operational'},
                                    {id: 12, value: 'Restructure'},
                                ];
                                if (answer) {
                                    // we need to do answer processing here.
                                    // question_types = [
                                    //     {id: 1, value: 'Rating Radio Buttons'},
                                    //     {id: 2, value: 'Free Text'},
                                    //     {id: 3, value: 'Exit Interview - Exit Reasons'},
                                    //     {id: 4, value: 'Yes / No Radio'},
                                    //     {id: 5, value: 'Radio Labels'},
                                    //     {id: 6, value: 'Multiple Choice'},
                                    // ];
                                    // console.log(question.type);
                                    if (question.type === '1' && question.exit_reason !== '13') {
                                        data_object[question_id] = survey.rating_labels[answer.options[0]];
                                    } else if (question.type === '2' && question.exit_reason !== '13') {
                                        data_object[question_id] = answer.options[0];
                                    } else if (question.type === '3' && question.exit_reason !== '13') {
                                        let final_answer = '';
                                        let i = 0;
                                        question.options.forEach((option, question_index) => {
                                            if (option === 'true') {
                                                answer.options.forEach((answer_option) => {
                                                    if (`${question_index}` === answer_option) {
                                                        i++;
                                                        final_answer += i + '. ' + exit_reason_checkbox[question_index].value + '\n'
                                                    }
                                                })
                                            }
                                        });
                                        data_object[question_id] = final_answer;
                                    } else if (question.type === '4' && question.exit_reason !== '13') {
                                        data_object[question_id] = answer.options[0] === '1' ? 'Yes' : 'No';
                                    } else if (question.type === '5' && question.exit_reason !== '13') {
                                        data_object[question_id] = question.options[answer.options[0]];
                                    } else if (question.type === '6' && question.exit_reason !== '13') {
                                        let i = 0;
                                        let final_answer = '';
                                        answer.options.map((option) => {
                                            i++;
                                            final_answer += i + '. ' + question.options[option] + '\n';
                                        });
                                        data_object[question_id] = final_answer;
                                    } else if (question.exit_reason === '13') {

                                        let answer_one = answer.options[0].split('-');
                                        let answer_two = answer.options[1].split('-');
                                        let final_answer = '';
                                        // ********* First Answer ************
                                        if (answer_one[0] === '1st') {
                                            final_answer += '1st choice ' + exit_reason_checkbox.find(ex => ex.id == answer_one[2]).value + '\n';
                                        } else {
                                            final_answer += '2nd choice ' + exit_reason_checkbox.find(ex => ex.id == answer_one[2]).value + '\n';
                                        }
                                        // ********** Second Answer ********
                                        if (answer_two[0] === '1st') {
                                            final_answer += '1st choice ' + exit_reason_checkbox.find(ex => ex.id == answer_two[2]).value + '\n';
                                        } else {
                                            final_answer += '2nd choice ' + exit_reason_checkbox.find(ex => ex.id == answer_two[2]).value + '\n';
                                        }
                                        data_object[question_id] = final_answer;
                                    }
                                }
                            });
                            output_data.push(data_object);
                        }
                    }
                });
                if (output_data.length > 0) {
                    csvWriter
                        .writeRecords(output_data)
                        .then(() => {
                            console.log('The CSV file was written successfully');
                            return res.status(200).json({
                                success: true,
                                message: `Total ${output_data.length} records written successfully`,
                                length: output_data.length,
                                filename
                            })
                        });
                } else {
                    return res.status(200).json({
                        success: true,
                        message: 'No records available to write',
                        length: output_data.length,
                    })
                }
            });
        });

};
const format_date = (date) => {
    let dd = date.getDate();
    let mm = date.getMonth() + 1; //January is 0!

    let yyyy = date.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return dd + '/' + mm + '/' + yyyy;
};
const IsNullOrEmpty = (obj) => {
    return typeof obj === 'undefined' || obj == null;
};
const getAge = birthDate => Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10);

