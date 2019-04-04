import {Component, OnInit} from '@angular/core';
import {EmailService} from "../../../@core/data/email.service";
import {Router} from "@angular/router";

@Component({
    selector: 'ngx-email-management',
    templateUrl: './email-management.component.html',
    styleUrls: ['./email-management.component.scss']
})
export class EmailManagementComponent implements OnInit {

    rows = [];
    count = 0;
    offset = 0;
    limit = 5;
    emails;

    constructor(private emailService: EmailService, private router: Router) {
    }

    onClickEdit(emailId) {
        this.router.navigateByUrl('/pages/office-admin/email-management/edit/' + emailId);
    }

    /**
     * Populate the table with new data based on the staticPage number
     * @param staticPage The staticPage to select
     */
    onPage(event) {
        this.page(event.offset, event.limit);
    }

    page(offset, limit) {
        this.emailService.getEmails(offset, limit).subscribe(res => {
                this.emails = res.emails;
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

    ngOnInit() {
        this.page(this.offset, this.limit);
    }

}
