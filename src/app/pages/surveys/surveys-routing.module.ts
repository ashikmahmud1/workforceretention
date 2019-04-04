import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SurveyManagementComponent} from './survey-management/survey-management.component';
import {EmailManagementComponent} from './email-management/email-management.component';
import {AddEditSurveyComponent} from './survey-management/add-edit-survey/add-edit-survey.component';
import {EditEmailComponent} from './email-management/edit-email/edit-email.component';
import {AddEditQuestionComponent} from "./survey-management/questions/add-edit-question/add-edit-question.component";
import {SurveyDetailsComponent} from "./survey-management/survey-details/survey-details.component";

const routes: Routes = [
    {
        path: 'survey-management',
        component: SurveyManagementComponent,
    },
    {
        path: 'survey-management/add',
        component: AddEditSurveyComponent,
    },
    {
        path: 'survey-management/edit/:id',
        component: AddEditSurveyComponent
    },
    {
        path: 'survey-management/details/:id',
        component: SurveyDetailsComponent
    },
    {
        path: 'email-management/edit/:id',
        component: EditEmailComponent,
    },
    {
        path: 'email-management',
        component: EmailManagementComponent,
    },
    {
        path: 'survey-management/question/add/:id',
        component: AddEditQuestionComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SurveysRoutingModule {
}
