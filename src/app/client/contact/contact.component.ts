import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'ngx-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

    email = {name: '', from_email: '', subject: '', message: ''};
    contactForm: FormGroup;

    constructor() {
    }

    ngOnInit() {
        this.createForm();
    }

    // validator function
    get(controlName) {
        return this.contactForm.get(controlName);
    }

    createForm() {
        this.contactForm = new FormGroup({
            name: new FormControl('', [Validators.required]),
            email: new FormControl('', [
                Validators.required,
                Validators.pattern("[^ @]*@[^ @]*")
            ]),
            subject: new FormControl('', [Validators.required]),
            message: new FormControl('', [Validators.required])
        });
    }

    sendEmail() {
    }

}
