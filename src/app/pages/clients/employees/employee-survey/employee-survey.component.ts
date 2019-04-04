import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {SurveyService} from "../../../../@core/data/survey.service";
import {AnswerService} from "../../../../@core/data/answer.service";

@Component({
    selector: 'ngx-employee-survey',
    templateUrl: './employee-survey.component.html',
    styleUrls: ['./employee-survey.component.scss']
})
export class EmployeeSurveyComponent implements OnInit, AfterViewInit, OnChanges {

    @Input() surveyId: string;
    @Input() clientId: string;
    @Input() employeeId: string;
    @Input() surveyCompleted: string;
    @Output() showEmployee = new EventEmitter();
    employee;
    questions = [];
    categorical_questions = [];
    answers = [];
    question_answers = [];
    survey;
    survey_types = [
        {id: 1, value: 'Exit Interview'}
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
    question_types = [
        {id: 1, value: 'Rating Radio Buttons'},
        {id: 2, value: 'Free Text'},
        {id: 3, value: 'Exit Interview - Exit Reasons'},
        {id: 4, value: 'Yes / No Radio'},
        {id: 5, value: 'Radio Labels'},
        {id: 6, value: 'Multiple Choice'},
    ];
    exit_reason_checkbox = [
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
    exit_reason = [
        {id: 11, value: 'Initial Question'},
        {id: 10, value: 'Being Valued'},
        {id: 1, value: 'Career Opportunities'},
        {id: 15, value: 'Restructure'},
        {id: 3, value: 'Communication'},
        {id: 5, value: 'Induction'},
        {id: 4, value: 'Effective Leadership'},
        {id: 6, value: 'Learning & Development'},
        {id: 7, value: 'Manager'},
        {id: 2, value: 'Meaningful Work'},
        {id: 14, value: 'Operational'},
        {id: 8, value: 'Pay & Benefits'},
        {id: 9, value: 'Work Conditions'},
        {id: 13, value: 'Final Question'},
        {id: 12, value: 'Custom Questions'}
    ];
    // we need to rearrange questions by exit_reason
    // after rearrange we need to display questions step by step
    // another way we can display all the questions together
    // question type rating_radio buttons that means that it will display radio buttons
    // question type multiple type that means it will show checkbox
    // question type free-text that means it show textarea
    // question type yes_no radio buttons that means it will show two radio buttons
    // question type exit_interview exit_reason that means it will show the selected checkbox
    constructor(private route: ActivatedRoute,
                private surveyService: SurveyService,
                private answerService: AnswerService) {
        this.survey = {};
    }

    ngOnInit() {
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

    setPage(data) {
        this.survey.title = data.survey.title;
        this.survey.description = data.survey.description;
        this.survey.instruction = data.survey.instruction;
        this.survey.no_of_questions = data.survey.no_of_questions;
        this.survey.survey_type = data.survey.survey_type;
        this.survey.rating_scale = data.survey.rating_scale;
        this.survey.rating_labels = data.survey.rating_labels;
        this.questions = data.survey.questions;
        // Depending on the rating_scale generate text-box
        this.survey.type_label = this.survey_types.find(s => s.id == this.survey.survey_type).value;
        this.survey.rating_label = this.ratings.find(r => r.id == this.survey.rating_scale).value;
        this.questionArrange();
    }

    questionArrange() {
        let question_no = 1;
        this.exit_reason.map((reason) => {
            //now we need to loop through questions
            const categorical_questions = [];
            this.questions.map((question) => {
                // here compare the reason with the question reason
                if (reason.id == question.exit_reason) {
                    question.question_no = question_no;
                    categorical_questions.push(question);
                    question_no++;
                }
                // if both same then push the question into the categorical_questions array
            });
            this.categorical_questions.push({exit_reason: reason.value, questions: categorical_questions});
        });
    }

    onSubmitAnswer() {
        // validate answer
        const errors = [];
        this.question_answers = [];
        // render answer
        this.categorical_questions.map((cat_question) => {
            // foreach question there will have an answer
            cat_question.questions.map((question) => {
                // first check the question type
                // {id: 1, value: 'Rating Radio Buttons'},
                // {id: 2, value: 'Free Text'},
                // {id: 3, value: 'Exit Interview - Exit Reasons'},
                // {id: 4, value: 'Yes / No Radio'},
                // {id: 5, value: 'Radio Labels'},
                // {id: 6, value: 'Multiple Choice'},
                const options = [];
                if (question.type == this.question_types[0].id && cat_question.exit_reason !== 'Final Question') {
                    // Rating Radio Buttons
                    let valid = false;
                    this.survey.rating_labels.map((label, index) => {
                        const rating_radio_input = <HTMLInputElement>document.getElementById(`rating-radio-label-${question.question_no}-${index}`);
                        if (rating_radio_input.checked) {
                            options.push(index);
                            valid = true;
                        }
                    });
                    if (!valid) {
                        errors.push(question.question_no);
                    }
                } else if (question.type == this.question_types[1].id && cat_question.exit_reason !== 'Final Question') {
                    // Free Text
                    const free_text_input = <HTMLInputElement>document.getElementById(`question-comment-${question.question_no}`);
                    options.push(free_text_input.value);
                } else if (question.type == this.question_types[2].id && cat_question.exit_reason !== 'Final Question') {
                    let valid = false;
                    // Exit Interview - Exit Reasons
                    question.options.map((option, index) => {
                        if (option == 'true') {
                            const simple_radio_input = <HTMLInputElement>document.getElementById(`exit-reason-choice-${question.question_no}-${index}`);
                            // this will store the index of the checked item
                            if (simple_radio_input.checked) {
                                options.push(index);
                                valid = true;
                            }
                        }
                    });
                    if (!valid) {
                        errors.push(question.question_no);
                    }
                } else if (question.type == this.question_types[3].id && cat_question.exit_reason !== 'Final Question') {
                    let valid = false;
                    // Yes / No Radio
                    const yes_radio_label = <HTMLInputElement>document.getElementById(`radio-${question.question_no}-yes`);
                    const no_radio_label = <HTMLInputElement>document.getElementById(`radio-${question.question_no}-no`);
                    if (yes_radio_label.checked) {
                        options.push(yes_radio_label.value);
                        valid = true;
                    }
                    if (no_radio_label.checked) {
                        options.push(no_radio_label.value);
                        valid = true;
                    }
                    if (!valid) {
                        errors.push(question.question_no);
                    }
                } else if (question.type == this.question_types[4].id && cat_question.exit_reason !== 'Final Question') {
                    // Radio Labels
                    let valid = false;
                    question.options.map((option, index) => {
                        const radio_label_input = <HTMLInputElement>document.getElementById(`radio-label-${question.question_no}-${index}`);
                        if (radio_label_input.checked) {
                            options.push(index);
                            valid = true;
                        }
                    });
                    if (!valid) {
                        errors.push(question.question_no);
                    }
                } else if (cat_question.exit_reason === 'Final Question') {
                    let first_choice_valid = false;
                    let second_choice_valid = false;
                    // Final Question
                    // get the 1st  choice and 2nd choice
                    this.exit_reason_checkbox.map((exit_reason, index) => {
                        if (question.options[index] == 'true') {
                            const first_choice_radio_input = <HTMLInputElement>document.getElementById(`final-1st-choice-${question.question_no}-${exit_reason.id}`);
                            const second_choice_radio_input = <HTMLInputElement>document.getElementById(`final-2nd-choice-${question.question_no}-${exit_reason.id}`);
                            if (first_choice_radio_input.checked) {
                                options.push('1st-choice-' + exit_reason.id);
                                first_choice_valid = true;
                            }
                            if (second_choice_radio_input.checked) {
                                options.push('2nd-choice-' + exit_reason.id);
                                second_choice_valid = true;
                            }
                        }
                    });
                    // for final question set the question type 7
                    question.type = '7';
                    if (!first_choice_valid || !second_choice_valid) {
                        errors.push(question.question_no);
                    }
                } else {
                    let valid = false;
                    // Multiple Choice
                    question.options.map((option, index) => {
                        const multiple_choice_input = <HTMLInputElement>document.getElementById(`multiple-choice-${question.question_no}-${index}`);
                        if (multiple_choice_input.checked) {
                            options.push(index);
                            valid = true;
                        }
                    });
                    if (!valid) {
                        errors.push(question.question_no);
                    }
                }
                const answer = {options: options, question: question._id, question_type: question.type};
                this.question_answers.push(answer);
            });
        });
        // save the answer to the database
        if (errors.length > 0) {
            alert('Please select an option for question -> ' + errors[0]);
        } else {
            // this means no error
            // send the answer to the server
            // since here is list of answers server needs to handle list of answer
            // foreach answer set the employee. so that in server we need to do less processing
            this.question_answers.map((answer) => {
                answer.employee = this.employeeId;
                answer.survey = this.surveyId;
            });
            if (this.surveyCompleted) {
                this.updateQuestionAnswer();
            } else {
                this.saveQuestionAnswer();
            }
        }
    }

    saveQuestionAnswer() {
        this.answerService.createManyAnswer(this.question_answers, this.surveyId, this.employeeId, 'No', 'Yes').subscribe(
            () => {
                alert('Exit interview submitted successfully');
                this.showEmployee.emit();
            }
        );
    }

    updateQuestionAnswer() {
        this.answers.map((answer, index) => {
            answer.options = this.question_answers[index].options;
            // remove everything except the options since options will be updated
        });
        this.answerService.updateManyAnswer(this.answers).subscribe(
            () => {
                alert('Exit interview updated');
                this.showEmployee.emit();
            }
        );
    }

    setQuestionAnswer() {
        this.answerService.getEmployeeSurveyAnswer(this.employeeId, this.surveyId).subscribe(
            data => {
                this.answers = data.answers;
                this.setAnswer();
            });
    }

    setAnswer() {
        this.categorical_questions.map((cat_question) => {
            // foreach question there will have an answer
            cat_question.questions.map((question) => {
                // find the question answer
                const answer = this.answers.find(a => a.question == question._id);
                // also checking if the question is not final question
                if (answer) {
                    if (answer.question_type == this.question_types[0].id && answer.question_type != '7') {
                        // Rating Radio Buttons
                        this.survey.rating_labels.map((label, index) => {
                            const rating_radio_input = <HTMLInputElement>document.getElementById(`rating-radio-label-${question.question_no}-${index}`);
                            if (answer.options[0] == index) {
                                // check me
                                rating_radio_input.checked = true;
                            }
                        });
                    } else if (answer.question_type == this.question_types[1].id && answer.question_type != '7') {
                        // Free Text
                        const free_text_input = <HTMLInputElement>document.getElementById(`question-comment-${question.question_no}`);
                        free_text_input.value = answer.options[0];
                    } else if (answer.question_type == this.question_types[2].id && answer.question_type != '7') {
                        // Exit Interview - Exit Reasons
                        question.options.map((option, index) => {
                            if (option == 'true') {
                                const simple_radio_input = <HTMLInputElement>document.getElementById(`exit-reason-choice-${question.question_no}-${index}`);
                                // this will store the index of the checked item
                                // check if the index is in the answer options
                                // if the index is in the answer options then check that input
                                const option_index = '' + index;
                                if (answer.options.includes(option_index)) {
                                    simple_radio_input.checked = true;
                                }
                            }
                        });
                    } else if (answer.question_type == this.question_types[3].id && answer.question_type != '7') {
                        // Yes / No Radio
                        const yes_radio_label = <HTMLInputElement>document.getElementById(`radio-${question.question_no}-yes`);
                        const no_radio_label = <HTMLInputElement>document.getElementById(`radio-${question.question_no}-no`);
                        if (answer.options[0] == '1') {
                            yes_radio_label.checked = true;
                        } else {
                            no_radio_label.checked = true;
                        }
                    } else if (answer.question_type == this.question_types[4].id && answer.question_type != '7') {
                        // Radio Labels
                        question.options.map((option, index) => {
                            const radio_label_input = <HTMLInputElement>document.getElementById(`radio-label-${question.question_no}-${index}`);
                            if (answer.options[0] == index) {
                                radio_label_input.checked = true;
                            }
                        });
                    } else if (answer.question_type === '7') {
                        // This is the final question
                        this.exit_reason_checkbox.map((exit_reason, index) => {
                            if (question.options[index] == 'true') {
                                const first_choice_radio_input = <HTMLInputElement>document.getElementById(`final-1st-choice-${question.question_no}-${exit_reason.id}`);
                                const second_choice_radio_input = <HTMLInputElement>document.getElementById(`final-2nd-choice-${question.question_no}-${exit_reason.id}`);
                                // answer options will contain two values
                                const first_choice = answer.options[0].split('-');
                                const second_choice = answer.options[1].split('-');
                                if (first_choice[0] == '1st') {
                                    if (first_choice[2] == exit_reason.id) {
                                        first_choice_radio_input.checked = true;
                                    }

                                } else {
                                    if (first_choice[2] == exit_reason.id) {
                                        second_choice_radio_input.checked = true;
                                    }
                                }

                                if (second_choice[0] == '1st') {
                                    if (second_choice[2] == exit_reason.id) {
                                        first_choice_radio_input.checked = true;
                                    }
                                } else {
                                    if (second_choice[2] == exit_reason.id) {
                                        second_choice_radio_input.checked = true;
                                    }
                                }
                            }
                        });
                    } else {
                        // Multiple Choice
                        question.options.map((option, index) => {
                            const multiple_choice_input = <HTMLInputElement>document.getElementById(`multiple-choice-${question.question_no}-${index}`);
                            const option_index = '' + index;
                            if (answer.options.includes(option_index)) {
                                multiple_choice_input.checked = true;
                            }
                        });
                    }
                }
            });
        });
    }

    ngAfterViewInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {

        this.surveyId = changes.surveyId.currentValue;
        this.employeeId = changes.employeeId.currentValue;
        this.clientId = changes.clientId.currentValue;
        this.surveyCompleted = changes.surveyCompleted.currentValue;
        if (typeof this.surveyId !== 'undefined' && this.surveyId !== null) {
            this.getSurvey();
        }
        // here check if the survey was previously completed or not.
        // if the survey was previously completed then set the answer
        if (this.surveyCompleted) {
            const self = this;
            setTimeout(function () {
                self.setQuestionAnswer();
            }, 1000);
        }
    }

}
