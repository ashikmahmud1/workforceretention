import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {EmployeeService} from "../../../../@core/data/employee.service";
import {OrganizationService} from "../../../../@core/data/organization.service";
import {DivisionService} from "../../../../@core/data/division.service";
import {DepartmentService} from "../../../../@core/data/department.service";
import {Router} from "@angular/router";
import {URLService} from "../../../../@core/data/url.service";
import {SurveyService} from "../../../../@core/data/survey.service";

@Component({
    selector: 'ngx-employee-details',
    templateUrl: './employee-details.component.html',
    styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit, OnChanges {

    @Input() employeeId: string;
    @Input() clientId: string;
    @Output() editSurvey = new EventEmitter();
    employee;
    surveyId;
    employeeSurvey;
    surveyCompleted = false;

    constructor(private employeeService: EmployeeService,
                private organizationService: OrganizationService,
                private divisionService: DivisionService,
                private departmentService: DepartmentService,
                private router: Router,
                private urlService: URLService,
                private surveyService: SurveyService) {
        this.employee = {};
    }

    ngOnInit() {
    }

    onEditSurvey() {
        if ((this.employeeSurvey.start_date == null ||
            typeof this.employeeSurvey.start_date == 'undefined')
            && !this.surveyCompleted) {
            this.updateSurveyStartDate();
        } else {
            this.editSurvey.emit({
                surveyId: this.surveyId,
                surveyCompleted: this.surveyCompleted,
                employeeId: this.employeeId
            });
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.clientId = changes.clientId.currentValue;
        this.employeeId = changes.employeeId.currentValue;
        if (typeof this.employeeId !== 'undefined' && this.employeeId !== null) {
            this.getEmployee();
        }
    }

    getOrganization(organizationId) {
        this.organizationService.getOrganization(organizationId).subscribe(
            data => {
                this.employee.organization = data.organization.name;
                if (this.employee.division) {
                    this.getDivision(this.employee.division);
                }
            }
        );
    }

    getDivision(divisionId) {
        this.divisionService.getDivision(divisionId).subscribe(
            data => {
                this.employee.division = data.division.name;
                if (this.employee.department) {
                    this.getDepartment(this.employee.department);
                }
            }
        );
    }

    getDepartment(departmentId) {
        this.departmentService.getDepartment(departmentId).subscribe(
            data => {
                this.employee.department = data.department.name;
            }
        );
    }

    onDownloadPdf() {
        // here we have employee details
        // we need to build a url with this employee details which we will send to the server
        const url = `/#/client/employee-survey?completed=${this.surveyCompleted}&employeeId=${this.employeeId}&surveyId=${this.surveyId}`;
        // window.open(url, '_blank');
        this.surveyService.downloadCompletedSurvey({url}).subscribe(
            res => {
                // here we will get the name of the file
                const fileName = res.fileName;
                this.download(fileName);
            }
        );
    }

    download(fileName) {
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = this.urlService.baseUrl + '/server/pdf/' + fileName;
        a.click();
        a.remove(); // remove the element
    }

    updateSurveyStartDate() {
        this.employeeSurvey.start_date = new Date();
        const employeeSurveys = [];
        employeeSurveys.push(this.employeeSurvey);
        const employeeData = {surveys: employeeSurveys};
        this.employeeService.updateEmployee(employeeData, this.employee._id).subscribe(
            () => {
                this.editSurvey.emit({
                    surveyId: this.surveyId,
                    surveyCompleted: this.surveyCompleted,
                    employeeId: this.employeeId
                });
            });
    }

    getEmployee() {
        this.employeeService.getEmployee(this.employeeId).subscribe(data => {
                //set the employee
                this.employee = data.employee;
                if (this.employee.surveys.length > 0) {
                    this.surveyId = this.employee.surveys[0].survey;
                    this.surveyCompleted = this.employee.surveys[0].completed;
                    this.employeeSurvey = this.employee.surveys[0];
                }
                if (this.employee.organization) {
                    this.getOrganization(this.employee.organization);
                }
            },
            err => {
                console.log(err);
            }
        );
    }

}
