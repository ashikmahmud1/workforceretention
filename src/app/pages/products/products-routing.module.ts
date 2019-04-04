import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ProductManagementComponent} from './product-management/product-management.component';
import {StaticPagesComponent} from './static-pages/static-pages.component';
import {BoxManagementComponent} from './box-management/box-management.component';
import {AddEditBoxComponent} from './box-management/add-edit-box/add-edit-box.component';
import {AddEditProductComponent} from './product-management/add-edit-product/add-edit-product.component';
import {AssignBoxComponent} from './static-pages/assign-box/assign-box.component';

const routes: Routes = [
    {
        path: 'static-pages',
        component: StaticPagesComponent,
    },
    {
        path: 'box-management',
        component: BoxManagementComponent,
    },
    {
        path: 'product-management',
        component: ProductManagementComponent
    },
    {
        path: 'product-management/add',
        component: AddEditProductComponent,
    },
    {
        path: 'product-management/edit/:id',
        component: AddEditProductComponent,
    },
    {
        path: 'box-management/add',
        component: AddEditBoxComponent,
    },
    {
        path: 'box-management/edit/:id',
        component: AddEditBoxComponent
    },
    {
        path: 'static-pages/assign-box/:id',
        component: AssignBoxComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProductsRoutingModule {
}
