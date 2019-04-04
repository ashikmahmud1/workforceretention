import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {NbAuthService, NbTokenService} from '@nebular/auth';
import {tap} from 'rxjs/operators';
import {AuthService} from './auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    data: any;
    token;

    constructor(private authService: NbAuthService,
                private router: Router,
                private tokenService: NbTokenService,
                private localAuth: AuthService) {
    }

    canActivate() {
        return this.authService.isAuthenticated()
            .pipe(
                tap(authenticated => {

                    if (authenticated) {
                        // call the refresh token here
                        this.tokenService.get()
                            .subscribe(token => {
                                this.setToken(token.getPayload());
                            });

                        return authenticated;
                    } else {
                        this.router.navigate(['auth/login']);
                    }
                }),
            );
    }

    setToken(payload) {
        this.localAuth.refreshToken(payload)
            .subscribe(data => {
                    this.data = data;
                    this.token = this.data.token;

                    // console.log(this.token);
                    this.authService.refreshToken('email', this.token);
                    // this.authJwtToken.token = this.token
                    const token = JSON.parse(localStorage.getItem('auth_app_token'));
                    token.value = this.token;
                    const tokenString = JSON.stringify(token);
                    localStorage.setItem('auth_app_token', tokenString);
                    // this.tokenService.set(this.token)
                    // this.tokenService.set(this.token)
                    // this.tokenService.set(this.data.token);
                },
                err => {
                    if (err.status === 401) {
                        this.router.navigate(['auth/logout']);
                    }
                });
    }
}