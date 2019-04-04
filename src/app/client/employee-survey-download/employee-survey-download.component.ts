import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AnswerService} from "../../@core/data/answer.service";
import {SurveyService} from "../../@core/data/survey.service";
import {NbSpinnerService} from "@nebular/theme";

@Component({
    selector: 'ngx-employee-survey-download',
    templateUrl: './employee-survey-download.component.html',
    styleUrls: ['./employee-survey-download.component.scss']
})
export class EmployeeSurveyDownloadComponent implements OnInit {

    surveyCompleted = false;
    employeeId;
    employee;
    surveyId;
    survey;
    questions = [];
    answers = [];
    categorical_questions = [];
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

    // if question type is Rating Radio Buttons, Exit Interview - Exit Reasons (display like as it is),
    constructor(private route: ActivatedRoute,
                private answerService: AnswerService,
                private surveyService: SurveyService,
                private spinnerService: NbSpinnerService) {
        this.survey = {};
        this.employee = {};
    }

    ngOnInit() {
        this.spinnerService.load();
        this.route.queryParams.subscribe(params => {
            this.surveyCompleted = params['completed'];
            this.employeeId = params['employeeId'];
            this.surveyId = params['surveyId'];
            this.getSurvey();
        });
    }

    // we need to get the survey with question answer
    getSurvey() {
        this.surveyService.getSurveyWithQuestionsAnswers(this.surveyId, this.employeeId).subscribe(
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
        this.answers = data.answers;
        this.employee = data.employee;
        this.questionArrange();
    }

    questionArrange() {
        let question_no = 1;
        this.exit_reason.map((reason) => {
            //now we need to loop through questions
            const categorical_questions = [];
            const categorical_answers = [];
            this.questions.map((question) => {
                // here compare the reason with the question reason
                if (reason.id == question.exit_reason) {
                    const answer = this.answers.find(a => a.question == question._id);
                    categorical_answers.push(answer);
                    question.question_no = question_no;
                    categorical_questions.push(question);
                    question_no++;
                    //check if the question is a final question or not
                    if (reason.id == 13) {
                        const choices = [];
                        const choice_labels = [];
                        // re-arrange answer with two things
                        const first_options = answer.options[0].split('-');
                        const second_options = answer.options[1].split('-');
                        choices.push(first_options[2]);
                        choices.push(second_options[2]);
                        answer.choices = choices;
                        choice_labels.push(first_options[0]);
                        choice_labels.push(second_options[0]);
                        answer.choice_labels = choice_labels;
                    }
                }
                // if both same then push the question into the categorical_questions array
            });
            this.categorical_questions.push({
                exit_reason: reason.value,
                questions: categorical_questions,
                answers: categorical_answers
            });
        });
        console.log(this.categorical_questions);
        console.log(this.employee);
        // here check if the survey was previously completed or not.
        // if the survey was previously completed then set the answer
    }

}
