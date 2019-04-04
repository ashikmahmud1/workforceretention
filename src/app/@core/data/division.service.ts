import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {URLService} from "./url.service";
import {Observable} from "rxjs";

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class DivisionService {

    constructor(private http: HttpClient, private urlService: URLService) {
    }

    getDivision(id): Observable<any> {
        return this.http.get(this.urlService.baseUrl + '/api/v1/divisions/' + id);
    }

    getDivisionDepartments(divisionId): Observable<any> {
        return this.http.get(this.urlService.baseUrl + `/api/v1/divisions/departments/${divisionId}`);
    }

    createDivision(division, organizationId): Observable<any> {
        const body = JSON.stringify(division);
        return this.http.post(this.urlService.baseUrl + `/api/v1/divisions/${organizationId}`, body, httpOptions);
    }

    updateDivision(division, id): Observable<any> {
        const body = JSON.stringify(division);
        return this.http.put(this.urlService.baseUrl + '/api/v1/divisions/' + id, body, httpOptions);
    }

    deleteDivision(id): Observable<any> {
        return this.http.delete(this.urlService.baseUrl + '/api/v1/divisions/' + id);
    }
}
