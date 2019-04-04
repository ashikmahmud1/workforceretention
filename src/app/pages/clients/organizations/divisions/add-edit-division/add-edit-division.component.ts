import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DivisionService} from "../../../../../@core/data/division.service";
import {OrganizationService} from "../../../../../@core/data/organization.service";

@Component({
    selector: 'ngx-add-edit-division',
    templateUrl: './add-edit-division.component.html',
    styleUrls: ['./add-edit-division.component.scss']
})
export class AddEditDivisionComponent implements OnInit, OnChanges {

    @Input() divisionId: string;
    @Input() organizationId: string;
    @Output() selectDivision = new EventEmitter();
    divisionName;
    successMessage;
    errorMessage;
    division;
    organizationName;

    constructor(private route: ActivatedRoute,
                private divisionService: DivisionService,
                private organizationService: OrganizationService) {
    }

    ngOnInit() {
    }

    onClickSelectDivision() {
        this.selectDivision.emit();
    }

    getDivision() {
        this.divisionService.getDivision(this.divisionId).subscribe(
            data => {
                this.setResult(data);
            },
            err => {
                console.log(err);
            }
        );
    }

    deleteDivision(divisionId) {
        this.divisionService.deleteDivision(divisionId).subscribe(
            () => {
                this.selectDivision.emit();
            },
            err => {
                const {error} = err;
                this.errorMessage = error.message;
                console.log(err);
            }
        );
    }

    getOrganization() {
        this.organizationService.getOrganization(this.organizationId).subscribe(
            data => {
                this.organizationName = data.organization.name;
            }
        );
    }

    createDivision() {
        const division = {
            name: this.divisionName,
        };
        if (this.divisionId) {
            //perform update operation
            this.update(division);
        } else {
            //perform insert operation
            this.insert(division);
        }
    }

    insert(division) {
        this.divisionService.createDivision(division, this.organizationId).subscribe(
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

    update(division) {
        this.divisionService.updateDivision(division, this.divisionId).subscribe(
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
        this.division = data.division;
        this.divisionName = this.division.name;
        this.divisionId = this.division._id;
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.divisionId = changes.divisionId.currentValue;
        this.organizationId = changes.organizationId.currentValue;
        if (typeof this.organizationId !== 'undefined' && this.organizationId !== null) {
            this.getOrganization();
        }
        if (typeof this.divisionId !== 'undefined' && this.divisionId !== null) {
            this.getDivision();
        }
    }

}
