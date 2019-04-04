import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {URLService} from "./url.service";
import {Observable} from "rxjs";

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class LinkCategoryService {

    constructor(private http: HttpClient, private urlService: URLService) {
    }

    // TODO: observables
    getCategories(page, perPage): Observable<any> {
        return this.http.get(this.urlService.baseUrl + `/api/v1/categories?page=${page}&perPage=${perPage}`);
    }

    getCategory(id): Observable<any> {
        return this.http.get(this.urlService.baseUrl + '/api/v1/categories/' + id);
    }

    createCategory(category): Observable<any> {
        const body = JSON.stringify(category);
        return this.http.post(this.urlService.baseUrl + '/api/v1/categories', body, httpOptions);
    }

    updateCategory(category, id): Observable<any> {
        const body = JSON.stringify(category);
        return this.http.put(this.urlService.baseUrl + '/api/v1/categories/' + id, body, httpOptions);
    }

    deleteCategory(id): Observable<any> {
        return this.http.delete(this.urlService.baseUrl + '/api/v1/categories/' + id);
    }
}
