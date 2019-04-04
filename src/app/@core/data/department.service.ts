import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {URLService} from "./url.service";
import {Observable} from "rxjs";

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class DepartmentService {

    constructor(private http: HttpClient, private urlService: URLService) {
    }

    getDepartment(id): Observable<any> {
        return this.http.get(this.urlService.baseUrl + '/api/v1/departments/' + id);
    }

    createDepartment(department, divisionId): Observable<any> {
        const body = JSON.stringify(department);
        return this.http.post(this.urlService.baseUrl + `/api/v1/departments/${divisionId}`, body, httpOptions);
    }

    updateDepartment(department, id): Observable<any> {
        const body = JSON.stringify(department);
        return this.http.put(this.urlService.baseUrl + '/api/v1/departments/' + id, body, httpOptions);
    }

    deleteDepartment(id): Observable<any> {
        return this.http.delete(this.urlService.baseUrl + '/api/v1/departments/' + id);
    }
}
