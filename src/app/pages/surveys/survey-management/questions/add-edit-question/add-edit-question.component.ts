import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {SurveyService} from "../../../../../@core/data/survey.service";
import {QuestionService} from "../../../../../@core/data/question.service";

@Component({
    selector: 'ngx-add-edit-question',
    templateUrl: './add-edit-question.component.html',
    styleUrls: ['./add-edit-question.component.scss']
})
export class AddEditQuestionComponent implements OnInit, AfterViewInit {
    myForm: FormGroup;
    surveyId;
    survey;
    questions = [];
    no_of_labels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    survey_types = [
        {id: 1, value: 'Exit Interview'}
    ];
    exit_interview_exit_reason_ids = [
        {id: "career-opportunities-"},
        {id: "meaningful-work-"},
        {id: "communication-"},
        {id: "effective-leadership-"},
        {id: "induction-"},
        {id: "learning-development-"},
        {id: "manager-"},
        {id: "pay-benefits-"},
        {id: "work-conditions-"},
        {id: "being-valued-"},
        {id: "operational-"},
        {id: "restructure-"},
    ];
    question_types = [
        {id: 1, value: 'Rating Radio Buttons'},
        {id: 2, value: 'Free Text'},
        {id: 3, value: 'Exit Interview - Exit Reasons'},
        {id: 4, value: 'Yes / No Radio'},
        {id: 5, value: 'Radio Labels'},
        {id: 6, value: 'Multiple Choice'},
    ];
    ratings = [
        {id: 2, value: '1-2'},
        {id: 3, value: '1-3'},
        {id: 4, value: '1-4'},
        {id: 5, value: '1-5'},
        {id: 6, value: '1-6'},
        {id: 7, value: '1-7'},
        {id: 8, value: '1-8'},
        {id: 9, value: '1-9'},
        {id: 10, value: '1-10'}
    ];
    exit_reason = [
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
        {id: 11, value: 'Initial Question'},
        {id: 12, value: 'Custom Questions'},
        {id: 13, value: 'Final Question'},
        {id: 14, value: 'Operational'},
        {id: 15, value: 'Restructure'},
    ];

    constructor(private fb: FormBuilder,
                private route: ActivatedRoute,
                private surveyService: SurveyService,
                private questionService: QuestionService,
                private router: Router) {
        this.survey = {};
    }

    ngOnInit() {
        //  here get the id of the survey
        this.surveyId = this.route.snapshot.paramMap.get('id');
        this.myForm = this.fb.group({
            email: '',
            phones: this.fb.array([])
        });
    }

    getSurvey() {
        this.surveyService.getSurveyQuestions(this.surveyId).subscribe(
            data => {
                this.setPage(data);
            },
            err => {
                console.log(err);
            }
        );
    }

    onChangeQuestionType(index, selectedId) {
        // {id: 1, value: 'Rating Radio Buttons'},
        // {id: 2, value: 'Free Text'},
        // {id: 3, value: 'Exit Interview - Exit Reasons'},
        // {id: 4, value: 'Yes / No Radio'},
        // {id: 5, value: 'Radio Labels'},
        // {id: 6, value: 'Multiple Choice'},

        const exitReasonDiv = <HTMLInputElement>document.getElementById('exit-reason-' + index);
        const radioLabelDiv = <HTMLInputElement>document.getElementById('radio-label-' + index);
        const multipleChoiceDiv = <HTMLInputElement>document.getElementById('multiple-choice-' + index);
        // if selectedId=3 then show the exit-reason div
        // if selectedId=5 then show the radio-label div
        // if selectedId=6 then show the multiple-choice div
        if (selectedId == 3) {
            this.checkClassAndRemove(exitReasonDiv, 'hide-div');
            this.checkClassAndAdd(radioLabelDiv, 'hide-div');
            this.checkClassAndAdd(multipleChoiceDiv, 'hide-div');
        } else if (selectedId == 5) {
            this.checkClassAndAdd(exitReasonDiv, 'hide-div');
            this.checkClassAndRemove(radioLabelDiv, 'hide-div');
            this.checkClassAndAdd(multipleChoiceDiv, 'hide-div');
        } else if (selectedId == 6) {
            this.checkClassAndAdd(exitReasonDiv, 'hide-div');
            this.checkClassAndAdd(radioLabelDiv, 'hide-div');
            this.checkClassAndRemove(multipleChoiceDiv, 'hide-div');
        } else {
            this.checkClassAndAdd(exitReasonDiv, 'hide-div');
            this.checkClassAndAdd(radioLabelDiv, 'hide-div');
            this.checkClassAndAdd(multipleChoiceDiv, 'hide-div');
        }
    }

    onChangeRadioLabel(index, labels) {
        const generateRadioLabelDiv = <HTMLInputElement>document.getElementById('generate-radio-label-' + index);
        generateRadioLabelDiv.innerHTML = "";
        for (let i = 1; i <= labels; i++) {
            generateRadioLabelDiv.innerHTML += `<div class='row'><div class='col-lg-2'>Label ${i} *</div> <div class="col-lg-10">
                                                    <div class="form-group"> <input type="text" class="form-control radio-label"></div></div></div>`;
        }
    }

    onChangeMultipleChoice(index, labels) {
        const generateMultipleChoiceDiv = <HTMLInputElement>document.getElementById('generate-multiple-choice-' + index);
        generateMultipleChoiceDiv.innerHTML = "";
        for (let i = 1; i <= labels; i++) {
            generateMultipleChoiceDiv.innerHTML += `<div class='row'><div class='col-lg-2'>Label ${i} *</div> <div class="col-lg-10">
                                                    <div class="form-group"> <input type="text" class="form-control multiple-choice"></div></div></div>`;
        }
    }

    checkClassAndAdd(element, className) {
        if (!element.classList.contains(className)) {
            element.classList.add(className);
        }
    }

    checkClassAndRemove(element, className) {
        console.log(element);
        if (element.classList.contains(className)) {
            element.classList.remove(className);
        }
    }

    setPage(data) {
        this.survey.title = data.survey.title;
        this.survey.description = data.survey.description;
        this.survey.instruction = data.survey.instruction;
        this.survey.no_of_questions = data.survey.no_of_questions;
        this.survey.survey_type = data.survey.survey_type;
        this.survey.rating_scale = data.survey.rating_scale;
        this.questions = data.survey.questions;
        // Finally set the Id of the Page
        // Depending on the rating_scale generate text-box
        this.survey.type_label = this.survey_types.find(s => s.id == this.survey.survey_type).value;
        this.survey.rating_label = this.ratings.find(r => r.id == this.survey.rating_scale).value;
        for (let i = 1; i <= this.survey.no_of_questions; i++) {
            this.addPhone();
        }
        this.surveyId = data.survey._id;
        if (this.questions.length > 0) {
            //this means this survey has question
            const self = this;
            setTimeout(function () {
                self.setQuestion();
            }, 1000);
        }

    }

    setQuestion() {
        for (let i = 0; i < this.questions.length; i++) {
            // area is the synonym of question title
            // prefix is the synonym of question type
            // exit_reason is same as exit_reason
            // line is the synonym as exit_reporting_label
            this.phoneForms.controls[i].setValue({
                id: this.questions[i]._id,
                area: this.questions[i].title ? this.questions[i].title : '',
                prefix: this.questions[i].type ? this.questions[i].type : '',
                exit_reason: this.questions[i].exit_reason ? this.questions[i].exit_reason : '',
                line: this.questions[i].exit_reporting_label ? this.questions[i].exit_reporting_label : ''
            });
            // check question type as well
            this.onChangeQuestionType(i, this.questions[i].type);
            if (this.questions[i].type == 5) {
                const labels = this.questions[i].options.length;
                this.onChangeRadioLabel(i, labels);
            }
            if (this.questions[i].type == 6) {
                const labels = this.questions[i].options.length;
                this.onChangeMultipleChoice(i, labels);
            }
        }
        this.setLabels();
    }

    setLabels() {
        for (let i = 0; i < this.questions.length; i++) {
            const question_type = this.questions[i].type;
            // if question type is 3 get all the selected input value
            if (question_type == 3) {
                // set the value
                this.exit_interview_exit_reason_ids.forEach((obj, index) => {
                    const element = <HTMLInputElement>document.getElementById(obj.id + i);
                    element.checked = this.questions[i].options[index] == "true";
                });
            } else if (question_type == 5) {
                const radio_label_inputs = document.getElementById('generate-radio-label-' + i).getElementsByClassName('radio-label');
                const no_of_labels = <HTMLInputElement>document.getElementById('no-of-radio-label-' + i);
                no_of_labels.value = '' + radio_label_inputs.length;
                for (let index = 0; index < radio_label_inputs.length; index++) {
                    const element = <HTMLInputElement>radio_label_inputs[index];
                    element.value = this.questions[i].options[index];
                }
            } else if (question_type == 6) {
                const multiple_choice_inputs = document.getElementById('generate-multiple-choice-' + i).getElementsByClassName('multiple-choice');
                const no_of_labels = <HTMLInputElement>document.getElementById('no-of-multiple-choice-' + i);
                no_of_labels.value = '' + multiple_choice_inputs.length;
                for (let index = 0; index < multiple_choice_inputs.length; index++) {
                    const element = <HTMLInputElement>multiple_choice_inputs[index];
                    element.value = this.questions[i].options[index];
                }
            }
        }
    }

    // when selection question type is Ratings Radio Buttons, Free Text, Yes No Radio Button then nothing will happen
    //
    // When selecting question type is Exit Interview - Exit Reasons Then Checkbox Option will generate
    // Options [Career Opportunities, Meaningful Work,Communication, Effective Leadership, Induction, Learning & Development]
    // Options [Manager, Pay & Benefits, Work Conditions, Being Valued, Operational, Restructure]
    //
    // When Selecting Radio Labels Then generate a dropdown field with label 1-10
    // If the number of labels selected is 3 then Generate Three input field
    //
    // When Selecting Multiple Choice Then generate a dropdown field with label 1-10
    // If the number of labels selected is 3 then Generate Three input field
    //
    // Depending on question selection. hide or display
    // Depending on question type here generate the input field
    // There are some static field. put in here

    // ************Tricks to Solve The Above Problem**************
    // create a div and add an id exit-reason-i here i is dynamic value also give a class called hide. which initially hides the div
    // inside div create the input checkbox with the appropriate label

    // create another div and add id radio-label-i here i is also dynamic value also give a class call hide
    // create the select input with value from 0 to 10 add a change event. so when the value change from 0 to 1 for example then generate 1 text-box

    // create another div and add id multiple-choice-i here i is also dynamic value also give a class call hide
    // create the select input with value from 0 to 10 add a change event. so when the value change from 0 to 1 for example then generate 1 text-box
    get phoneForms() {
        return this.myForm.get('phones') as FormArray;
    }

    submitSurvey() {
        // check the questions length
        // if question length is 0 that means we need to insert all the questions
        const errors = [];
        const final_questions = [];
        const question_array = [];
        for (let i = 0; i < this.phoneForms.controls.length; i++) {
            const question_object = {};

            const id = this.phoneForms.controls[i].get('id').value;
            // render questions
            const title = this.phoneForms.controls[i].get('area').value;
            // title
            // number_of_options
            // type
            const question_type = this.phoneForms.controls[i].get('prefix').value;
            // options
            // here depend on question type render label.
            // if question type is 3 get all the selected input value
            if (question_type == 3) {
                const options = [];
                // get all the selected value
                this.exit_interview_exit_reason_ids.forEach((obj) => {
                    const element = <HTMLInputElement>document.getElementById(obj.id + i);
                    options.push(element.checked);
                });
                question_object['options'] = options;
            } else if (question_type == 5) {
                const radio_label_inputs = document.getElementById('generate-radio-label-' + i).getElementsByClassName('radio-label');
                const options = [];
                for (let i = 0; i < radio_label_inputs.length; i++) {
                    const element = <HTMLInputElement>radio_label_inputs[i];
                    options.push(element.value);
                }
                question_object['options'] = options;
            } else if (question_type == 6) {
                const multiple_choice_inputs = document.getElementById('generate-multiple-choice-' + i).getElementsByClassName('multiple-choice');
                const options = [];
                for (let i = 0; i < multiple_choice_inputs.length; i++) {
                    const element = <HTMLInputElement>multiple_choice_inputs[i];
                    options.push(element.value);
                }
                question_object['options'] = options;
            }

            // if question type is 5(radio-label) get all the labels value
            // if question type is 6(multiple-choice) get all the labels value

            //exit-reason
            const exit_reason = this.phoneForms.controls[i].get('exit_reason').value;
            if (exit_reason == 13) {
                // this means this is the final question
                // now check if the question type Exit Interview Exit Reason ---> 3
                if (question_type != 3) {
                    errors.push('For Exit Reporting Reason Final Question Question Type Should be Exit Interview Exit Reason');
                }
                final_questions.push(i + 1);
            }
            // exit-reporting-label
            const exit_reporting_label = this.phoneForms.controls[i].get('line').value;
            question_object['_id'] = id;
            question_object['title'] = title;
            question_object['type'] = question_type;
            question_object['exit_reason'] = exit_reason;
            question_object['exit_reporting_label'] = exit_reporting_label;
            if (title === '' || this.isNullOrEmpty(title)) {
                errors.push('title field is required for question no => ' + (i + 1));
            }
            if (exit_reason === '' || this.isNullOrEmpty(exit_reason)) {
                errors.push('select exit reporting reason for question no => ' + (i + 1));
            }
            // initial question don't have required exit reporting label
            // since initial question will not be used in the Graph
            // exit_reason = 11 means this is the initial question
            if (exit_reporting_label === '' || this.isNullOrEmpty(exit_reporting_label) && exit_reason != 11) {
                errors.push('exit reporting label field is required for question no => ' + (i + 1));
            }
            // exit_reason = 13 means this is the final question
            if ((question_type === '' || this.isNullOrEmpty(question_type)) && exit_reason != 13) {
                errors.push('select question type for question no => ' + (i + 1));
            }
            question_array.push(question_object);
        }
        if (final_questions.length > 1) {
            // this means this survey has multiple final questions
            errors.push('There should have only one question which Exit Reporting Reason is Final Question');
        }
        if (final_questions.length === 0) {
            // this means there is no final question
            errors.push('There should have at least one question which Exit Reporting Reason is Final Question');
        }
        // validate the question
        if (errors.length > 0) {
            alert(errors[0]);
        } else {
            // save the survey
            // after survey successfully saved go to the survey list page
            if (this.questions.length == 0) {
                this.saveSurveyQuestion(question_array);
            } else {
                this.updateSurveyQuestion(question_array);
            }
        }
    }

    isNullOrEmpty(obj) {
        return typeof obj === 'undefined' || obj === null;
    }

    saveSurveyQuestion(question_array) {
        // delete the id from the question array
        question_array.forEach((question) => {
            delete question.id;
        });
        this.questionService.createManyQuestion(question_array, this.surveyId).subscribe(
            () => {
                this.router.navigateByUrl('/pages/surveys/survey-management');
            },
            err => {
                console.log(err);
            }
        );
    }

    updateSurveyQuestion(question_array) {
        // ********************* This Approach is easy and modular *****************
        // now it's very easy to keep track
        // which has an id that means this is an existing question [so we need to do an update query]
        // which question id is '' or null or undefined that means this is a new question [so we need to do an insert query]
        // and from the questions array we will get the deleted questions
        this.questions.forEach((question) => {
            if (question.deleted) {
                question_array.push(question);
            }
        });
        this.questionService.updateManyQuestion(question_array, this.surveyId).subscribe(
            () => {
                this.router.navigateByUrl('/pages/surveys/survey-management');
            }
        );


        // ********************* This Approach is not modular *************************
        // check if the question_array and this.questions length is same that means no question is deleted
        // sometime a question can be deleted and a new can question can be added so we should consider this scenario
        // sometimes a question can be deleted so we should delete that question from the database
        // sometimes a new question can be added so at that time we should insert a new question in the database
        // sometimes a existing question can be edited so we need to update that question.

        // we need to do most of the processing here so that on server we need to process less
    }

    addPhone() {

        const phone = this.fb.group({
            id: [],
            area: [],
            prefix: [],
            line: [],
            exit_reason: [],
        });
        this.phoneForms.push(phone);
    }

    deletePhone(i) {
        if (this.questions.length > 0) {
            // this means this question was previously saved. so we need to keep track
            if (typeof this.questions[i] !== 'undefined' && this.questions[i] !== null) {
                this.questions[i].deleted = true;
            }
        }
        this.phoneForms.removeAt(i);
    }

    ngAfterViewInit() {
        if (this.surveyId) {
            //get the employee from the database and set to the employee
            this.getSurvey();
        }
    }

}
