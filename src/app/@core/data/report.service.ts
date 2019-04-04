import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {URLService} from "./url.service";
import {Observable} from "rxjs";

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class ReportService {

    constructor(private http: HttpClient, private urlService: URLService) {
    }

    getReportDetails(employeeId): Observable<any> {
        return this.http.get(this.urlService.baseUrl + `/api/v1/reports/manager/details/${employeeId}`);
    }

    getReport(employeeId, filterData): Observable<any> {
        const body = JSON.stringify(filterData);
        return this.http.post(this.urlService.baseUrl + `/api/v1/reports/manager/${employeeId}`, body, httpOptions);
    }

    generateReportData(filterData): Observable<any> {
        const body = JSON.stringify(filterData);
        return this.http.post(this.urlService.baseUrl + `/api/v1/reports/data-output/`, body, httpOptions);
    }

    getReports(page, perPage): Observable<any> {
        return this.http.get(this.urlService.baseUrl + `/api/v1/reports?page=${page}&perPage=${perPage}`);
    }

    getClientReport(id): Observable<any> {
        return this.http.get(this.urlService.baseUrl + '/api/v1/reports/' + id);
    }

    createReport(report): Observable<any> {
        // const body = JSON.stringify(client);
        return this.http.post(this.urlService.baseUrl + `/api/v1/reports/`, report);
    }

    updateReport(report, id): Observable<any> {
        // const body = JSON.stringify(client);
        return this.http.put(this.urlService.baseUrl + '/api/v1/reports/' + id, report);
    }

    deleteReport(id): Observable<any> {
        return this.http.delete(this.urlService.baseUrl + '/api/v1/reports/' + id);
    }
}
