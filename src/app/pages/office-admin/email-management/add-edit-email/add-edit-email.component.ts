import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {EmailService} from "../../../../@core/data/email.service";

@Component({
    selector: 'ngx-add-edit-email',
    templateUrl: './add-edit-email.component.html',
    styleUrls: ['./add-edit-email.component.scss']
})
export class AddEditEmailComponent implements OnInit {

    emailId;
    email;
    successMessage;
    errorMessage;

    // email will have property subject (text-box), from_email (text-box), body (textarea),
    // Edit Per Client (Radio Button), Can Assign Copy to client (Radio Button)
    constructor(private route: ActivatedRoute, private emailService: EmailService) {
        this.email = {};
    }

    ngOnInit() {
        this.emailId = this.route.snapshot.paramMap.get('id');
        if (this.emailId) {
            this.getEmail();
        }
    }

    getEmail() {
        this.emailService.getEmail(this.emailId).subscribe(
            res => {
                this.email = res.email;
                console.log(this.email);
            }
        );
    }

    updateEmail() {
        delete this.email._id;
        this.emailService.updateEmail(this.email, this.emailId).subscribe(
            res => {
                this.successMessage = res.message;
            }
        );
    }

    updateAssignValue(value) {
        this.email.assign_to_client = JSON.parse(value);
    }

    updateEditValue(value) {
        this.email.editable = JSON.parse(value);
    }

}
