import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {URLService} from "../@core/data/url.service";

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class AuthService {

    constructor(private http: HttpClient, private urlService: URLService) {
    }

    refreshToken(payload) {
        const body = JSON.stringify({refreshToken: payload.refreshToken, email: payload.email});
        return this.http.post(this.urlService.baseUrl + '/api/v1/auth/token', body, httpOptions);
    }

    logout(payload) {
        const body = JSON.stringify({refreshToken: payload.refreshToken});
        return this.http.post(this.urlService.baseUrl + '/api/v1/auth/logout', body, httpOptions);
    }
}