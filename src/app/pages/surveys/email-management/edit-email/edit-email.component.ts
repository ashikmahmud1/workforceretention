import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {SurveyEmailService} from "../../../../@core/data/survey-email.service";

@Component({
  selector: 'ngx-edit-email',
  templateUrl: './edit-email.component.html',
  styleUrls: ['./edit-email.component.scss']
})
export class EditEmailComponent implements OnInit {
  successMessage;
  errorMessage;
  email;
  emailId;

  constructor(private route: ActivatedRoute, private emailService: SurveyEmailService) {
    this.email = {fromAddress: '', subject: '', body: ''};
  }

  ngOnInit() {
    this.emailId = this.route.snapshot.paramMap.get('id');
    this.getEmail();
  }

  getEmail() {
    this.emailService.getSurveyEmail(this.emailId).subscribe(
        data => {
          console.log(data);
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
    if (this.emailId) {
      //perform update operation
      this.update(email);
    }
  }

  update(email) {
    this.emailService.updateSurveyEmail(email, this.emailId).subscribe(
        data => {
          this.errorMessage = null;
          this.successMessage = data.message;
          this.setResult(data);
        },
        err => {
          const {error} = err;
          this.errorMessage = error.message;
          console.log(err);
        }
    );
  }

  setResult(data) {
    this.email = data.surveyEmail;
    this.email.fromAddress = this.email.from_address;
  }

}
