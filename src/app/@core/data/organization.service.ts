import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {URLService} from "./url.service";
import {Observable} from "rxjs";

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class OrganizationService {

    constructor(private http: HttpClient, private urlService: URLService) {
    }


    getOrganization(id): Observable<any> {
        return this.http.get(this.urlService.baseUrl + '/api/v1/organizations/' + id);
    }

    getOrganizationDivisions(organizationId): Observable<any> {
        return this.http.get(this.urlService.baseUrl + `/api/v1/organizations/divisions/${organizationId}`);
    }

    createOrganization(organization, clientId): Observable<any> {
        const body = JSON.stringify(organization);
        return this.http.post(this.urlService.baseUrl + `/api/v1/organizations/${clientId}`, body, httpOptions);
    }

    updateOrganization(organization, id): Observable<any> {
        const body = JSON.stringify(organization);
        return this.http.put(this.urlService.baseUrl + '/api/v1/organizations/' + id, body, httpOptions);
    }

    deleteOrganization(id): Observable<any> {
        return this.http.delete(this.urlService.baseUrl + '/api/v1/organizations/' + id);
    }
}
