import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DepartmentService} from "../../../../../@core/data/department.service";

@Component({
    selector: 'ngx-add-edit-department',
    templateUrl: './add-edit-department.component.html',
    styleUrls: ['./add-edit-department.component.scss']
})
export class AddEditDepartmentComponent implements OnInit, OnChanges {
    @Input() departmentId: string;
    @Input() divisionId: string;
    @Output() selectDepartment = new EventEmitter();

    departmentName;
    successMessage;
    errorMessage;
    department;

    constructor(private route: ActivatedRoute,
                private departmentService: DepartmentService) {
    }

    ngOnInit() {
    }

    onClickSelectDepartment() {
        this.selectDepartment.emit();
    }

    getDepartment() {
        this.departmentService.getDepartment(this.departmentId).subscribe(
            data => {
                this.setResult(data);
            },
            err => {
                console.log(err);
            }
        );
    }

    deleteDepartment(departmentId) {
        this.departmentService.deleteDepartment(departmentId).subscribe(
            () => {
                this.selectDepartment.emit();
            },
            err => {
                const {error} = err;
                this.errorMessage = error.message;
                console.log(err);
            }
        );
    }

    createDepartment() {
        const department = {
            name: this.departmentName,
        };
        if (this.departmentId) {
            //perform update operation
            this.update(department);
        } else {
            //perform insert operation
            this.insert(department);
        }
    }

    insert(department) {
        this.departmentService.createDepartment(department, this.divisionId).subscribe(
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

    update(department) {
        this.departmentService.updateDepartment(department, this.departmentId).subscribe(
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
        this.department = data.department;
        this.departmentName = this.department.name;
        this.departmentId = this.department._id;
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.departmentId = changes.departmentId.currentValue;
        if (typeof this.departmentId !== 'undefined' && this.departmentId !== null) {
            this.getDepartment();
        }
    }

}
