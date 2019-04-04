import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SurveysRoutingModule} from './surveys-routing.module';
import {SurveyManagementComponent} from './survey-management/survey-management.component';
import {EmailManagementComponent} from './email-management/email-management.component';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {NbCardModule, NbCheckboxModule} from '@nebular/theme';
import {SmartTableService} from '../../@core/data/smart-table.service';
import {EditEmailComponent} from './email-management/edit-email/edit-email.component';
import {AddEditSurveyComponent} from './survey-management/add-edit-survey/add-edit-survey.component';

import {ThemeModule} from '../../@theme/theme.module';
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {QuestionsComponent} from './survey-management/questions/questions.component';
import {AddEditQuestionComponent} from './survey-management/questions/add-edit-question/add-edit-question.component';
import {SurveyDetailsComponent} from './survey-management/survey-details/survey-details.component';

@NgModule({
    declarations: [
        SurveyManagementComponent,
        EmailManagementComponent,
        EditEmailComponent,
        AddEditSurveyComponent,
        QuestionsComponent,
        AddEditQuestionComponent,
        SurveyDetailsComponent],
    imports: [
        CommonModule,
        SurveysRoutingModule,
        Ng2SmartTableModule,
        NbCardModule,
        NgxDatatableModule,
        ThemeModule,
        NbCheckboxModule
    ],
    providers: [
        SmartTableService,
    ],
})
export class SurveysModule {
}
