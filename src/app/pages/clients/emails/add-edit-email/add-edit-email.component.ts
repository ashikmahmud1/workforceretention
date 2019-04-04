import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {EmailService} from "../../../../@core/data/email.service";
import {ClientService} from "../../../../@core/data/client.service";

@Component({
    selector: 'ngx-add-edit-email',
    templateUrl: './add-edit-email.component.html',
    styleUrls: ['./add-edit-email.component.scss']
})
export class AddEditEmailComponent implements OnInit, OnChanges {
    @Input() emailId;
    @Input() clientId: string;
    successMessage;
    errorMessage;
    email;

    constructor(private route: ActivatedRoute, private emailService: EmailService, private clientService: ClientService) {
        this.email = {fromAddress: '', subject: '', body: ''};
    }

    ngOnInit() {
    }

    getEmail() {
        this.clientService.getClientEmail(this.clientId, this.emailId).subscribe(
            data => {
                this.setResult(data);
            },
            err => {
                console.log(err);
            }
        );
    }

    createEmail() {
        const email = {
            from_address: this.email.fromAddress,
            subject: this.email.subject,
            body: this.email.body
        };
        console.log(this.email);
        // ****************** update email ****************
        console.log(email);
        if (this.emailId) {
            //perform update operation
            this.update(email);
        }
    }

    update(email) {
        this.clientService.updateEmail(this.clientId, this.emailId, email).subscribe(
            data => {
                this.errorMessage = null;
                this.successMessage = data.message;
            },
            err => {
                const {error} = err;
                this.errorMessage = error.message;
            }
        );
    }

    setResult(data) {
        this.email = data.email;
        this.email.fromAddress = this.email.from_address;
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.emailId = changes.emailId.currentValue;
        this.clientId = changes.clientId.currentValue;
        if (typeof this.emailId !== 'undefined' && this.emailId !== null) {
            this.getEmail();
        }
    }

}
