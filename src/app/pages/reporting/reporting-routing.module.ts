import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DataReportsComponent} from './data-reports/data-reports.component';
import {ReportFilesComponent} from './report-files/report-files.component';
import {AddEditReportComponent} from './report-files/add-edit-report/add-edit-report.component';

const routes: Routes = [{
    path: 'data-reports',
    component: DataReportsComponent,
}, {
    path: 'report-files',
    component: ReportFilesComponent,
},
    {
        path: 'report-files/add',
        component: AddEditReportComponent,
    },
    {
        path: 'report-files/edit/:id',
        component: AddEditReportComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ReportingRoutingModule {
}
