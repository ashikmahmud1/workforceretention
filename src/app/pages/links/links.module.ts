import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LinksRoutingModule} from './links-routing.module';
import {LinkManagementComponent} from './link-management/link-management.component';
import {CategoryManagementComponent} from './category-management/category-management.component';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {NbCardModule} from '@nebular/theme';
import {SmartTableService} from '../../@core/data/smart-table.service';
import {AddEditLinkComponent} from './link-management/add-edit-link/add-edit-link.component';
import {AddEditCategoryComponent} from './category-management/add-edit-category/add-edit-category.component';

import {ThemeModule} from '../../@theme/theme.module';
import {FormsModule} from "@angular/forms";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";

@NgModule({
    declarations: [LinkManagementComponent,
        CategoryManagementComponent, AddEditLinkComponent,
        AddEditCategoryComponent],
    imports: [
        FormsModule,
        CommonModule,
        LinksRoutingModule,
        Ng2SmartTableModule,
        NbCardModule,
        ThemeModule,
        NgxDatatableModule
    ],
    providers: [
        SmartTableService,
    ],
})
export class LinksModule {
}
