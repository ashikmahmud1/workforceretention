import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {URLService} from "./url.service";
import {Observable, Subject} from "rxjs";

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class EmployeeService {
    authChange = new Subject<boolean>();
    employee;
    surveyCompleted = false;

    isAuth() {
        return this.employee != null;
    }

    constructor(private http: HttpClient, private urlService: URLService) {
    }

    getEmployees(page, perPage, clientId, sort = {}): Observable<any> {
        const body = JSON.stringify(sort);
        return this.http.post(this.urlService.baseUrl +
            `/api/v1/clients/employees/${clientId}?page=${page}&perPage=${perPage}`, body, httpOptions);
    }

    getEmployee(id): Observable<any> {
        return this.http.get(this.urlService.baseUrl + '/api/v1/employees/' + id);
    }

    getEmployeeDetails(id): Observable<any> {
        return this.http.get(this.urlService.baseUrl + '/api/v1/employees/details/' + id);
    }

    createEmployee(employee, clientId): Observable<any> {
        const body = JSON.stringify(employee);
        return this.http.post(this.urlService.baseUrl + `/api/v1/employees/${clientId}`, body, httpOptions);
    }

    updateEmployee(employee, id): Observable<any> {
        const body = JSON.stringify(employee);
        return this.http.put(this.urlService.baseUrl + '/api/v1/employees/' + id, body, httpOptions);
    }

    loginEmployee(credential): Observable<any> {
        const body = JSON.stringify(credential);
        return this.http.post(this.urlService.baseUrl + '/api/v1/employees/login', body, httpOptions);
    }

    deleteEmployee(id): Observable<any> {
        return this.http.delete(this.urlService.baseUrl + '/api/v1/employees/' + id);
    }

    uploadEmployees(file, clientId): Observable<any> {
        const formData = new FormData();
        formData.append('employees', file);
        return this.http.post(this.urlService.baseUrl + `/api/v1/employees/upload/${clientId}`, formData);
    }

    getEmployeeSurveys(employeeId): Observable<any> {
        return this.http.get(this.urlService.baseUrl + `/api/v1/employees/surveys/${employeeId}`);
    }

    resendPassword(employeeId, clientId): Observable<any> {
        const body = JSON.stringify({employeeId});
        return this.http.post(this.urlService.baseUrl + `/api/v1/employees/generate-password/${clientId}`, body, httpOptions);
    }
}
