import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CountryService} from "../../../../@core/data/country.service";
import {IndustryService} from "../../../../@core/data/industry.service";
import {NbTokenService} from "@nebular/auth";
import {TinyMceService} from "../../../../@core/data/tiny-mce.service";
import {BoxService} from "../../../../@core/data/box.service";
import {PageService} from "../../../../@core/data/page.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SurveyService} from "../../../../@core/data/survey.service";

@Component({
    selector: 'ngx-add-edit-survey',
    templateUrl: './add-edit-survey.component.html',
    styleUrls: ['./add-edit-survey.component.scss']
})
export class AddEditSurveyComponent implements OnInit {
    // All the staticPage fields should declare here;
    // name [Input Box]
    // Image [Choose File]
    // workforce [Dropdown] Number of Employees
    // staticPage industry [dropdown]
    // staticPage country [Dropdown], staticPage state [Dropdown, Input box],
    // staticPage products [Dropdown], aggregate_reports [Dropdown], staticPage turnover[Input Box],
    // org_mgt [Dropdown]
    survey = {
        title: '', description: '', instruction: '',
        no_of_questions: '', survey_type: '',
        rating_scale: ''
    };
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
    surveyId;
    boxes;
    successMessage;
    user;

    constructor(private route: ActivatedRoute,
                private countryService: CountryService,
                private industryService: IndustryService,
                private tokenService: NbTokenService,
                private surveyService: SurveyService,
                private router: Router,
                private tinyMCEService: TinyMceService,
                private boxService: BoxService,
                private pageService: PageService) {
    }

    ngOnInit() {
        this.surveyId = this.route.snapshot.paramMap.get('id');
        if (this.surveyId) {
            //get the employee from the database and set to the employee
            this.getSurvey();
        }
        this.createForm();
        //get the employee from the localStorage
        // call the refresh token here
        this.tokenService.get()
            .subscribe(token => {
                this.user = token.getPayload();
            });
    }

    surveyForm: FormGroup;

    // control reference function
    get(controlName) {
        return this.surveyForm.get(controlName);
    }

    createForm() {
        this.surveyForm = new FormGroup({
            title: new FormControl('', Validators.required),
            no_of_questions: new FormControl('', Validators.required),
            survey_type: new FormControl('', Validators.required),
            rating_scale: new FormControl('', Validators.required),
        });
    }

    getSurveyDescription($event) {
        this.survey.description = $event;
    }

    getSurveyInstruction($event) {
        this.survey.instruction = $event;
    }

    setEditorContent(description) {
        //this is used for set the page_text;
        this.tinyMCEService.contentChange.next(description);
    }

    setSimpleEditorContent(instruction) {
        //This is used for set the home_text
        this.tinyMCEService.simpleTinyMceContentChange.next(instruction);
    }

    createPage() {
        if (this.surveyForm.valid) {
            //create a new staticPage object instance
            const survey = {
                title: this.get('title').value,
                description: this.survey.description,
                instruction: this.survey.instruction,
                no_of_questions: this.get('no_of_questions').value,
                survey_type: this.get('survey_type').value,
                rating_scale: this.get('rating_scale').value
            };
            if (!this.surveyId) {
                this.insert(survey);
            } else {
                this.update(survey);
            }
        }
    }

    insert(survey) {
        this.surveyService.createSurvey(survey, this.user._id).subscribe(
            data => {
                this.successMessage = data.message;
                this.setPage(data);
                this.router.navigateByUrl('/pages/surveys/survey-management/details/' + data.survey._id);
            },
            err => {
                const {error} = err;
                this.surveyForm.setErrors({'message': error.message});
            }
        );
    }

    update(survey) {
        this.surveyService.updateSurvey(survey, this.surveyId).subscribe(
            data => {
                this.successMessage = data.message;
                this.setPage(data);
                this.router.navigateByUrl('/pages/surveys/survey-management/details/' + data.survey._id);
            },
            err => {
                const {error} = err;
                this.surveyForm.setErrors({'message': error.message});
            }
        );
    }

    getSurvey() {
        this.surveyService.getSurvey(this.surveyId).subscribe(data => {
                this.setPage(data);
            },
            err => {
                const {error} = err;
                this.surveyForm.setErrors({'message': error.message});
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

        this.setEditorContent(this.survey.description);
        this.setSimpleEditorContent(this.survey.instruction);
        this.get('no_of_questions').disable();
        // Finally set the Id of the Page
        this.surveyId = data.survey._id;

    }

}
