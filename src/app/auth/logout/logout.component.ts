import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {NbTokenService} from '@nebular/auth';

@Component({
    selector: 'ngx-article-management',
    template: '<div>Logging out, please wait...</div>'
})

export class LogoutComponent implements OnInit {
    logoutResult;
    constructor(private router: Router,
                private authService: AuthService,
                private tokenService: NbTokenService) {
    }

    ngOnInit() {
        this.tokenService.get()
            .subscribe(token => {
                this.logout(token.getPayload())
            });
    }

    logout(payload) {
        this.authService.logout(payload)
            .subscribe(result => {
                this.logoutResult = result;
                if (this.logoutResult.success) {
                    localStorage.removeItem('auth_app_token');
                    this.router.navigateByUrl('/auth/login');
                }
            })
    }

}