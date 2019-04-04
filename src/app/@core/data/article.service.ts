import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {URLService} from "./url.service";
import {Observable} from "rxjs";

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class ArticleService {

    constructor(private http: HttpClient, private urlService: URLService) {
    }

    // TODO: observables
    getArticles(page, perPage): Observable<any> {
        return this.http.get(this.urlService.baseUrl + `/api/v1/articles?page=${page}&perPage=${perPage}`);
    }

    getArticle(id): Observable<any> {
        return this.http.get(this.urlService.baseUrl + '/api/v1/articles/' + id);
    }

    createArticle(article, userId): Observable<any> {
        const body = JSON.stringify(article);
        return this.http.post(this.urlService.baseUrl + `/api/v1/articles/${userId}`, body, httpOptions);
    }

    updateArticle(article, id): Observable<any> {
        const body = JSON.stringify(article);
        return this.http.put(this.urlService.baseUrl + '/api/v1/articles/' + id, body, httpOptions);
    }

    deleteArticle(id): Observable<any> {
        return this.http.delete(this.urlService.baseUrl + '/api/v1/articles/' + id);
    }
}
