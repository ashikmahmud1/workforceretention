/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {Component, OnDestroy, OnInit} from '@angular/core';
import {AnalyticsService} from './@core/utils/analytics.service';

import {NbAuthJWTToken, NbAuthService, NbTokenService} from '@nebular/auth';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';


@Component({
    selector: 'ngx-app',
    template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit, OnDestroy {
    user = {};
    private authSubscription: Subscription;

    constructor(private analytics: AnalyticsService,
                private authService: NbAuthService,
                private tokenService: NbTokenService,
                private router: Router) {
    }


    ngOnInit(): void {
        this.analytics.trackPageViews();

        // When Token will change below code will execute
        this.authSubscription = this.authService.onTokenChange()
            .subscribe((token: NbAuthJWTToken) => {
                if (token.isValid()) {
                    this.user = token.getPayload(); // here we receive a payload from the
                    // token and assigne it to our `employee` variable
                    // Navigate the employee to the product staticPage
                    // this.router.navigate(['pages']);

                }

            });
    }

    ngOnDestroy() {
        this.authSubscription.unsubscribe();
    }
}
