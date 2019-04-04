import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {URLService} from "./url.service";
import {Observable} from "rxjs";

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class ClientService {

    constructor(private http: HttpClient, private urlService: URLService) {
    }

    // TODO: observables
    getClients(page, perPage): Observable<any> {
        return this.http.get(this.urlService.baseUrl + `/api/v1/clients?page=${page}&perPage=${perPage}`);
    }

    getClient(id): Observable<any> {
        return this.http.get(this.urlService.baseUrl + '/api/v1/clients/' + id);
    }

    getClientOrganizations(clientId): Observable<any> {
        return this.http.get(this.urlService.baseUrl + `/api/v1/clients/organizations/${clientId}`);
    }

    getClientEmails(clientId): Observable<any> {
        return this.http.get(this.urlService.baseUrl + `/api/v1/clients/emails/${clientId}`);
    }

    getClientEmail(clientId, emailId): Observable<any> {
        return this.http.get(this.urlService.baseUrl + `/api/v1/clients/email_by_id/${clientId}?emailId=${emailId}`);
    }

    updateEmail(clientId, emailId, email): Observable<any> {
        const body = JSON.stringify(email);
        return this.http.post(this.urlService.baseUrl + `/api/v1/clients/emails/update/${clientId}?emailId=${emailId}`, body, httpOptions);
    }

    createClient(client, userId): Observable<any> {
        // const body = JSON.stringify(client);
        return this.http.post(this.urlService.baseUrl + `/api/v1/clients/${userId}`, client);
    }

    updateClient(client, id): Observable<any> {
        // const body = JSON.stringify(client);
        return this.http.put(this.urlService.baseUrl + '/api/v1/clients/' + id, client);
    }

    deleteClient(id): Observable<any> {
        return this.http.delete(this.urlService.baseUrl + '/api/v1/clients/' + id);
    }

    assignSurvey(clientId, surveyId): Observable<any> {
        return this.http.get(this.urlService.baseUrl + `/api/v1/clients/assignSurvey?clientId=${clientId}&surveyId=${surveyId}`);
    }

    unAssignSurvey(clientId, surveyId): Observable<any> {
        return this.http.get(this.urlService.baseUrl + `/api/v1/clients/unAssignSurvey?clientId=${clientId}&surveyId=${surveyId}`);
    }
}
