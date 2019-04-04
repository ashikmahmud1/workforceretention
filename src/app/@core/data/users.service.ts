import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {URLService} from "./url.service";

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class UserService {

    private users = {
        nick: {name: 'Nick Jones', picture: 'assets/images/nick.png'},
        eva: {name: 'Eva Moor', picture: 'assets/images/eva.png'},
        jack: {name: 'Jack Williams', picture: 'assets/images/jack.png'},
        lee: {name: 'Lee Wong', picture: 'assets/images/lee.png'},
        alan: {name: 'Alan Thompson', picture: 'assets/images/alan.png'},
        kate: {name: 'Kate Martinez', picture: 'assets/images/kate.png'},
    };

    constructor(private http: HttpClient, private urlService: URLService) {
        // this.userArray = Object.values(this.users);
    }

    getUsers(page, perPage): Observable<any> {
        return this.http.get(this.urlService.baseUrl + `/api/v1/users?page=${page}&perPage=${perPage}`);
    }

    createUser(user): Observable<any> {
        const body = JSON.stringify(user);
        return this.http.post(this.urlService.baseUrl + '/api/v1/users/', body, httpOptions);
    }

    updateUser(user, id): Observable<any> {
        const body = JSON.stringify(user);
        return this.http.put(this.urlService.baseUrl + '/api/v1/users/' + id, body, httpOptions);
    }
    deleteUser(id): Observable<any> {
        return this.http.delete(this.urlService.baseUrl + '/api/v1/users/' + id);
    }

    getUser(id) {
        return this.http.get(this.urlService.baseUrl + `/api/v1/users/${id}`);

    }

    getUserClients(userId): Observable<any> {
        return this.http.get(this.urlService.baseUrl + `/api/v1/users/clients/${userId}`);
    }
}
