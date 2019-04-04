import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SurveyService} from "../../../@core/data/survey.service";
import {ClientService} from "../../../@core/data/client.service";
import {ReportService} from "../../../@core/data/report.service";
import {URLService} from "../../../@core/data/url.service";

@Component({
    selector: 'ngx-data-reports',
    templateUrl: './data-reports.component.html',
    styleUrls: ['./data-reports.component.scss']
})
export class DataReportsComponent implements OnInit, OnChanges {

    surveys = [];
    filterData;
    @Input() clientId: string;
    clients = [];
    successMessage;

    constructor(private surveyService: SurveyService,
                private clientService: ClientService,
                private reportService: ReportService,
                private urlService: URLService) {
        this.filterData = {survey: '', start_date: null, end_date: null, clients: []};
    }

    ngOnInit() {
    }

    getClientSurvey(surveyId) {
        this.surveyService.getSurvey(surveyId).subscribe(
            res => {
                this.surveys.push(res.survey);
            }
        );
    }

    getClient() {
        this.clientService.getClient(this.clientId).subscribe(
            res => {
                this.clients.push(res.client);
                this.getClientSurvey(res.client.surveys[0]);
            }
        );
    }

    onClientChecked(client_id, event) {
        if (event.target.checked) {
            // now check if the client_id is inside the clients array
            this.filterData.clients.push(client_id);
        } else {
            // remove the client_id from the clients array
            this.filterData.clients = this.filterData.clients.filter(c => c != client_id);
        }
    }

    generateReport() {
        this.filterData.clients = this.clients;
        if (this.filterData.survey === '') {
            // this means no client is selected
            alert('Please select a survey to generate report data.');
        } else if (this.filterData.clients.length === 0) {
            // this means no survey selected
            alert('Please select client to generate report data.');
        } else {
            this.reportService.generateReportData(this.filterData).subscribe(
                res => {
                    console.log(res);
                    if (res.length > 0) {
                        this.successMessage = res.message;
                        this.download(res.filename);
                    } else {
                        this.successMessage = res.message;
                    }
                }
            );
        }
    }

    download(fileName) {
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = this.urlService.baseUrl + '/server/uploads/' + fileName;
        a.click();
        a.remove(); // remove the element
    }

    ngOnChanges(changes: SimpleChanges) {
        this.clientId = changes.clientId.currentValue;
        if (this.clientId) {
            this.getClient();
        }
    }


}
