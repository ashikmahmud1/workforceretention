import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {URLService} from "./url.service";
import {Observable} from "rxjs";

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class QuestionService {

    constructor(private http: HttpClient, private urlService: URLService) {
    }

    // TODO: observables
    getQuestions() {
        return this.http.get(this.urlService.baseUrl + '/api/v1/questions');
    }

    getQuestion(id) {
        return this.http.get(this.urlService.baseUrl + '/api/v1/questions/' + id);
    }

    createQuestion(question, surveyId) {
        const body = JSON.stringify(question);
        return this.http.post(this.urlService.baseUrl + '/api/v1/questions/' + surveyId, body, httpOptions);
    }

    createManyQuestion(question, surveyId): Observable<any> {
        const body = JSON.stringify(question);
        return this.http.post(this.urlService.baseUrl + '/api/v1/questions/add-many/' + surveyId, body, httpOptions);
    }

    updateManyQuestion(question, surveyId): Observable<any> {
        const body = JSON.stringify(question);
        return this.http.post(this.urlService.baseUrl + '/api/v1/questions/update-many/' + surveyId, body, httpOptions);
    }

    updateQuestion(survey, id) {
        const body = JSON.stringify(survey);
        return this.http.put(this.urlService.baseUrl + '/api/v1/survey/' + id, body, httpOptions);
    }

    deleteSurvey(id) {
        return this.http.delete(this.urlService.baseUrl + '/api/v1/survey' + id);
    }
}
