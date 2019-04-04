import {Component, OnInit} from '@angular/core';
import {SurveyService} from "../../@core/data/survey.service";
import {Router} from "@angular/router";
import {EmployeeService} from "../../@core/data/employee.service";
import {ReportService} from "../../@core/data/report.service";

@Component({
    selector: 'ngx-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

    count = 0;
    offset = 0;
    first_name = '';
    totalCompletedSurveys;
    totalEmployees;
    organization;
    limit = 9;
    employee;
    message;
    completedSurveys = [];

    constructor(private surveyService: SurveyService,
                private router: Router,
                private employeeService: EmployeeService,
                private reportService: ReportService) {
    }

    ngOnInit() {
        // check the localStorage. if get the user id then set isAuth to true
        if (localStorage.getItem('employee')) {
            // parse the employee object and check the expiration of the login. if the login time is expired
            this.employee = JSON.parse(localStorage.getItem('employee'));
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
        this.reportService.getReportDetails(this.employee.employee_id).subscribe(
            res => {
                this.message = res.message;
                this.first_name = res.name;
                this.totalCompletedSurveys = res.completedSurveys;
                this.totalEmployees = res.employees;
                this.organization = res.organization.name;

                this.count = 1;
                this.completedSurveys = [{
                    reportType: 'Exit Surveys',
                    reportDescription: 'Aggregate data of Completed Exit Interviews, plus Individual Survey Data',
                    completedSurveys: this.totalCompletedSurveys + '   /   ' + this.totalEmployees
                }];
            }
        );
    }

    onClickGoReport() {
        this.router.navigateByUrl('/client/manager-report');
    }

}
