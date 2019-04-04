import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ReportingRoutingModule} from './reporting-routing.module';
import {DataReportsComponent} from './data-reports/data-reports.component';
import {ReportFilesComponent} from './report-files/report-files.component';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {NbCardModule} from '@nebular/theme';
import {SmartTableService} from '../../@core/data/smart-table.service';
import {AddEditReportComponent} from './report-files/add-edit-report/add-edit-report.component';

import {ThemeModule} from '../../@theme/theme.module';
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {FormsModule} from "@angular/forms";

@NgModule({
    declarations: [DataReportsComponent, ReportFilesComponent, AddEditReportComponent],
    imports: [
        CommonModule,
        ReportingRoutingModule,
        Ng2SmartTableModule,
        NbCardModule,
        NgxDatatableModule,
        FormsModule,
        ThemeModule
    ],
    providers: [
        SmartTableService,
    ],
})
export class ReportingModule {
}
