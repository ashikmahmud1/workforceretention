import {Component, OnInit} from '@angular/core';
import {SurveyService} from "../../@core/data/survey.service";
import {Router} from "@angular/router";
import {EmployeeService} from "../../@core/data/employee.service";
import {JwtHelperService} from "@auth0/angular-jwt";

@Component({
    selector: 'ngx-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    count = 0;
    offset = 0;
    limit = 9;
    employee;
    employee_details;
    survey_start_date;
    completedSurveys = [];
    employeeSurvey;

    constructor(private surveyService: SurveyService,
                private router: Router,
                private employeeService: EmployeeService) {
        this.employee = {};
        this.employee_details = {};
    }

    ngOnInit() {
        // check the localStorage. if get the user id then set isAuth to true
        if (localStorage.getItem('employee')) {
            // parse the employee object and check the expiration of the login. if the login time is expired
            this.employee = JSON.parse(localStorage.getItem('employee'));
            const helper = new JwtHelperService();
            this.employee_details = helper.decodeToken(this.employee.access_token);
        }
        this.setCompletedSurveys(this.offset, this.limit);
    }

    /**
     * Populate the table with new data based on the staticPage number
     * @param staticPage The staticPage to select
     */
    onChangeCompletedSurveys(event) {
        this.setCompletedSurveys(event.offset, event.limit);
    }

    setCompletedSurveys(offset, limit) {
        this.employeeService.getEmployeeSurveys(this.employee.employee_id).subscribe(
            data => {
                this.count = data.surveys.length;
                const rows = [];
                data.surveys.map((employeeSurvey) => {
                    console.log(employeeSurvey);
                    // Modify article role
                    employeeSurvey.id = employeeSurvey.survey._id;
                    employeeSurvey.description = employeeSurvey.survey.description;
                    employeeSurvey.title = employeeSurvey.survey.title;
                    employeeSurvey.noOfQuestion = employeeSurvey.survey.no_of_questions;
                    this.survey_start_date = employeeSurvey.start_date;

                    //completed, survey, start_date and end_date
                    this.employeeSurvey = {
                        _id: employeeSurvey._id,
                        completed: employeeSurvey.completed,
                        survey: employeeSurvey.survey._id,
                        start_date: employeeSurvey.start_date,
                        end_date: employeeSurvey.end_date
                    };
                    rows.push(employeeSurvey);
                });
                this.completedSurveys = rows;
            }
        );
    }

    onClickGoSurvey(surveyId, completed) {
        // update the employee survey start_date
        if ((this.employeeSurvey.start_date == null || typeof this.employeeSurvey.start_date == 'undefined') && !this.employeeSurvey.completed) {
            // update survey start date
            this.updateSurveyStartDate(surveyId, completed);
        } else {
            this.employeeService.surveyCompleted = completed;
            this.router.navigate(['/client/questions/' + surveyId], {queryParams: {completed: completed}});
        }
    }

    updateSurveyStartDate(surveyId, completed) {
        this.employeeSurvey.start_date = new Date();
        const employeeSurveys = [];
        employeeSurveys.push(this.employeeSurvey);
        const employeeData = {surveys: employeeSurveys};
        this.employeeService.updateEmployee(employeeData, this.employee.employee_id).subscribe(
            () => {
                this.employeeService.surveyCompleted = completed;
                this.router.navigate(['/client/questions/' + surveyId], {queryParams: {completed: completed}});
            });
    }

}
