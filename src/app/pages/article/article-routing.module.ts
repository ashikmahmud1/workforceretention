import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ArticleManagementComponent} from './article-management/article-management.component';
import {AddEditArticleComponent} from './article-management/add-edit-article/add-edit-article.component';

const routes: Routes = [
    {
        path: 'article-management',
        component: ArticleManagementComponent,
    },
    {
        path: 'article-management/add',
        component: AddEditArticleComponent,
    },
    {
        path: 'article-management/edit/:id',
        component: AddEditArticleComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ArticleRoutingModule {
}
