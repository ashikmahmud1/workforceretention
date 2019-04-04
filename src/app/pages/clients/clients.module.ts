import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ClientsRoutingModule} from './clients-routing.module';
import {ClientSelectionComponent} from './client-selection/client-selection.component';
import {NbActionsModule, NbCardModule, NbTabsetModule} from '@nebular/theme';
import {SmartTableService} from '../../@core/data/smart-table.service';
import {AddEditClientComponent} from './client-selection/add-edit-client/add-edit-client.component';

import {ThemeModule} from '../../@theme/theme.module';
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {EmployeesComponent} from './employees/employees.component';
import {OrganizationsComponent} from './organizations/organizations.component';
import {AddEditEmployeeComponent} from './employees/add-edit-employee/add-edit-employee.component';
import {AddEditOrganizationComponent} from './organizations/add-edit-organization/add-edit-organization.component';
import {AddEditDivisionComponent} from './organizations/divisions/add-edit-division/add-edit-division.component';
import {AddEditDepartmentComponent} from './organizations/departments/add-edit-department/add-edit-department.component';
import {ClientDetailsComponent} from './client-selection/client-details/client-details.component';
import {ClientTabsComponent} from './client-selection/client-tabs/client-tabs.component';
import {IndustriesComponent} from './industries/industries.component';
import {AddEditIndustryComponent} from './industries/add-edit-industry/add-edit-industry.component';
import {EmailsComponent} from './emails/emails.component';
import {AddEditEmailComponent} from './emails/add-edit-email/add-edit-email.component';
import {DivisionsComponent} from './organizations/divisions/divisions.component';
import {DepartmentsComponent} from './organizations/departments/departments.component';
import { SurveysComponent } from './surveys/surveys.component';
import { EmployeeDetailsComponent } from './employees/employee-details/employee-details.component';
import { EmployeeSurveyComponent } from './employees/employee-survey/employee-survey.component';
import { DataReportsComponent } from './data-reports/data-reports.component';

@NgModule({
    declarations: [ClientSelectionComponent, AddEditClientComponent,
        EmployeesComponent, OrganizationsComponent,
        AddEditEmployeeComponent, AddEditOrganizationComponent,
        AddEditDivisionComponent, AddEditDepartmentComponent,
        ClientDetailsComponent,
        ClientTabsComponent,
        IndustriesComponent,
        AddEditIndustryComponent,
        EmailsComponent,
        AddEditEmailComponent,
        DivisionsComponent,
        DepartmentsComponent,
        SurveysComponent,
        EmployeeDetailsComponent,
        EmployeeSurveyComponent,
        DataReportsComponent],
    imports: [
        CommonModule,
        ClientsRoutingModule,
        NbCardModule,
        ThemeModule,
        NgxDatatableModule,
        FormsModule,
        ReactiveFormsModule,
        NbActionsModule,
        NbTabsetModule
    ],
    providers: [
        SmartTableService,
    ],
})
export class ClientsModule {
}
