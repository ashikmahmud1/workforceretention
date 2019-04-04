import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {SurveyEmailService} from "../../../@core/data/survey-email.service";

@Component({
    selector: 'ngx-email-management',
    templateUrl: './email-management.component.html',
    styleUrls: ['./email-management.component.scss']
})
export class EmailManagementComponent implements OnInit {

    rows = [];
    count = 0;
    offset = 0;
    limit = 10;
    emails;

    constructor(private router: Router,
                private emailService: SurveyEmailService) {
    }

    ngOnInit() {
        this.page(this.offset, this.limit);
    }

    onClickEdit(id) {
        this.router.navigateByUrl('/pages/surveys/email-management/edit/' + id);
    }

    /**
     * Populate the table with new data based on the staticPage number
     * @param staticPage The staticPage to select
     */
    onPage(event) {
        this.page(event.offset, event.limit);
    }

    page(offset, limit) {
        this.emailService.getSurveyEmails(this.offset, this.limit).subscribe(results => {
            console.log(results);
                this.emails = results.surveyEmails;
                this.count = this.emails.length;
                const rows = [];
                this.emails.map((email) => {
                    email.id = email._id;
                    email.fromAddress = email.from_address;
                    rows.push(email);
                });
                this.rows = rows;
                console.log(this.rows);

            },
            (err) => {
                console.log(err);
            }
        );
    }

}
