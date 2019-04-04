import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {URLService} from "./url.service";
import {Observable} from "rxjs";

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class RoleService {

    constructor(private http: HttpClient, private urlService: URLService) {
    }

    // TODO: observables
    getRoles(page, perPage): Observable<any> {
        return this.http.get(this.urlService.baseUrl + `/api/v1/roles?page=${page}&perPage=${perPage}`);
    }

    getRole(id): Observable<any> {
        return this.http.get(this.urlService.baseUrl + '/api/v1/roles/' + id);
    }

    createRole(role): Observable<any> {
        const body = JSON.stringify(role);
        return this.http.post(this.urlService.baseUrl + '/api/v1/roles', body, httpOptions);
    }

    updateRole(role, id): Observable<any> {
        const body = JSON.stringify(role);
        return this.http.put(this.urlService.baseUrl + '/api/v1/roles/' + id, body, httpOptions);
    }

    deleteRole(id): Observable<any> {
        return this.http.delete(this.urlService.baseUrl + '/api/v1/roles/' + id);
    }
}
