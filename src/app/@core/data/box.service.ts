import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {URLService} from "./url.service";
import {Observable} from "rxjs";

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class BoxService {

    constructor(private http: HttpClient, private urlService: URLService) {
    }

    // TODO: observables
    getBoxes(page, perPage): Observable<any> {
        return this.http.get(this.urlService.baseUrl + `/api/v1/boxes?page=${page}&perPage=${perPage}`);
    }

    getBox(id): Observable<any> {
        return this.http.get(this.urlService.baseUrl + '/api/v1/boxes/' + id);
    }

    createBox(box): Observable<any> {
        const body = JSON.stringify(box);
        return this.http.post(this.urlService.baseUrl + '/api/v1/boxes', body, httpOptions);
    }

    updateBox(box, id): Observable<any> {
        const body = JSON.stringify(box);
        return this.http.put(this.urlService.baseUrl + '/api/v1/boxes/' + id, body, httpOptions);
    }

    deleteBox(id): Observable<any> {
        return this.http.delete(this.urlService.baseUrl + '/api/v1/boxes/' + id);
    }
}
