import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {URLService} from "./url.service";
import {Observable} from "rxjs";

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class SurveyService {

    constructor(private http: HttpClient, private urlService: URLService) {
    }

    // TODO: observables
    getSurveys(page, limit): Observable<any> {
        return this.http.get(this.urlService.baseUrl + `/api/v1/surveys?page=${page}&perPage=${limit}`);
    }

    getSurvey(id): Observable<any> {
        return this.http.get(this.urlService.baseUrl + '/api/v1/surveys/' + id);
    }

    getSurveyQuestions(surveyId): Observable<any> {
        return this.http.get(this.urlService.baseUrl + '/api/v1/surveys/questions/' + surveyId);
    }

    getSurveyWithQuestionsAnswers(surveyId, employeeId): Observable<any> {
        return this.http.get(this.urlService.baseUrl + `/api/v1/surveys/survey-question-answer/${surveyId}?employeeId=${employeeId}`);
    }

    downloadCompletedSurvey(url): Observable<any> {
        const body = JSON.stringify(url);
        return this.http.post(this.urlService.baseUrl + `/api/v1/surveys/download-completed-survey`, body, httpOptions);
    }

    cloneSurvey(surveyId, userId) {
        return this.http.get(this.urlService.baseUrl + `/api/v1/surveys/clone/${surveyId}?userId=${userId}`);
    }

    createSurvey(survey, userId): Observable<any> {
        const body = JSON.stringify(survey);
        return this.http.post(this.urlService.baseUrl + `/api/v1/surveys/${userId}`, body, httpOptions);
    }

    updateSurvey(survey, id): Observable<any> {
        const body = JSON.stringify(survey);
        return this.http.put(this.urlService.baseUrl + '/api/v1/surveys/' + id, body, httpOptions);
    }

    deleteSurvey(id): Observable<any> {
        return this.http.delete(this.urlService.baseUrl + '/api/v1/surveys/' + id);
    }
}
