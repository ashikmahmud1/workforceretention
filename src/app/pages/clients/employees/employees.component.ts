import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {EmployeeService} from "../../../@core/data/employee.service";

@Component({
    selector: 'ngx-employees',
    templateUrl: './employees.component.html',
    styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit, OnChanges {

    @Input() clientId: string;
    @Output() employeeEdit = new EventEmitter();
    @Output() employeeDetails = new EventEmitter();
    rows = [];
    count = 0;
    offset = 0;
    limit = 10;
    successMessage;
    errorMessage;
    employees = [];
    @ViewChild('filePicker')
    filePicker: ElementRef;
    sortProp;

    constructor(private employeeService: EmployeeService) {
    }

    ngOnInit() {
    }

    /**
     * Populate the table with new data based on the staticPage number
     * @param staticPage The staticPage to select
     */
    onPage(event) {
        this.page(event.offset, event.limit);
    }

    onClickEdit(employeeId) {
        this.employeeEdit.emit({employeeId});
    }

    onClickDelete(employeeId) {
        //find the employee name from the rows using
        const name = this.rows.find(x => x.id === employeeId).username;
        if (confirm("Are you sure to delete " + name)) {
            this.deleteEmployee(employeeId);
        }
    }

    onClickDetails(id) {
        this.employeeDetails.emit({employeeId: id});
    }

    deleteEmployee(employeeId) {
        this.employeeService.deleteEmployee(employeeId).subscribe(
            data => {
                console.log(data);
                this.page(this.offset, this.limit);
            },
            err => {
                console.log(err);
            }
        );
    }

    onFilePicked(event) {
        const file = event.target.files[0];
        this.employeeService.uploadEmployees(file, this.clientId)
            .subscribe(
                data => {
                    this.successMessage = data.message;
                    // reset the file input field
                    this.filePicker.nativeElement.value = "";
                    this.page(this.offset, this.limit);
                },
                err => {
                    const {error} = err;
                    this.errorMessage = error.message;
                }
            );
    }

    onClickSort(prop) {
        // we need to short both by ascending and descending order
        // check if the sortProp is null or undefined. if not then check if the prop is same as sortProp
        if (this.sortProp != null && typeof this.sortProp != 'undefined') {
            // check if the key already exist in the sortProp or not
            // if not exist then sort by ascending order
            // if already exist then sort by descending order
            if (prop in this.sortProp) {
                this.sortProp = null;
                const sortData = {prop: prop, order: 'descending'};
                this.page(this.offset, this.limit, sortData);
            } else {
                this.sortProp[prop] = prop;
                const sortData = {prop: prop, order: 'ascending'};
                this.page(this.offset, this.limit, sortData);
            }
        } else {
            // sort by that property
            this.sortProp = {};
            this.sortProp[prop] = prop;
            const sortData = {prop: prop, order: 'ascending'};
            this.page(this.offset, this.limit, sortData);
        }
    }

    page(offset, limit, sort = {}) {
        if (this.clientId === null) return;
        this.employeeService.getEmployees(offset, limit, this.clientId, sort).subscribe(results => {
                const rows = [];
                this.employees = results.employees;
                if (this.employees !== null) {
                    this.count = results.totalItems;
                    this.employees.map((employee) => {
                        employee.id = employee._id;
                        employee.firstName = employee.first_name;
                        employee.lastName = employee.last_name;
                        rows.push(employee);
                    });
                }
                this.rows = rows;

            },
            (err) => {
                console.log(err);
            }
        );
    }

    downloadEmployeeTemplate() {
        console.log('downloading template...');
    }

    ngOnChanges(changes: SimpleChanges) {
        this.clientId = changes.clientId.currentValue;
        this.page(this.offset, this.limit);
    }

}
