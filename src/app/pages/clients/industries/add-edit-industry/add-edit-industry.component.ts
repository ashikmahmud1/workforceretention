import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {IndustryService} from "../../../../@core/data/industry.service";

@Component({
    selector: 'ngx-add-edit-industry',
    templateUrl: './add-edit-industry.component.html',
    styleUrls: ['./add-edit-industry.component.scss']
})
export class AddEditIndustryComponent implements OnInit {

    industryId;
    industryName;
    successMessage;
    errorMessage;
    industry;

    constructor(private route: ActivatedRoute,
                private industryService: IndustryService,
                private router: Router) {
    }

    ngOnInit() {
        this.industryId = this.route.snapshot.paramMap.get('id');
        if (this.industryId) {
            //get the employee from the database and set to the employee
            this.getIndustry();
        }
    }

    goToIndustries() {
        this.router.navigateByUrl('/pages/clients/client-selection/industries');
    }

    getIndustry() {
        this.industryService.getIndustry(this.industryId).subscribe(
            data => {
                this.setResult(data);
            },
            err => {
                console.log(err);
            }
        );
    }

    createIndustry() {
        const industry = {
            name: this.industryName,
        };
        if (this.industryId) {
            //perform update operation
            this.update(industry);
        } else {
            //perform insert operation
            this.insert(industry);
        }
    }

    insert(industry) {
        this.industryService.createIndustry(industry).subscribe(
            data => {
                this.errorMessage = null;
                this.successMessage = data.message;
                this.setResult(data);
            },
            err => {
                const {error} = err;
                this.errorMessage = error.message;
                console.log(err);
            }
        );
    }

    update(industry) {
        this.industryService.updateIndustry(industry, this.industryId).subscribe(
            data => {
                this.errorMessage = null;
                this.successMessage = data.message;
                this.setResult(data);
            },
            err => {
                const {error} = err;
                this.errorMessage = error.message;
                console.log(err);
            }
        );
    }

    setResult(data) {
        this.industry = data.industry;
        this.industryName = this.industry.name;
        this.industryId = this.industry._id;
    }

}
