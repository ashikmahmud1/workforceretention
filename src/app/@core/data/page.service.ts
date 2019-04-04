import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {URLService} from "./url.service";
import {Observable} from "rxjs";

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class PageService {

    constructor(private http: HttpClient, private urlService: URLService) {
    }

    // TODO: observables
    getPages(page, perPage): Observable<any> {
        return this.http.get(this.urlService.baseUrl + `/api/v1/pages?page=${page}&perPage=${perPage}`);
    }

    getPage(id): Observable<any> {
        return this.http.get(this.urlService.baseUrl + '/api/v1/pages/' + id);
    }

    createPage(box): Observable<any> {
        const body = JSON.stringify(box);
        return this.http.post(this.urlService.baseUrl + '/api/v1/pages', body, httpOptions);
    }

    updatePage(box, id): Observable<any> {
        const body = JSON.stringify(box);
        return this.http.put(this.urlService.baseUrl + '/api/v1/pages/' + id, body, httpOptions);
    }

    deletePage(id): Observable<any> {
        return this.http.delete(this.urlService.baseUrl + '/api/v1/pages/' + id);
    }
}
