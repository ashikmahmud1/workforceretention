import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ClientSelectionComponent} from './client-selection/client-selection.component';
import {AddEditClientComponent} from './client-selection/add-edit-client/add-edit-client.component';
import {EmployeesComponent} from "./employees/employees.component";
import {AddEditEmployeeComponent} from "./employees/add-edit-employee/add-edit-employee.component";
import {ClientTabsComponent} from "./client-selection/client-tabs/client-tabs.component";
import {IndustriesComponent} from "./industries/industries.component";
import {AddEditIndustryComponent} from "./industries/add-edit-industry/add-edit-industry.component";

const routes: Routes = [
    {
        path: 'client-selection',
        component: ClientSelectionComponent,
    },
    {
        path: 'client-selection/add',
        component: AddEditClientComponent,
    },
    {
        path: 'client-selection/edit/:id',
        component: AddEditClientComponent
    },
    {
        path: 'client-selection/details/:id',
        component: ClientTabsComponent
    },
    {
        path: 'client-selection/employees/:clientId',
        component: EmployeesComponent
    },
    {
        path: 'client-selection/employees/:id',
        component: AddEditEmployeeComponent
    },
    {
        path: 'client-selection/industries',
        component: IndustriesComponent
    },
    {
        path: 'client-selection/industries/add',
        component: AddEditIndustryComponent
    },
    {
        path: 'client-selection/industries/edit/:id',
        component: AddEditIndustryComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ClientsRoutingModule {
}
