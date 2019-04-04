import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CategoryManagementComponent} from './category-management/category-management.component';
import {LinkManagementComponent} from './link-management/link-management.component';
import {AddEditLinkComponent} from './link-management/add-edit-link/add-edit-link.component';
import {AddEditCategoryComponent} from './category-management/add-edit-category/add-edit-category.component';

const routes: Routes = [
    {
        path: 'category-management',
        component: CategoryManagementComponent,
    },
    {
        path: 'link-management',
        component: LinkManagementComponent,
    },
    {
        path: 'link-management/add',
        component: AddEditLinkComponent,
    },
    {
        path: 'link-management/edit/:id',
        component: AddEditLinkComponent,
    },
    {
        path: 'category-management/add',
        component: AddEditCategoryComponent,
    },
    {
        path: 'category-management/edit/:id',
        component: AddEditCategoryComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LinksRoutingModule {
}
