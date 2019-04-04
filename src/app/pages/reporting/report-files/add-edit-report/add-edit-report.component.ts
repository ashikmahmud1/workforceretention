import {Component, OnInit} from '@angular/core';
import {TinyMceService} from "../../../../@core/data/tiny-mce.service";
import {NbTokenService} from "@nebular/auth";
import {ActivatedRoute, Router} from "@angular/router";
import {ReportService} from "../../../../@core/data/report.service";
import {ClientService} from "../../../../@core/data/client.service";

@Component({
    selector: 'ngx-add-edit-report',
    templateUrl: './add-edit-report.component.html',
    styleUrls: ['./add-edit-report.component.scss'],
})
export class AddEditReportComponent implements OnInit {
    reportId;
    report;
    user;
    successMessage;
    errorMessage;
    fileName;
    clients = [];
    file;

    constructor(private tinyMCEService: TinyMceService,
                private clientService: ClientService,
                private reportService: ReportService,
                private tokenService: NbTokenService,
                private route: ActivatedRoute,
                private router: Router) {
        this.report = {client: '', is_organization: false, is_division: false, is_department: false};
    }

    getEditorContent($event) {
        this.report.description = $event;
    }

    setEditorContent(content) {
        this.tinyMCEService.contentChange.next(content);
    }

    ngOnInit() {
        this.reportId = this.route.snapshot.paramMap.get('id');
        if (this.reportId) {
            //get the employee from the database and set to the employee
            this.getReport();
        }
        //get the employee from the localStorage
        // call the refresh token here
        this.tokenService.get()
            .subscribe(token => {
                this.user = token.getPayload();
            });
        this.getClients();
    }

    onFilePicked(event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.fileName = file.name;
        this.file = file;
    }

    getReport() {
        this.reportService.getClientReport(this.reportId).subscribe(
            data => {
                this.setReport(data);
            },
            err => {
                console.log(err);
            }
        );
    }

    getClients() {
        this.clientService.getClients(0, 100000).subscribe(
            res => {
                this.clients = res.clients;
            }
        );
    }

    createReport() {
        // get the employee from the localstorage
        const formData = new FormData();
        formData.append('title', this.report.title);
        formData.append('description', this.report.description);
        formData.append('file', this.file);
        formData.append('client', this.report.client);

        // **************** Process the is_organization, is_division and is_department **************
        const org_input_yes = <HTMLInputElement>document.getElementById('level-org-yes');
        if (org_input_yes.checked) {
            this.report.is_organization = true;
        }
        const div_input_yes = <HTMLInputElement>document.getElementById('level-div-yes');
        if (div_input_yes.checked) {
            this.report.is_division = true;
        }
        const dept_input_yes = <HTMLInputElement>document.getElementById('level-dept-yes');
        if (dept_input_yes.checked) {
            this.report.is_department = true;
        }
        formData.append('is_organization', this.report.is_organization);
        formData.append('is_division', this.report.is_division);
        formData.append('is_department', this.report.is_department);
        console.log(this.reportId);
        if (this.reportId) {
            this.update(formData);
        } else {
            this.insert(formData);
        }
    }

    insert(report) {
        this.reportService.createReport(report).subscribe(
            data => {
                this.successMessage = data.message;
                this.setReport(data);
                this.router.navigateByUrl('/pages/reporting/report-files');
            },
            err => {
                const {error} = err;
                this.errorMessage = error.message;
            }
        );
    }

    update(report) {
        this.reportService.updateReport(report, this.reportId).subscribe(
            data => {
                this.successMessage = data.message;
                this.setReport(data);
            },
            err => {
                const {error} = err;
                this.errorMessage = error.message;
            }
        );
    }

    setReportOrgDivDept() {
        // *************** Organization ******************
        if (this.report.is_organization) {
            // this means Reminder Email Send Is ON
            const level_org_yes = <HTMLInputElement>document.getElementById('level-org-yes');
            level_org_yes.checked = true;
        } else {
            // this means Reminder Email Send is OFF
            const level_org_no = <HTMLInputElement>document.getElementById('level-org-no');
            level_org_no.checked = true;
        }

        // *************** Division ******************
        if (this.report.is_division) {
            // this means Reminder Email Send Is ON
            const level_div_yes = <HTMLInputElement>document.getElementById('level-div-yes');
            level_div_yes.checked = true;
        } else {
            // this means Reminder Email Send is OFF
            const level_div_no = <HTMLInputElement>document.getElementById('level-div-no');
            level_div_no.checked = true;
        }

        // *************** Department ******************
        if (this.report.is_department) {
            // this means Reminder Email Send Is ON
            const level_dept_yes = <HTMLInputElement>document.getElementById('level-dept-yes');
            level_dept_yes.checked = true;
        } else {
            // this means Reminder Email Send is OFF
            const level_dept_no = <HTMLInputElement>document.getElementById('level-dept-no');
            level_dept_no.checked = true;
        }
    }

    setReport(data) {
        this.report.title = data.report.title;
        this.report.description = data.report.description;
        this.report.filename = data.report.filename;
        this.report.is_organization = data.report.is_organization;
        this.report.is_division = data.report.is_division;
        this.report.is_department = data.report.is_department;
        this.fileName = data.report.filename;
        this.report.client = data.report.client;
        this.setReportOrgDivDept();

        this.setEditorContent(this.report.description);

    }

}
