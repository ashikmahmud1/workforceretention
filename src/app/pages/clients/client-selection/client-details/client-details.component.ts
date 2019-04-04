import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ClientService} from "../../../../@core/data/client.service";
import {CountryService} from "../../../../@core/data/country.service";

@Component({
    selector: 'ngx-client-details',
    templateUrl: './client-details.component.html',
    styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent implements OnInit, OnChanges {

    @Input() clientId: string;
    client;

    workforces = [
        {id: 0, value: 'Less than 100'},
        {id: 1, value: '100 - 249'},
        {id: 2, value: '250 - 499'},
        {id: 3, value: '500 - 999'},
        {id: 4, value: '1,000 - 4,999'},
        {id: 5, value: '5,000 +'}
    ];
    products = [
        {id: 1, name: 'Exit Interview'},
    ];
    aggregate_reports = [
        {id: 0, name: 'Standard'},
        {id: 1, name: 'Enhanced'}
    ];
    levels = [
        {id: 0, name: 'Aggregate Data Only'},
        {id: 1, name: 'Individual + Aggregate Data'},
    ];

    constructor(private clientService: ClientService, private countryService: CountryService) {
    }

    ngOnInit() {
        this.client = {};
    }

    getClient() {
        this.clientService.getClient(this.clientId).subscribe(
            data => {
                this.client = data.client;
                //set the client industry
                this.client.industry_label = this.client.industry.name;
                //set the no of employees
                this.client.employees_label = this.workforces[this.client.workforce].value;
                //set the client state and country
                this.client.state_country_label = this.client.state + ', '
                    + this.countryService.getCountries()[this.client.country].name;
                //set the client product
                this.client.product_label = this.products.find(p => p.id == this.client.product).name;
                //set aggregate_report
                this.client.aggregate_report_label = this.aggregate_reports.find(ar => ar.id == this.client.aggregate_reports).name;
                //set organization level
                this.client.organization_label = this.levels[this.client.org_mgt].name;
                //set division level
                this.client.division_label = this.levels[this.client.div_mgt].name;
                //set department level
                this.client.department_label = this.levels[this.client.dept_mgt].name;
                //set email type
                const self = this;
                setTimeout(function () {
                    self.setEmailTemplate(self.client.email_template);
                    self.setReminderEmailStatus(self.client.email_template);
                }, 1000);

            }
        );
    }

    setEmailTemplate(template) {
        const element = <HTMLInputElement>document.getElementById(template);
        element.checked = true;
    }

    setReminderEmailStatus(status) {
        if (status) {
            // this means Reminder Email Send Is ON
            const element_on = <HTMLInputElement>document.getElementById('reminder-email-on');
            element_on.checked = true;
        } else {
            // this means Reminder Email Send is OFF
            const element_off = <HTMLInputElement>document.getElementById('reminder-email-off');
            element_off.checked = true;
        }
    }

    onChangeEmailTemplate(event) {
        // check if client.email_template and event.target.value both are same then no need to update data
        if (this.client.email_template !== event.target.value) {
            // update the client email_template
            this.updateEmailTemplate(event.target.value);
        }
        // update client template
    }

    onChangeReminderEmailStatus(event) {
        const reminder_email_status = JSON.parse(event.target.value);
        if (this.client.send_reminder_email !== reminder_email_status) {
            // update the reminder email status
            const client = {send_reminder_email: reminder_email_status};
            this.clientService.updateClient(client, this.clientId).subscribe(
                res => {
                    this.client.send_reminder_email = res.client.email_template;
                }
            );
        }
    }

    updateEmailTemplate(template) {
        const client = {email_template: template};
        this.clientService.updateClient(client, this.clientId).subscribe(
            res => {
                this.client.email_template = res.client.email_template;
            }
        );
    }

    ngOnChanges(changes: SimpleChanges) {
        if (typeof this.clientId !== 'undefined' && this.clientId !== null) {
            this.getClient();
        }
    }

}
