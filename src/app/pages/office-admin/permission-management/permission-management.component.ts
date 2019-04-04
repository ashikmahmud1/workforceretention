import {Component, OnInit} from '@angular/core';
import {RoleService} from "../../../@core/data/role.service";
import {Router} from "@angular/router";

@Component({
    selector: 'ngx-permission-management',
    templateUrl: './permission-management.component.html',
    styleUrls: ['./permission-management.component.scss']
})
export class PermissionManagementComponent implements OnInit {

    rows = [];
    count = 0;
    offset = 0;
    limit = 3;
    roles;

    constructor(private roleService: RoleService, private router: Router) {
    }

    ngOnInit() {
        this.page(this.offset, this.limit);
    }

    onClickAdd() {
        this.router.navigateByUrl('/pages/office-admin/permission-management/add');
    }

    onClickEdit(id) {
        this.router.navigateByUrl('/pages/office-admin/permission-management/edit/' + id);
    }

    onClickDelete(id) {
        //find the employee name from the rows using
        const name = this.rows.find(x => x.id === id).name;
        if (confirm("Are you sure to delete " + name)) {
            this.deleteRole(id);
        }
    }

    deleteRole(id) {
        this.roleService.deleteRole(id).subscribe(
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
        this.roleService.getRoles(offset, limit).subscribe(results => {
                this.count = results.totalItems;
                this.roles = results.roles;
                const rows = [];
                this.roles.map((role) => {
                    role.id = role._id;
                    rows.push(role);
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
