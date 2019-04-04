import {Component, OnInit} from '@angular/core';
import {ReportService} from "../../@core/data/report.service";
import {JwtHelperService} from "@auth0/angular-jwt";

@Component({
    selector: 'ngx-manager-report',
    templateUrl: './manager-report.component.html',
    styleUrls: ['./manager-report.component.scss']
})
export class ManagerReportComponent implements OnInit {

    filterData = {start_date: null, end_date: null, level: "", occupational_group: "", gender: "", tenure: ""};
    genders = [{id: "Male", value: "Male"}, {id: "Female", value: "Female"}];
    employee;
    employee_details;
    completed_surveys = 0;
    organizations;
    organizations_divisions_departments = [];
    top_leaving_reasons = [];
    response_array = [];
    leaving_reason_rearranged_array = [];
    manager;
    exit_reasons = [
        {id: 1, value: 'Career Opportunities'},
        {id: 2, value: 'Meaningful Work'},
        {id: 3, value: 'Communication'},
        {id: 4, value: 'Effective Leadership'},
        {id: 5, value: 'Induction'},
        {id: 6, value: 'Learning & Development'},
        {id: 7, value: 'Manager'},
        {id: 8, value: 'Pay & Benefits'},
        {id: 9, value: 'Work Conditions'},
        {id: 10, value: 'Being Valued'},
        {id: 11, value: 'Operational'},
        {id: 12, value: 'Restructure'},
    ];
    tenures = [
        {id: 1, value: "< 1 year"},
        {id: 2, value: "1 - 2 years"},
        {id: 3, value: "3 - 5 years"},
        {id: 4, value: "6 - 10 years"},
        {id: 5, value: "> 10 years"},
    ];
    occupations = [
        {id: 1, value: 'Not Classified'},
        {id: 2, value: 'Managers'},
        {id: 3, value: 'Professionals'},
        {id: 4, value: 'Technicians and Trade Workers'},
        {id: 5, value: 'Community and Personal Service Workers'},
        {id: 6, value: 'Clerical and Administrative Workers'},
        {id: 7, value: 'Sales Workers'},
        {id: 8, value: 'Machinery Operators and Drivers'},
        {id: 9, value: 'Labourers'},
    ];

    single = [];
    // view = [700, 400];
    // options
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = true;
    schemaType = 'ordinal';
    showDataLabel = false;
    showXAxisLabel = true;
    xAxisLabel = '';
    showYAxisLabel = true;
    yAxisLabel = 'Percentage Distribution ( % )';

    // colorScheme = {
    //     domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    // };
    colorScheme = 'night';

    onSelect(event) {
        console.log(event);
    }

    top_reason_for_leaving_chart_data = [];
    career_opportunities_chart_data = [];
    meaningful_work_chart_data = [];
    communication_chart_data = [];
    effective_leadership_chart_data = [];
    induction_chart_data = [];
    learning_development_chart_data = [];
    manager_chart_data = [];
    pay_benefits_chart_data = [];
    work_conditions_chart_data = [];
    being_valued_chart_data = [];
    operational_chart_data = [];
    restructure_chart_data = [];

    gender_split_chart_data = [];
    tenure_split_chart_data = [];
    age_split_chart_data = [];

    employee_sentiment = [];
    employee_sentiment_working_chart_data = [];
    employee_sentiment_not_working_chart_data = [];

    // here we need to declare a dictionary
    // where key will be the exit reason and value will be the array
    // for example exit_reason === '1' so value will be top_reason_for_leaving_chart_data
    exit_reason_data_mapper = [
        {exit_reason: '1', value: this.career_opportunities_chart_data},
        {exit_reason: '2', value: this.meaningful_work_chart_data},
        {exit_reason: '3', value: this.communication_chart_data},
        {exit_reason: '4', value: this.effective_leadership_chart_data},
        {exit_reason: '5', value: this.induction_chart_data},
        {exit_reason: '6', value: this.learning_development_chart_data},
        {exit_reason: '7', value: this.manager_chart_data},
        {exit_reason: '8', value: this.pay_benefits_chart_data},
        {exit_reason: '9', value: this.work_conditions_chart_data},
        {exit_reason: '10', value: this.being_valued_chart_data},
        {exit_reason: '14', value: this.operational_chart_data},
        {exit_reason: '15', value: this.restructure_chart_data}
    ];

    constructor(private reportService: ReportService) {
        this.manager = {};
    }

    ngOnInit() {
        // check the localStorage. if get the user id then set isAuth to true
        if (localStorage.getItem('employee')) {
            // parse the employee object and check the expiration of the login. if the login time is expired
            this.employee = JSON.parse(localStorage.getItem('employee'));
            const helper = new JwtHelperService();
            this.employee_details = helper.decodeToken(this.employee.access_token);
        }
        this.getManagerReport();
    }

    getManagerDetails() {
        this.reportService.getReportDetails(this.employee.employee_id).subscribe(
            res => {
                this.organizations = res.organizations;
                this.arrangeOrganization();
            }
        );
    }

    getManagerReport() {
        this.reportService.getReport(this.employee.employee_id, this.filterData).subscribe(
            res => {
                this.manager = res.manager;
                this.getManagerDetails();
                this.showChartReport(res);
            }
        );
    }

    arrangeOrganization() {
        // check the logged in employee is set to full reporting is yes or not
        if (this.manager.is_report === '0') {
            this.organizations = this.organizations.filter(o => o._id === this.manager.organization._id);
        }
        this.organizations_divisions_departments = [];
        if (!this.NotNullOrEmpty(this.organizations)) {
            this.organizations.map((org) => {
                const organization = {
                    id: org._id,
                    class: 'organization',
                    name: org.name
                };
                this.organizations_divisions_departments.push(organization);
                if (!this.NotNullOrEmpty(org.divisions)) {
                    org.divisions.map((division) => {
                        const newDivision = {
                            id: org._id + '_' + division._id,
                            name: '\u00A0 --' + division.name,
                            class: 'division'
                        };
                        this.organizations_divisions_departments.push(newDivision);
                        if (!this.NotNullOrEmpty(division.departments)) {
                            division.departments.map((department) => {
                                const newDepartment = {
                                    id: org._id + '_' + division._id + '_' + department._id,
                                    class: 'department',
                                    name: '\u00A0 \u00A0 ---' + department.name
                                };
                                this.organizations_divisions_departments.push(newDepartment);
                            });
                        }
                    });
                }
            });
        }
    }

    NotNullOrEmpty(obj) {
        return typeof obj === 'undefined' || obj == null;
    }

    viewReport() {
        this.getManagerReport();
    }

    // *************** RULES ***************
    // first find the top 3 reasons for leaving the exit interview
    // calculation
    // Reason                1st choice     2nd choice   total points     percentage
    // Career Opportunities    10               2            12
    // Pay & Benefits          8                2            10
    // Work Conditions         4                5            9
    // Operational             2                2            4
    // Learning & Development  2                2            4
    // Manager                 2                1            3
    // Meaningful Work         2                0            2
    // Effective Leadership    0                1            1

    // Percentage Calculation
    // total points = 45
    // Career Opportunities Percentage = (12 /45) * 100 = 26.66 %

    // for all Question under Career Opportunities for each question there will be a bar in the chart
    // For example there are 4 questions in the Career Opportunities Category So there will be 4 bar in the chart
    // Now calculate how many people Agree, Neutral and Disagree (Need to calculate percentage as well)
    // Agree and Strongly Agree --------------------- 11
    // Disagree and Strongly Disagree --------------- 4
    // Neutral -------------------------------------- 0

    // Percentage of Agree and Strongly Agree ------ (11 / 15) * 100 = 73.33 %
    // Percentage of Disagree and Strongly Disagree -(4/15) * 100 = 26.66 %
    // Percentage of Neutral ------------------------(0/15) * 100 = 0 %


    // response will be something like this
    // top_reasons (Array of objects) {label: Career Opportunities, percentage: 26.66 }
    // answers (Array of objects) {question_id : 1, category_label: Career Opportunities, answers : [{label:Agree and Strongly Agree, percentage: 73.33}]}

    // re-arrange the answers by the category label (highest leaving reason)

//     [
//         {
//             "name": "Germany",
//             "series": [
//                 {
//                     "name": "2010",
//                     "value": 40632
//                 },
//                 {
//                     "name": "2000",
//                     "value": 36953
//                 },
//                 {
//                     "name": "1990",
//                     "value": 31476
//                 }
//             ]
//         },
// {
//     "name": "United Kingdom",
//     "series": [
//     {
//         "name": "2010",
//         "value": 36240
//     },
//     {
//         "name": "2000",
//         "value": 32543
//     },
//     {
//         "name": "1990",
//         "value": 26424
//     }
// ]
// }
// ]

    showChartReport(data) {
        this.completed_surveys = data.completed;
        this.top_reason_for_leaving_chart_data = [];
        // first get the final question
        // find the top 3 reasons for leaving the exit interview from the final question

        //***************Gender Calculation***************
        this.gender_split_chart_data = data.genders;
        // from gender data calculate percentage
        let total = 0;
        this.gender_split_chart_data.map((g) => {
            total += g.value;
        });
        if (total !== 0) {
            this.gender_split_chart_data.map((g) => {
                g.value = (g.value / total) * 100;
            });
        } else {
            this.gender_split_chart_data = [];
        }
        //****************Age Calculation******************
        //from ages data calculate percentage
        this.age_split_chart_data = data.ages;
        total = 0;
        this.age_split_chart_data.map((a) => {
            total += a.value;
        });
        if (total !== 0) {
            this.age_split_chart_data.map((a) => {
                a.value = (a.value / total) * 100;
            });
        } else {
            this.age_split_chart_data = [];
        }

        //*****************Tenure Calculation****************
        this.tenure_split_chart_data = data.tenures;
        total = 0;
        this.tenure_split_chart_data.map((t) => {
            total += t.value;
        });
        if (total !== 0) {
            this.tenure_split_chart_data.map((t) => {
                t.value = (t.value / total) * 100;
            });
        } else {
            this.tenure_split_chart_data = [];
        }

        this.response_array = data.response_array;
        const final_question = data.response_array.find(ex => ex.exit_reason === '13');
        // Percentage Calculation
        // total points = 45
        // Career Opportunities Percentage = (12 /45) * 100 = 26.66 %
        let total_points = 0;
        final_question.options.map((option) => {
            total_points += option.answered;
        });
        // now calculate the percentage for each option
        final_question.options.map((option) => {
            option.percentage = ((option.answered / total_points) * 100).toFixed(2);
            // Percentage upto 2 decimal place
        });
        // now we need to re-arrange options by percentage in the descending order
        final_question.options.sort((a, b) => (a.percentage < b.percentage) ? 1 : -1);
        this.leaving_reason_rearranged_array = final_question.options;
        // now we can take the first three items and insert it into the top_leaving_reasons array
        this.top_leaving_reasons = [];
        if (final_question.options.length > 3) {
            // this means there are more than 3 items so we can take the first 3 items
            this.top_leaving_reasons.push(final_question.options[0], final_question.options[1], final_question.options[2]);
        }
        final_question.options.map((option) => {
            const result = {name: this.exit_reasons[option.label_index].value, value: option.percentage};
            this.top_reason_for_leaving_chart_data.push(result);
        });

        // foreach answer in the response_array find out the percentage
        this.response_array.map((answer) => {
            if (answer.exit_reason !== '13') {
                // we already find out the percentage for final question. so we don't need to do this again
                total_points = 0;
                answer.options.map((option) => {
                    total_points += option.answered;
                });
                // now calculate the percentage for each option
                answer.options.map((option) => {
                    option.percentage = (option.answered / total_points) * 100;
                });
            }
        });

        // Now loop through the final question options and find out exit reason by the label_index
        // after finding the exit reason find out all the answers by the exit reason
        // for example exit reason is 3 (communication). so find out all the answers which exit_reason is 3
        // finally rearrange the data like as the above structure


        // make empty the exit_reason_data_mapper array. so that later time when we click on view report button don't duplicate data
        this.exit_reason_data_mapper.map((mapped_reason) => {
            mapped_reason.value = [];
        });
        const positive_values = ['Strongly Agree', 'Agree'];
        const negative_values = ['Disagree', 'Strongly Disagree'];
        final_question.options.map((option) => {
            const mapped_reason = this.exit_reason_data_mapper[option.label_index];
            const filtered_reason = this.response_array.filter(x => x.exit_reason === mapped_reason.exit_reason);
            filtered_reason.map((reason) => {
                // name
                // series
                const series = [];
                // calculate the total percentage. if total percentage is zero that means nobody answered this question
                // so we don't need to push the object into the array
                let calculated_total_percentage = 0;
                reason.options.map((r) => {
                    calculated_total_percentage += r.percentage;
                });
                // calculate the positive percentage, negative percentage, neutrals
                let positive = 0;
                let negative = 0;
                let neutral = 0;
                let total_answered = 0;
                reason.options.map((r, index) => {
                    if (reason.question_type === '3') {
                        if (JSON.parse(r.label)) { // this will make string "true" to boolean true
                            series.push({name: this.exit_reasons[index].value, value: r.percentage});
                        }
                    } else if (reason.question_type === '1') {
                        total_answered += r.answered;
                        if (positive_values.findIndex(item => r.label.toLowerCase() === item.toLowerCase()) > -1) {
                            positive += r.answered;
                        } else if (negative_values.findIndex(item => r.label.toLowerCase() === item.toLowerCase()) > -1) {
                            negative += r.answered;
                        } else {
                            neutral += r.answered;
                        }
                    } else {
                        series.push({name: r.label, value: r.percentage});
                    }
                });
                const positive_percentage = (positive / total_answered) * 100;
                const negative_percentage = (negative / total_answered) * 100;
                const neutral_percentage = (neutral / total_answered) * 100;
                if (reason.question_type === '1') {
                    series.push({name: 'Agreed', value: positive_percentage});
                    series.push({name: 'Disagreed', value: negative_percentage});
                    series.push({name: 'Neutral', value: neutral_percentage});
                }
                if (calculated_total_percentage !== 0 && !isNaN(calculated_total_percentage)) {
                    const rearrange_answer = {name: reason.exit_reporting_label, series: series};
                    mapped_reason.value.push(rearrange_answer);
                }
            });
        });
        this.single = this.top_reason_for_leaving_chart_data;
        this.single = this.single.filter(x => parseFloat(x.value) != 0);
        // console.log(this.exit_reason_data_mapper);
        // Solution for reducing the bar width but it's not working

        // get all the rating radio button questions
        // now sort by agree/strongly agree in the descending order
        // now divide the length of the array by 2
        // now take first half for what's working
        // and second half for what's not working
        // What's working
        // What's not working
        this.employee_sentiment = [];
        this.employee_sentiment_working_chart_data = [];
        this.employee_sentiment_not_working_chart_data = [];
        const rating_radio_button_questions = data.response_array.filter(q => q.question_type == 1);
        // now we need to find the positive_percentage as well as negative percentage
        rating_radio_button_questions.map((question) => {
            let positive = 0;
            let negative = 0;
            let total_answered = 0;
            question.options.map((option) => {
                total_answered += option.answered;
                if (positive_values.findIndex(item => option.label.toLowerCase() === item.toLowerCase()) > -1) {
                    positive += option.answered;
                } else {
                    negative += option.answered;
                }
            });
            const positive_percentage = (positive / total_answered) * 100;
            const negative_percentage = (negative / total_answered) * 100;
            const series = [];
            series.push({name: 'Agreed', value: positive_percentage});
            series.push({name: 'Disagreed / Neutral', value: negative_percentage});
            // concatenate exit_reason with exit_reporting_label
            this.employee_sentiment.push({
                name: this.exit_reasons.find(ex => ex.id == question.exit_reason).value + ' - ' + question.exit_reporting_label,
                positive_percentage,
                negative_percentage,
                series: series
            });
        });
        // sort by agree/strongly agree in the descending order
        this.employee_sentiment.sort((a, b) => (a.positive_percentage < b.positive_percentage) ? 1 : ((b.positive_percentage < a.positive_percentage) ? -1 : 0));
        const sentiment_divider_length = Math.round(this.employee_sentiment.length / 2);
        for (let i = 0; i < sentiment_divider_length; i++) {
            this.employee_sentiment_working_chart_data.push(this.employee_sentiment[i]);
        }
        for (let i = sentiment_divider_length; i < this.employee_sentiment.length; i++) {
            this.employee_sentiment_not_working_chart_data.push(this.employee_sentiment[i]);
        }
        // console.log("***************** what's working *************");
        // console.log(this.employee_sentiment_working_chart_data);
        // console.log("***************** what's not working *************");
        // console.log(this.employee_sentiment_not_working_chart_data);

    }

}
