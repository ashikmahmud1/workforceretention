import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../../../@core/data/users.service";
import {Router} from "@angular/router";

@Component({
    selector: 'ngx-user-management',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
    rows = [];
    count = 0;
    offset = 0;
    limit = 9;
    users;

    @ViewChild('myTable') table;

    constructor(private userService: UserService, private router: Router) {

    }

    onClickAdd() {
        this.router.navigateByUrl('/pages/office-admin/employee-management/add');
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
        this.router.navigateByUrl('/pages/office-admin/employee-management/edit/' + id);
    }

    onClickDelete(id) {
        //find the employee name from the rows using
        const name = this.rows.find(x => x.id === id).username;
        if (confirm("Are you sure to delete " + name)) {
            this.deleteUser(id);
        }
    }

    deleteUser(id) {
        this.userService.deleteUser(id).subscribe(
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
        this.userService.getUsers(offset, limit).subscribe(results => {
                this.count = results.totalItems;
                this.users = results.users;
                const rows = [];
                this.users.map((user) => {
                    // Modify employee role
                    user.role = typeof user.role !== 'undefined' && user.role !== null ? user.role.name : '';
                    user.id = user._id;
                    rows.push(user);
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
