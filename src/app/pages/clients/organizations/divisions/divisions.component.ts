import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Router} from "@angular/router";
import {IndustryService} from "../../../../@core/data/industry.service";
import {ClientService} from "../../../../@core/data/client.service";
import {OrganizationService} from "../../../../@core/data/organization.service";
import {DivisionService} from "../../../../@core/data/division.service";

@Component({
    selector: 'ngx-divisions',
    templateUrl: './divisions.component.html',
    styleUrls: ['./divisions.component.scss']
})
export class DivisionsComponent implements OnInit, OnChanges {

    @Input() organizationId: string;
    @Output() divisionEdit = new EventEmitter();
    organizationName;

    // ADD DEPARTMENT, VIEW DEPARTMENT
    @Output() onAddDepartment = new EventEmitter();
    @Output() onViewDepartment = new EventEmitter();
    rows = [];
    count = 0;
    offset = 0;
    limit = 1000;
    divisions;

    constructor(private router: Router,
                private divisionService: DivisionService,
                private industryService: IndustryService,
                private clientService: ClientService,
                private organizationService: OrganizationService) {
    }

    ngOnInit() {
    }

    onClickEdit(divisionId) {
        this.divisionEdit.emit({divisionId});
    }

    onClickAddDepartment(divisionId) {
        this.onAddDepartment.emit({divisionId});
    }

    onClickViewDepartment(divisionId) {
        this.onViewDepartment.emit({divisionId});
    }

    onClickDelete(id) {
        const name = this.rows.find(x => x.id === id).name;
        if (confirm("Are you sure to delete " + name)) {
            this.deleteDivision(id);
        }
    }
    getOrganization() {
        this.organizationService.getOrganization(this.organizationId).subscribe(
            data => {
                this.organizationName = data.organization.name;
            }
        );
    }
    deleteDivision(id) {
        this.divisionService.deleteDivision(id).subscribe(
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
        this.organizationService.getOrganizationDivisions(this.organizationId).subscribe(results => {
                this.divisions = results.organization.divisions;
                this.count = this.divisions.length;
                const rows = [];
                this.divisions.map((division) => {
                    division.id = division._id;
                    rows.push(division);
                });
                this.rows = rows;

            },
            (err) => {
                console.log(err);
            }
        );
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.organizationId = changes.organizationId.currentValue;
        if (typeof this.organizationId !== 'undefined' && this.organizationId !== null) {
            this.page(0, 1000);
            this.getOrganization();
        }
    }

}
