import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {URLService} from "./url.service";
import {Observable} from "rxjs";

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class EmailService {

    constructor(private http: HttpClient, private urlService: URLService) {
    }

    // TODO: observables
    getEmails(page, perPage): Observable<any> {
        return this.http.get(this.urlService.baseUrl + `/api/v1/emails?page=${page}&perPage=${perPage}`);
    }

    getEmail(id): Observable<any> {
        return this.http.get(this.urlService.baseUrl + '/api/v1/emails/' + id);
    }

    createEmail(email, clientId): Observable<any> {
        const body = JSON.stringify(email);
        return this.http.post(this.urlService.baseUrl + `/api/v1/emails/${clientId}`, body, httpOptions);
    }

    updateEmail(email, id): Observable<any> {
        const body = JSON.stringify(email);
        return this.http.put(this.urlService.baseUrl + '/api/v1/emails/' + id, body, httpOptions);
    }

    deleteEmail(id): Observable<any> {
        return this.http.delete(this.urlService.baseUrl + '/api/v1/emails/' + id);
    }
}
