import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {PagesComponent} from './pages.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {NotFoundComponent} from './miscellaneous/not-found/not-found.component';

const routes: Routes = [{
    path: '',
    component: PagesComponent,
    children: [ {
        path: 'dashboard',
        component: DashboardComponent,
    }, {
        path: 'products',
        loadChildren: './products/products.module#ProductsModule',
    }, {
        path: 'articles',
        loadChildren: './article/article.module#ArticleModule',
    }, {
        path: 'clients',
        loadChildren: './clients/clients.module#ClientsModule',
    }, {
        path: 'surveys',
        loadChildren: './surveys/surveys.module#SurveysModule',
    }, {
        path: 'reporting',
        loadChildren: './reporting/reporting.module#ReportingModule',
    }, {
        path: 'links',
        loadChildren: './links/links.module#LinksModule',
    }, {
        path: 'office-admin',
        loadChildren: './office-admin/office-admin.module#OfficeAdminModule',
    }, {
        path: 'modal-overlays',
        loadChildren: './modal-overlays/modal-overlays.module#ModalOverlaysModule',
    }, {
        path: 'bootstrap',
        loadChildren: './bootstrap/bootstrap.module#BootstrapModule',
    }, {
        path: 'maps',
        loadChildren: './maps/maps.module#MapsModule',
    }, {
        path: 'charts',
        loadChildren: './charts/charts.module#ChartsModule',
    }, {
        path: 'editors',
        loadChildren: './editors/editors.module#EditorsModule',
    }, {
        path: 'miscellaneous',
        loadChildren: './miscellaneous/miscellaneous.module#MiscellaneousModule',
    }, {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    }, {
        path: '**',
        component: NotFoundComponent,
    }],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PagesRoutingModule {
}
