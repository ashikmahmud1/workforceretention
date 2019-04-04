import {Component, OnDestroy, OnInit} from '@angular/core';
import {NbThemeService, NbMediaBreakpoint, NbMediaBreakpointsService} from '@nebular/theme';

import {UserService} from '../../../@core/data/users.service';

@Component({
    selector: 'ngx-contacts',
    styleUrls: ['./contacts.component.scss'],
    templateUrl: './contacts.component.html',
})
export class ContactsComponent implements OnInit, OnDestroy {

    contacts: any[];
    recent: any[];
    breakpoint: NbMediaBreakpoint;
    breakpoints: any;
    themeSubscription: any;

    constructor(private userService: UserService,
                private themeService: NbThemeService,
                private breakpointService: NbMediaBreakpointsService) {
        this.contacts = [
            {user: {name: 'Ashik'}, type: 'mobile'}
        ];

        this.recent = [
            {user: {name: 'Ashik'}, type: 'mobile'}
        ];

        this.breakpoints = this.breakpointService.getBreakpointsMap();
        this.themeSubscription = this.themeService.onMediaQueryChange()
            .subscribe(([oldValue, newValue]) => {
                this.breakpoint = newValue;
            });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.themeSubscription.unsubscribe();
    }
}
