import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {IndustryService} from "../../../@core/data/industry.service";

@Component({
    selector: 'ngx-industries',
    templateUrl: './industries.component.html',
    styleUrls: ['./industries.component.scss']
})
export class IndustriesComponent implements OnInit {

    rows = [];
    count = 0;
    offset = 0;
    limit = 3;
    industries;

    constructor(private router: Router, private industryService: IndustryService) {
    }

    ngOnInit() {
        this.page(this.offset, this.limit);
    }

    onClickAdd() {
        this.router.navigateByUrl('/pages/clients/client-selection/industries/add');
    }

    onClickEdit(id) {
        this.router.navigateByUrl('/pages/clients/client-selection/industries/edit/' + id);
    }

    onClickDelete(id) {
        const name = this.rows.find(x => x.id === id).name;
        if (confirm("Are you sure to delete " + name)) {
            this.deleteIndustry(id);
        }
    }

    deleteIndustry(id) {
        this.industryService.deleteIndustry(id).subscribe(
            data => {
                console.log(data);
            },
            err => {
                console.log(err);
            },
            () => {
                this.page(this.offset, this.limit);
            }
        );
    }

    /**
     * Populate the table with new data based on the staticPage number
     * @param staticPage The staticPage to select
     */
    onPage(event) {
        this.page(event.offset, event.limit);
    }

    page(offset, limit) {
        this.industryService.getIndustries(offset, limit).subscribe(results => {
                this.count = results.totalItems;
                this.industries = results.industries;
                const rows = [];
                this.industries.map((industry) => {
                    industry.id = industry._id;
                    rows.push(industry);
                });
                this.rows = rows;
                console.log(this.rows);

            },
            (err) => {
                console.log(err);
            }
        );
    }

}
