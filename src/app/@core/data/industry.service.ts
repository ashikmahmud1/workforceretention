import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {URLService} from "./url.service";
import {Observable} from "rxjs";

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class IndustryService {

    constructor(private http: HttpClient, private urlService: URLService) {
    }

    // TODO: observables
    getIndustries(page, perPage): Observable<any> {
        return this.http.get(this.urlService.baseUrl + `/api/v1/industries?page=${page}&perPage=${perPage}`);
    }

    getIndustry(id): Observable<any> {
        return this.http.get(this.urlService.baseUrl + '/api/v1/industries/' + id);
    }

    createIndustry(industry): Observable<any> {
        const body = JSON.stringify(industry);
        return this.http.post(this.urlService.baseUrl + '/api/v1/industries', body, httpOptions);
    }

    updateIndustry(industry, id): Observable<any> {
        const body = JSON.stringify(industry);
        return this.http.put(this.urlService.baseUrl + '/api/v1/industries/' + id, body, httpOptions);
    }

    deleteIndustry(id): Observable<any> {
        return this.http.delete(this.urlService.baseUrl + '/api/v1/industries/' + id);
    }
}
