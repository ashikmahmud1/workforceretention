import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {EmployeeService} from "../../../../@core/data/employee.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ClientService} from "../../../../@core/data/client.service";
import {NbDateService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService} from "@nebular/theme";
import {ToasterConfig} from "angular2-toaster";
import {NbToastStatus} from "@nebular/theme/components/toastr/model";

@Component({
    selector: 'ngx-add-edit-employee',
    templateUrl: './add-edit-employee.component.html',
    styleUrls: ['./add-edit-employee.component.scss']
})
export class AddEditEmployeeComponent implements OnInit, OnChanges {

    @Input() employeeId: string;
    @Input() clientId: string;
    @Output() selectEmployeeManagement = new EventEmitter();
    min: Date;
    max: Date;

    employee = {
        first_name: '', last_name: '',
        email: '',
        organization: '',
        username: '',
        position: '',
        hire_date: '',
        resignation_date: '',
        work_phone: '',
        mobile_phone: '',
        birth_date: '',
        exit_date: '',
        gender: '',
        occupational_group: ''
    };
    initialEmailAddress;
    organizations;
    successMessage;
    errorMessage;
    occupations = [
        {id: 1, value: 'Not Classified'},
        {id: 2, value: 'Managers'},
        {id: 3, value: 'Professionals'},
        {id: 4, value: 'Technicians and Trade Workers'},
        {id: 5, value: 'Community and Personal Service Workers'},
        {id: 6, value: 'Clerical and Administrative Workers'},
        {id: 7, value: 'Sales Workers'},
        {id: 8, value: 'Machinery Operators and Drivers'},
        {id: 9, value: 'Labourers'},
    ];
    organizations_divisions_departments = [];

    // define a employee model

    // ****************** Toaster Configuration ********************
    config: ToasterConfig;

    index = 1;
    destroyByClick = true;
    duration = 2000;
    hasIcon = true;
    position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
    preventDuplicates = false;
    status: NbToastStatus = NbToastStatus.SUCCESS;

    constructor(private employeeService: EmployeeService,
                protected dateService: NbDateService<Date>,
                private clientService: ClientService,
                private toastrService: NbToastrService) {
        this.min = this.dateService.addDay(this.dateService.today(), -5);
        this.max = this.dateService.addDay(this.dateService.today(), 5);
    }

    ngOnInit() {
        this.createForm();
        this.get('resignation_date').clearValidators();
        this.get('exit_date').clearValidators();
    }

    employeeForm: FormGroup;

    // control reference function
    get(controlName) {
        return this.employeeForm.get(controlName);
    }

    createForm() {
        this.employeeForm = new FormGroup({
            firstName: new FormControl('', Validators.required),
            lastName: new FormControl('', Validators.required),
            email: new FormControl('', [
                Validators.required,
                Validators.pattern("[^ @]*@[^ @]*")
            ]),
            organization: new FormControl('',
                [Validators.required]),
            username: new FormControl('',
                [Validators.required]),
            position: new FormControl('',
                [Validators.required]),
            gender: new FormControl('1'),
            birth_date: new FormControl('', Validators.required),
            resignation_date: new FormControl('', Validators.required),
            hire_date: new FormControl('', Validators.required),
            exit_date: new FormControl('', Validators.required),
            is_active: new FormControl('1'),
            is_manager: new FormControl('0'),
            is_report: new FormControl('0'),
            is_survey: new FormControl('1'),
            is_online: new FormControl('1'),
            work_phone: new FormControl(),
            occupational_group: new FormControl('', [Validators.required]),
            mobile_phone: new FormControl()
        });
    }

    getEmployee() {
        this.employeeService.getEmployee(this.employeeId).subscribe(data => {
                this.setEmployee(data);
                //set the employee
            },
            err => {
                console.log(err);
            }
        );
    }

    getOrganizations() {
        this.clientService.getClientOrganizations(this.clientId).subscribe(
            data => {
                this.organizations = data.client.organizations;
                console.log('********* Organization ********');
                console.log(this.organizations);
                this.setOrganizations(this.organizations);
            },
            err => {
                console.log(err);
            }
        );
    }

    setOrganizations(organizations) {
        // foreach organization add in the array
        //foreach organization division add in the array
        //foreach division add the department
        if (typeof organizations !== 'undefined' && organizations !== null) {
            organizations.map((organization) => {
                const newOrganization = {
                    id: organization._id,
                    class: 'organization',
                    name: organization.name
                };
                this.organizations_divisions_departments.push(newOrganization);
                if (typeof organization.divisions !== 'undefined' && organization.divisions !== null) {
                    organization.divisions.map((division) => {
                        const newDivision = {
                            id: organization._id + '_' + division._id,
                            name: '\u00A0 --' + division.name,
                            class: 'division'
                        };
                        this.organizations_divisions_departments.push(newDivision);
                        if (typeof division.departments !== 'undefined' && division.departments !== null) {
                            division.departments.map((department) => {
                                const newDepartment = {
                                    id: organization._id + '_' + division._id + '_' + department._id,
                                    class: 'department',
                                    name: '\u00A0 \u00A0 ---' + department.name
                                };
                                this.organizations_divisions_departments.push(newDepartment);
                            });
                        }
                    });
                }
            });
        }
    }

    createEmployee() {
        const employee = {
            first_name: this.get('firstName').value,
            last_name: this.get('lastName').value,
            email: this.get('email').value,
            username: this.get('username').value,
            position: this.get('position').value,
            is_active: this.get('is_active').value,
            is_survey: this.get('is_survey').value,
            is_online: this.get('is_online').value,
            is_report: this.get('is_report').value,
            is_manager: this.get('is_manager').value,
            hire_date: this.get('hire_date').value,
            date_of_birth: this.get('birth_date').value,
            resign_date: this.get('resignation_date').value,
            phone: this.get('work_phone').value,
            mobile: this.get('mobile_phone').value,
            exit_date: this.get('exit_date').value,
            gender: this.get('gender').value,
            occupational_group: this.get('occupational_group').value,
            organization: this.employee.organization
        };
        //here check if the organization is selected or division selected or department selected
        const split_organization = this.employee.organization.split('_');
        if (split_organization.length === 3) {
            employee['organization'] = split_organization[0];
            employee['division'] = split_organization[1];
            employee['department'] = split_organization[2];
        } else if (split_organization.length === 2) {
            employee['organization'] = split_organization[0];
            employee['division'] = split_organization[1];
        } else {
            employee['organization'] = split_organization[0];
        }
        console.log(split_organization);

        if (this.employeeForm.valid) {
            // check if the pageId is null or not. if null then insert else update
            if (this.employeeId) {
                this.update(employee);
            } else {
                this.insert(employee);
            }
        }

    }

    setEmployee(data) {
        console.log(data);
        this.initialEmailAddress = data.employee.email;
        this.employee.email = data.employee.email;

        this.employee.first_name = data.employee.first_name;
        this.employee.last_name = data.employee.last_name;
        this.employee.position = data.employee.position;
        this.employee.username = data.employee.username;
        this.employeeId = data.employee._id;
        //SET THE VALUE;

        //set the organization. combine the organization division and department
        let organization = '';
        if (data.employee.organization) {
            organization += data.employee.organization;
        }
        if (data.employee.division) {
            organization += '_' + data.employee.division;
        }
        if (data.employee.department) {
            organization += '_' + data.employee.department;
        }
        this.employee.organization = organization;

        this.get('is_active').setValue(data.employee.is_active);
        this.get('is_survey').setValue(data.employee.is_survey);
        this.get('is_online').setValue(data.employee.is_online);
        this.get('is_report').setValue(data.employee.is_report);
        this.get('is_manager').setValue(data.employee.is_manager);
        this.get('gender').setValue(data.employee.gender);
        this.get('work_phone').setValue(data.employee.phone);
        this.get('mobile_phone').setValue(data.employee.mobile);
        this.get('occupational_group').setValue(data.employee.occupational_group);
        if (this.get('is_manager').value == '1') {
            this.get('resignation_date').setErrors(null);
            this.get('exit_date').setErrors(null);
            this.get('hire_date').setErrors(null);
            this.get('birth_date').setErrors(null);
        }
        this.employee.mobile_phone = data.employee.mobile;
        this.employee.work_phone = data.employee.phone;
        this.get('email').disable();

        if (this.get('is_manager').value == '0') {
            this.get('hire_date').setValue(this.dateService.parse(data.employee.hire_date, 'en-us'));
            this.get('birth_date').setValue(this.dateService.parse(data.employee.date_of_birth, 'en-us'));
            this.get('resignation_date').setValue(this.dateService.parse(data.employee.resign_date, 'en-us'));
            this.get('exit_date').setValue(this.dateService.parse(data.employee.exit_date, 'en-us'));
        }
    }

    insert(employee) {

        this.employeeService.createEmployee(employee, this.clientId).subscribe(
            data => {
                this.successMessage = data.message;
                this.setEmployee(data);
                this.selectEmployeeManagement.emit();
            },
            err => {
                const {error} = err;
                this.errorMessage = error.message;
            }
        );
    }

    onChangeManager() {
        // update the validation
        // remove the validation from the hire_date, resignation_date and exit_date
        if (this.get('is_manager').value == '1') {
            // clear the validators
            this.get('resignation_date').setErrors(null);
            this.get('exit_date').setErrors(null);
            this.get('hire_date').setErrors(null);
            this.get('birth_date').setErrors(null);
        } else {
            // add the validators
            this.get('resignation_date').setErrors([Validators.required]);
            this.get('exit_date').setErrors([Validators.required]);
            this.get('hire_date').setErrors([Validators.required]);
            this.get('birth_date').setErrors([Validators.required]);
        }
    }

    update(employee) {
        delete employee.password;
        delete employee.confirmPassword;
        delete employee.email;
        this.employeeService.updateEmployee(employee, this.employeeId).subscribe(
            data => {
                this.successMessage = data.message;
                this.setEmployee(data);
            },
            err => {
                const {error} = err;
                this.errorMessage = error.message;
            }
        );
    }

    resendPassword() {
        // end request to the server for resending password to the employee
        if (this.employeeId != null && this.clientId != null) {
            this.employeeService.resendPassword(this.employeeId, this.clientId).subscribe(
                () => {
                    this.showToast(NbToastStatus.SUCCESS, null, 'Password sent to the employee email !');
                },
                err => {
                    console.log(err);
                }
            );
        }
    }

    showToast(type: NbToastStatus, title: string, body: string) {
        const config = {
            status: type,
            destroyByClick: this.destroyByClick,
            duration: this.duration,
            hasIcon: this.hasIcon,
            position: this.position,
            preventDuplicates: this.preventDuplicates,
        };
        this.toastrService.show(
            body,
            `Employee Password Resend`,
            config);
    }

    ngOnChanges(changes: SimpleChanges) {
        //here we will get the clientId and employeeId on the changes object
        //Find The Employee and set the employee
        this.clientId = changes.clientId.currentValue;
        this.employeeId = changes.employeeId.currentValue;
        if (typeof this.employeeId !== 'undefined' && this.employeeId !== null) {
            this.getEmployee();
        }
        if (typeof this.clientId !== 'undefined' && this.clientId !== null) {
            this.getOrganizations();
        }
    }

}
