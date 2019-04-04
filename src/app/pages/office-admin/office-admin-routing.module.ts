import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UserManagementComponent} from './user-management/user-management.component';
import {PermissionManagementComponent} from './permission-management/permission-management.component';
import {AddEditUserComponent} from "./user-management/add-edit-user/add-edit-user.component";
import {AddEditPermissionComponent} from "./permission-management/add-edit-permission/add-edit-permission.component";
import {EmailManagementComponent} from "./email-management/email-management.component";
import {AddEditEmailComponent} from "./email-management/add-edit-email/add-edit-email.component";

const routes: Routes = [
    {
        path: 'employee-management',
        component: UserManagementComponent,
    },
    {
        path: 'employee-management/add',
        component: AddEditUserComponent
    },
    {path: 'employee-management/edit/:id', component: AddEditUserComponent},
    {
        path: 'permission-management',
        component: PermissionManagementComponent,
    },
    {
        path: 'permission-management/add',
        component: AddEditPermissionComponent
    },
    {
        path: 'permission-management/edit/:id',
        component: AddEditPermissionComponent
    },
    {
        path: 'email-management',
        component: EmailManagementComponent
    },
    {
        path: 'email-management/edit/:id',
        component: AddEditEmailComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class OfficeAdminRoutingModule {
}
