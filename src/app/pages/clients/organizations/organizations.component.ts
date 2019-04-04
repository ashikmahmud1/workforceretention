import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Router} from "@angular/router";
import {IndustryService} from "../../../@core/data/industry.service";
import {ClientService} from "../../../@core/data/client.service";
import {OrganizationService} from "../../../@core/data/organization.service";

@Component({
    selector: 'ngx-organizations',
    templateUrl: './organizations.component.html',
    styleUrls: ['./organizations.component.scss']
})
export class OrganizationsComponent implements OnInit, OnChanges {

    @Input() clientId: string;
    @Output() organizationEdit = new EventEmitter();

    // ADD DIVISION, EDIT DIVISION
    @Output() onAddDivision = new EventEmitter();
    @Output() onViewDivision = new EventEmitter();
    @Output() divisionEdit = new EventEmitter();
    // ADD DEPARTMENT, EDIT DEPARTMENT
    @Output() onAddDepartment = new EventEmitter();
    @Output() departmentEdit = new EventEmitter();

    rows = [];
    count = 0;
    offset = 0;
    limit = 1000;
    organizations;
    organizations_divisions_departments = [];

    constructor(private router: Router,
                private industryService: IndustryService,
                private clientService: ClientService,
                private organizationService: OrganizationService) {
    }

    ngOnInit() {
    }

    onClickAdd() {
        this.router.navigateByUrl('/pages/clients/staticPage-selection/industries/add');
    }

    onClickEdit(organizationId) {
        this.organizationEdit.emit({organizationId});
    }

    onClickAddDivision(organizationId) {
        this.onAddDivision.emit({organizationId});
    }

    onClickEditDivision(divisionId) {
        this.divisionEdit.emit({divisionId});
    }

    onClickAddDepartment(divisionId) {
        this.onAddDepartment.emit({divisionId});
    }

    onClickEditDepartment(departmentId) {
        this.departmentEdit.emit({departmentId});
    }

    onClickDelete(id) {
        const name = this.rows.find(x => x.id === id).name;
        if (confirm("Are you sure to delete " + name)) {
            this.deleteOrganization(id);
        }
    }

    deleteOrganization(id) {
        this.organizationService.deleteOrganization(id).subscribe(
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

    setOrganizations(organizations) {
        // foreach organization add in the array
        //foreach organization division add in the array
        //foreach division add the department
        if (typeof organizations !== 'undefined' && organizations !== null) {
            organizations.map((organization) => {
                const newOrganization = {
                    id: organization._id,
                    name: organization.name,
                    isOrganization: true,
                    isDivision: false,
                    isDepartment: false
                };
                this.organizations_divisions_departments.push(newOrganization);
                if (typeof organization.divisions !== 'undefined' && organization.divisions !== null) {
                    organization.divisions.map((division) => {
                        const newDivision = {
                            id: division._id,
                            name: division.name,
                            isOrganization: false,
                            isDivision: true,
                            isDepartment: false
                        };
                        this.organizations_divisions_departments.push(newDivision);
                        if (typeof division.departments !== 'undefined' && division.departments !== null) {
                            division.departments.map((department) => {
                                const newDepartment = {
                                    id: department._id,
                                    name: department.name,
                                    isOrganization: false,
                                    isDivision: false,
                                    isDepartment: true
                                };
                                this.organizations_divisions_departments.push(newDepartment);
                            });
                        }
                    });
                }
            });
        }
        console.log(this.organizations_divisions_departments);
        this.count = this.organizations_divisions_departments.length;
        this.rows = this.organizations_divisions_departments;
    }

    page(offset, limit) {
        this.clientService.getClientOrganizations(this.clientId).subscribe(results => {
                this.organizations = results.client.organizations;
                this.setOrganizations(this.organizations);
            },
            (err) => {
                console.log(err);
            }
        );
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.clientId = changes.clientId.currentValue;
        if (typeof this.clientId !== 'undefined' && this.clientId !== null) {
            this.page(0, 1000);
        }
    }

}
