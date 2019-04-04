import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ReportService} from "../../../@core/data/report.service";

@Component({
    selector: 'ngx-report-files',
    templateUrl: './report-files.component.html',
    styleUrls: ['./report-files.component.scss'],
})
export class ReportFilesComponent implements OnInit {

    rows = [];
    count = 0;
    offset = 0;
    limit = 9;
    reports;

    constructor(private router: Router, private reportService: ReportService) {
    }

    onClickAdd() {
        this.router.navigateByUrl('/pages/reporting/report-files/add');
    }

    ngOnInit() {
        this.page(this.offset, this.limit);
    }

    /**
     * Populate the table with new data based on the staticPage number
     * @param staticPage The staticPage to select
     */
    onPage(event) {
        this.page(event.offset, event.limit);
    }

    onClickEdit(id) {
        this.router.navigateByUrl('/pages/reporting/report-files/edit/' + id);
    }

    onClickDelete(id) {
        //find the employee name from the rows using
        const name = this.rows.find(x => x.id === id).title;
        if (confirm("Are you sure to delete? " + name)) {
            this.deleteReport(id);
        }
    }

    deleteReport(id) {
        this.reportService.deleteReport(id).subscribe(
            data => {
                console.log(data);
                this.page(this.offset, this.limit);
            },
            err => {
                console.log(err);
            }
        );
    }

    page(offset, limit) {
        this.reportService.getReports(offset, limit).subscribe(results => {
                console.log(results);
                this.count = results.totalItems;
                this.reports = results.reports;
                const rows = [];
                this.reports.map((report) => {
                    // Modify report role
                    report.id = report._id;
                    report.clientName = report.client.name;
                    rows.push(report);
                });
                this.rows = rows;

            },
            (err) => {
                console.log(err);
            }
        );
    }

}
