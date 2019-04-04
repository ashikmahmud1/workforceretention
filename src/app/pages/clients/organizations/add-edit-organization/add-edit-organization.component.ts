import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {OrganizationService} from "../../../../@core/data/organization.service";

@Component({
    selector: 'ngx-add-edit-organization',
    templateUrl: './add-edit-organization.component.html',
    styleUrls: ['./add-edit-organization.component.scss']
})
export class AddEditOrganizationComponent implements OnInit, OnChanges {

    @Input() organizationId: string;
    @Input() clientId: string;
    @Output() selectOrganization = new EventEmitter();
    organizationName;
    successMessage;
    errorMessage;
    organization;

    constructor(private route: ActivatedRoute, private organizationService: OrganizationService) {
    }

    ngOnInit() {
    }

    onClickSelectOrganization() {
        this.selectOrganization.emit();
    }

    getOrganization() {
        this.organizationService.getOrganization(this.organizationId).subscribe(
            data => {
                this.setResult(data);
            },
            err => {
                console.log(err);
            }
        );
    }

    deleteOrganization(organizationId) {
        this.organizationService.deleteOrganization(organizationId).subscribe(
            () => {
                this.selectOrganization.emit();
            },
            err => {
                const {error} = err;
                this.errorMessage = error.message;
                console.log(err);
            }
        );
    }

    createOrganization() {
        const organization = {
            name: this.organizationName,
        };
        if (this.organizationId) {
            //perform update operation
            this.update(organization);
        } else {
            //perform insert operation
            this.insert(organization);
        }
    }

    insert(organization) {
        this.organizationService.createOrganization(organization, this.clientId).subscribe(
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

    update(organization) {
        this.organizationService.updateOrganization(organization, this.organizationId).subscribe(
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
        this.organization = data.organization;
        this.organizationName = this.organization.name;
        this.organizationId = this.organization._id;
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.organizationId = changes.organizationId.currentValue;
        if (typeof this.organizationId !== 'undefined' && this.organizationId !== null) {
            this.getOrganization();
        }
    }

}
