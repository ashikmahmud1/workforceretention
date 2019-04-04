import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ArticleRoutingModule} from './article-routing.module';
import {ArticleManagementComponent} from './article-management/article-management.component';
import {NbCardModule} from '@nebular/theme';
import {SmartTableService} from '../../@core/data/smart-table.service';

import {ThemeModule} from '../../@theme/theme.module';
import {AddEditArticleComponent} from './article-management/add-edit-article/add-edit-article.component';
import {NgxDatatableModule} from "@swimlane/ngx-datatable";

@NgModule({
    declarations: [
        ArticleManagementComponent,
        AddEditArticleComponent,
    ],
    imports: [
        CommonModule,
        ArticleRoutingModule,
        NbCardModule,
        ThemeModule,
        NgxDatatableModule
    ],
    providers: [
        SmartTableService,
    ],
})
export class ArticleModule {
}
