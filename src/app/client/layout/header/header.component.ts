import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {EmployeeService} from "../../../@core/data/employee.service";
import {JwtHelperService} from '@auth0/angular-jwt';


@Component({
    selector: 'ngx-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    isAuth: boolean = false;
    authSubscription: Subscription;

    constructor(private router: Router, private employeeService: EmployeeService) {
    }

    ngOnInit() {
        // here parse the employee
        // check the localStorage. if get the user id then set isAuth to true
        if (localStorage.getItem('employee')) {
            // parse the employee object and check the expiration of the login. if the login time is expired
            const employee = JSON.parse(localStorage.getItem('employee'));
            // then execute login function
            const helper = new JwtHelperService();
            // const decodedToken = helper.decodeToken(employee.access_token);
            // console.log(decodedToken);
            if (helper.isTokenExpired(employee.access_token)) {
                this.logout();
            } else {
                this.isAuth = true;
            }
        }
        this.authSubscription = this.employeeService.authChange.subscribe(authStatus => {
            this.isAuth = authStatus;
        });
    }

    logout() {
        // remove the employee from the localStorage
        localStorage.removeItem('employee');
        // employeeService authChange make this false
        this.employeeService.authChange.next(false);
        this.employeeService.employee = null;
        //redirect to login page
        this.router.navigateByUrl('/client/login');
    }

}
