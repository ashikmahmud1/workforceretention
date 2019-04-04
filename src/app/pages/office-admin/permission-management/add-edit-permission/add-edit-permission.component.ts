import {Component, OnInit} from '@angular/core';
import {RoleService} from "../../../../@core/data/role.service";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'ngx-add-edit-permission',
    templateUrl: './add-edit-permission.component.html',
    styleUrls: ['./add-edit-permission.component.scss']
})
export class AddEditPermissionComponent implements OnInit {

    roleId;
    roleName;
    rolePermissions;
    role;
    rows;
    count = 0;
    successMessage;
    errorMessage;

    constructor(private roleService: RoleService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.rolePermissions = [
            {"table_name": "Admin", "is_read": false, "is_write": false, "is_update": false, "is_delete": false},
            {"table_name": "Products", "is_read": false, "is_write": false, "is_update": false, "is_delete": false},
            {"table_name": "Articles", "is_read": false, "is_write": false, "is_update": false, "is_delete": false},
            {"table_name": "Surveys", "is_read": false, "is_write": false, "is_update": false, "is_delete": false},
            {"table_name": "Clients", "is_read": false, "is_write": false, "is_update": false, "is_delete": false},
            {"table_name": "Reporting", "is_read": false, "is_write": false, "is_update": false, "is_delete": false},
            {"table_name": "Links", "is_read": false, "is_write": false, "is_update": false, "is_delete": false}
        ];
        this.roleId = this.route.snapshot.paramMap.get('id');
        if (this.roleId) {
            //get the employee from the database and set to the employee
            this.getRole();
        } else {
            this.page();
        }
        // this.getRoles();
        // this.getRole();
    }

    getRole() {
        this.roleService.getRole(this.roleId).subscribe(
            data => {
                this.setResult(data);
            },
            err => {
                console.log(err);
            }
        );
    }

    isRead(rowIndex) {
        this.rolePermissions[rowIndex].is_read = !this.rolePermissions[rowIndex].is_read;
    }

    isUpdate(rowIndex) {
        this.rolePermissions[rowIndex].is_update = !this.rolePermissions[rowIndex].is_update;
    }

    isDelete(rowIndex) {
        this.rolePermissions[rowIndex].is_delete = !this.rolePermissions[rowIndex].is_delete;
    }

    isWrite(rowIndex) {
        this.rolePermissions[rowIndex].is_write = !this.rolePermissions[rowIndex].is_write;
    }

    page() {
        const rows = [];
        this.rolePermissions.map((permission) => {
            // This is done only because of _ underscore is not supported by ngx-datatable
            permission.tableName = permission.table_name;
            permission.tableRead = permission.is_read;
            permission.tableWrite = permission.is_write;
            permission.tableUpdate = permission.is_update;
            permission.tableDelete = permission.is_delete;
            rows.push(permission);
        });
        this.rows = rows;
    }

    createRole() {
        this.rolePermissions.map((permission) => {
            delete permission.tableName;
            delete permission.tableRead;
            delete permission.tableWrite;
            delete permission.tableUpdate;
            delete permission.tableDelete;
        });
        const role = {
            name: this.roleName,
            permissions: this.rolePermissions
        };
        if (this.roleId) {
            //perform update operation
            this.update(role);
        } else {
            //perform insert operation
            this.insert(role);
        }
    }

    insert(role) {
        // insert the role into the database
        this.roleService.createRole(role).subscribe(
            data => {
                this.successMessage = data.message;
                console.log(data);
                this.setResult(data);
                //get the updated result and set it to the role
            },
            err => {
                console.log(err);
            },
            () => {
                console.log('completed..');
            }
        );
    }

    update(role) {
        // process the role here and execute update function.
        this.roleService.updateRole(role, this.roleId).subscribe(
            data => {
                this.successMessage = data.message;
                this.setResult(data);
                //Get the updated result and set it to the roles
            },
            err => {
                console.log(err);
            },
            () => {
                console.log('completed operation');
            }
        );
    }

    setResult(data) {
        this.role = data.role;
        this.rolePermissions = this.role.permissions;
        this.roleName = this.role.name;
        this.roleId = this.role._id;
        this.page();
    }

}
