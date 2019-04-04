import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {URLService} from "./url.service";
import {Observable} from "rxjs";

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class SurveyEmailService {

    constructor(private http: HttpClient, private urlService: URLService) {
    }

    // TODO: observables
    getSurveyEmails(page, perPage): Observable<any> {
        return this.http.get(this.urlService.baseUrl + `/api/v1/survey_emails?page=${page}&perPage=${perPage}`);
    }

    getSurveyEmail(id): Observable<any> {
        return this.http.get(this.urlService.baseUrl + '/api/v1/survey_emails/' + id);
    }

    createSurveyEmail(role): Observable<any> {
        const body = JSON.stringify(role);
        return this.http.post(this.urlService.baseUrl + '/api/v1/survey_emails', body, httpOptions);
    }

    updateSurveyEmail(role, id): Observable<any> {
        const body = JSON.stringify(role);
        return this.http.put(this.urlService.baseUrl + '/api/v1/survey_emails/' + id, body, httpOptions);
    }

    deleteSurveyEmail(id): Observable<any> {
        return this.http.delete(this.urlService.baseUrl + '/api/v1/survey_emails/' + id);
    }
}
