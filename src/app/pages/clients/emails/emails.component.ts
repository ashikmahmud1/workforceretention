import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Router} from "@angular/router";
import {IndustryService} from "../../../@core/data/industry.service";
import {ClientService} from "../../../@core/data/client.service";

@Component({
    selector: 'ngx-emails',
    templateUrl: './emails.component.html',
    styleUrls: ['./emails.component.scss']
})
export class EmailsComponent implements OnInit, OnChanges {
    @Input() clientId: string;
    @Output() emailEdit = new EventEmitter();
    rows = [];
    count = 0;
    offset = 0;
    limit = 5;
    emails;

    constructor(private router: Router,
                private industryService: IndustryService,
                private clientService: ClientService) {
    }

    ngOnInit() {
    }

    onClickAdd() {
        this.router.navigateByUrl('/pages/clients/staticPage-selection/industries/add');
    }

    onClickEdit(emailId) {
        this.emailEdit.emit({emailId});
    }

    /**
     * Populate the table with new data based on the staticPage number
     * @param staticPage The staticPage to select
     */
    onPage(event) {
        this.page(event.offset, event.limit);
    }

    page(offset, limit) {
        this.clientService.getClientEmails(this.clientId).subscribe(results => {
                this.emails = results.client.emails;
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

    ngOnChanges(changes: SimpleChanges): void {
        this.clientId = changes.clientId.currentValue;
        if (typeof this.clientId !== 'undefined' && this.clientId !== null) {
            this.page(0, 1000);
        }
    }

}
