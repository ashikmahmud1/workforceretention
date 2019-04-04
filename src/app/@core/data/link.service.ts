import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {URLService} from "./url.service";
import {Observable} from "rxjs";

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class LinkService {

    constructor(private http: HttpClient, private urlService: URLService) {
    }

    // TODO: observables
    getLinks(page, perPage): Observable<any> {
        return this.http.get(this.urlService.baseUrl + `/api/v1/links?page=${page}&perPage=${perPage}`);
    }

    getLink(id): Observable<any> {
        return this.http.get(this.urlService.baseUrl + '/api/v1/links/' + id);
    }

    createLink(link, userId): Observable<any> {
        const body = JSON.stringify(link);
        return this.http.post(this.urlService.baseUrl + `/api/v1/links/${userId}`, body, httpOptions);
    }

    updateLink(link, id): Observable<any> {
        const body = JSON.stringify(link);
        return this.http.put(this.urlService.baseUrl + '/api/v1/links/' + id, body, httpOptions);
    }

    deleteLink(id): Observable<any> {
        return this.http.delete(this.urlService.baseUrl + '/api/v1/links/' + id);
    }
}
