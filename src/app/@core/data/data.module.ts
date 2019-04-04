import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserService} from './users.service';
import {ElectricityService} from './electricity.service';
import {StateService} from './state.service';
import {SmartTableService} from './smart-table.service';
import {PlayerService} from './player.service';
import {UserActivityService} from './user-activity.service';
import {OrdersChartService} from './orders-chart.service';
import {ProfitChartService} from './profit-chart.service';
import {TrafficListService} from './traffic-list.service';
import {PeriodsService} from './periods.service';
import {EarningService} from './earning.service';
import {OrdersProfitChartService} from './orders-profit-chart.service';
import {TrafficBarService} from './traffic-bar.service';
import {ProfitBarAnimationChartService} from './profit-bar-animation-chart.service';
import {LayoutService} from './layout.service';
import {AnswerService} from "./answer.service";
import {SurveyService} from "./survey.service";
import {QuestionService} from "./question.service";
import {RoleService} from "./role.service";
import {URLService} from "./url.service";
import {ClientService} from "./client.service";
import {CountryService} from "./country.service";
import {IndustryService} from "./industry.service";
import {EmployeeService} from "./employee.service";
import {LinkService} from "./link.service";
import {LinkCategoryService} from "./link-category.service";
import {TinyMceService} from "./tiny-mce.service";
import {ArticleService} from "./article.service";
import {BoxService} from "./box.service";
import {PageService} from "./page.service";
import {StaticPageService} from "./static-page.service";
import {OrganizationService} from "./organization.service";
import {EmailService} from "./email.service";
import {DepartmentService} from "./department.service";
import {DivisionService} from "./division.service";
import {SurveyEmailService} from "./survey-email.service";
import {ReportService} from "./report.service";

const SERVICES = [
    UserService,
    ElectricityService,
    StateService,
    SmartTableService,
    PlayerService,
    UserActivityService,
    OrdersChartService,
    ProfitChartService,
    TrafficListService,
    PeriodsService,
    EarningService,
    OrdersProfitChartService,
    TrafficBarService,
    ProfitBarAnimationChartService,
    LayoutService,

    //*** OUR OWN SERVICE *****
    SurveyService,
    QuestionService,
    AnswerService,
    RoleService,
    URLService,
    ClientService,
    CountryService,
    IndustryService,
    EmployeeService,
    LinkService,
    LinkCategoryService,
    TinyMceService,
    ArticleService,
    BoxService,
    PageService,
    StaticPageService,
    OrganizationService,
    EmailService,
    DepartmentService,
    DivisionService,
    SurveyEmailService,
    ReportService
];

@NgModule({
    imports: [
        CommonModule,
    ],
    providers: [
        ...SERVICES,
    ],
})
export class DataModule {
    static forRoot(): ModuleWithProviders {
        return <ModuleWithProviders>{
            ngModule: DataModule,
            providers: [
                ...SERVICES,
            ],
        };
    }
}
