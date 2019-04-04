import {ExtraOptions, RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {
    NbAuthComponent,
    NbLoginComponent,
    NbRegisterComponent,
    NbRequestPasswordComponent,
    NbResetPasswordComponent,
} from '@nebular/auth';
import {AuthGuard} from './auth-guard.service';
import {LogoutComponent} from './auth/logout/logout.component';
import {LoginComponent} from './auth/login/login.component';

const routes: Routes = [
    {
        path: 'client',
        loadChildren: 'app/client/client.module#ClientModule'
    },
    {
        path: 'pages',
        canActivate: [AuthGuard], // here we tell Angular to check the access with our AuthGuard
        loadChildren: 'app/pages/pages.module#PagesModule'
    },
    {
        path: 'auth',
        component: NbAuthComponent,
        children: [
            {
                path: '',
                component: NbLoginComponent,
            },
            {
                path: 'login',
                component: LoginComponent,
            },
            {
                path: 'register',
                component: NbRegisterComponent,
            },
            {
                path: 'logout',
                component: LogoutComponent,
            },
            {
                path: 'request-password',
                component: NbRequestPasswordComponent,
            },
            {
                path: 'reset-password',
                component: NbResetPasswordComponent,
            }
        ],
    },
    {path: '', redirectTo: 'client', pathMatch: 'full'},
    {path: '**', redirectTo: 'client'},
];

const config: ExtraOptions = {
    useHash: true,
};

@NgModule({
    imports: [RouterModule.forRoot(routes, config)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
