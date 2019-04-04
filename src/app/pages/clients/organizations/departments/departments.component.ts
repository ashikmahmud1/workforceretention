import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Router} from "@angular/router";
import {DivisionService} from "../../../../@core/data/division.service";
import {DepartmentService} from "../../../../@core/data/department.service";

@Component({
    selector: 'ngx-departments',
    templateUrl: './departments.component.html',
    styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit, OnChanges {
    @Input() divisionId: string;

    @Output() departmentEdit = new EventEmitter();
    rows = [];
    count = 0;
    offset = 0;
    limit = 1000;
    departments;

    constructor(private router: Router,
                private divisionService: DivisionService,
                private departmentService: DepartmentService) {
    }

    ngOnInit() {
    }

    onClickEdit(departmentId) {
        this.departmentEdit.emit({departmentId});
    }

    onClickDelete(id) {
        const name = this.rows.find(x => x.id === id).name;
        if (confirm("Are you sure to delete " + name)) {
            this.deleteDepartment(id);
        }
    }

    deleteDepartment(id) {
        this.departmentService.deleteDepartment(id).subscribe(
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
        this.divisionService.getDivisionDepartments(this.divisionId).subscribe(results => {
                this.departments = results.division.departments;
                this.count = this.departments.length;
                const rows = [];
                this.departments.map((department) => {
                    department.id = department._id;
                    rows.push(department);
                });
                this.rows = rows;

            },
            (err) => {
                console.log(err);
            }
        );
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.divisionId = changes.divisionId.currentValue;
        if (typeof this.divisionId !== 'undefined' && this.divisionId !== null) {
            this.page(0, 1000);
        }
    }

}
