import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {URLService} from "./url.service";
import {Observable} from "rxjs";

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class StaticPageService {

    constructor(private http: HttpClient, private urlService: URLService) {
    }

    // TODO: observables
    getStaticPages(page, perPage): Observable<any> {
        return this.http.get(this.urlService.baseUrl + `/api/v1/static_pages?page=${page}&perPage=${perPage}`);
    }

    getStaticPage(id): Observable<any> {
        return this.http.get(this.urlService.baseUrl + '/api/v1/static_pages/' + id);
    }

    updateStaticPage(static_page, id): Observable<any> {
        const body = JSON.stringify(static_page);
        return this.http.put(this.urlService.baseUrl + '/api/v1/static_pages/' + id, body, httpOptions);
    }
}
