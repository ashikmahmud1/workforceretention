import {Component, OnInit} from '@angular/core';
import {RoleService} from "../../../../@core/data/role.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../../@core/data/users.service";
import {ActivatedRoute} from "@angular/router";
import {ClientService} from "../../../../@core/data/client.service";

@Component({
    selector: 'ngx-add-edit-user',
    templateUrl: './add-edit-user.component.html',
    styleUrls: ['./add-edit-user.component.scss']
})
export class AddEditUserComponent implements OnInit {

    user = {first_name: '', last_name: '', email: '', role: '', username: ''};
    roles = [];
    userId;
    initialEmailAddress;
    successMessage;
    clients;
    clientId;
    userClients = [];

    // define a employee model

    constructor(private roleService: RoleService,
                private userService: UserService,
                private route: ActivatedRoute,
                private clientService: ClientService) {
    }

    ngOnInit() {
        this.userId = this.route.snapshot.paramMap.get('id');
        if (this.userId) {
            //get the employee from the database and set to the employee
            this.getUser();
            this.findUserClients();
        }
        this.getRoles();
        this.getClients();
        this.createForm();
    }

    userForm: FormGroup;

    // validator function
    get(controlName) {
        return this.userForm.get(controlName);
    }

    createForm() {
        this.userForm = new FormGroup({
            name: new FormGroup({
                firstName: new FormControl('', Validators.required),
                lastName: new FormControl('', Validators.required)
            }),
            email: new FormControl('', [
                Validators.required,
                Validators.pattern("[^ @]*@[^ @]*")
            ]),
            username: new FormControl('',
                [Validators.required, Validators.minLength(4)]
            ),
            role: new FormControl('',
                [Validators.required]),
            client: new FormControl()
        });
        this.userForm.controls['role'].setValue('', {onlySelf: true});
    }

    getRoles() {
        this.roleService.getRoles(0, 10).subscribe(
            data => {
                this.roles = data.roles;
            },
            err => {
                console.log(err);
            }
        );
    }

    getClients() {
        this.clientService.getClients(0, 1000).subscribe(
            data => {
                this.clients = data.clients;
            },
            err => {
                console.log(err);
            },
            () => {
                console.log('completed');
            }
        );
    }

    addClient() {
        console.log(this.clientId);
    }

    findUserClients() {
        console.log(this.userId);
        this.userService.getUserClients(this.userId).subscribe(
            data => {
                console.log(data.users);
                this.userClients = data.users.clients;
            },
            err => {
                console.log(err);
            },
            () => {
                console.log('completed');
            }
        );
    }

    getUser() {
        this.userService.getUser(this.userId).subscribe(data => {
                this.setUser(data);
                //set the employee
            },
            err => {
                console.log(err);
            }
        );
    }

    createUser() {
        if (this.userForm.valid) {
            console.log('valid');
            // check if the pageId is null or not. if null then insert else update
            if (this.userId) {
                this.update();
            } else {
                this.insert();
            }
        }

    }

    setUser(data) {
        this.initialEmailAddress = data.user.email;
        this.user.email = data.user.email;
        //split username
        this.user.username = data.user.username;
        this.user.first_name = data.user.first_name;
        this.user.last_name = data.user.last_name;
        this.user.role = typeof data.user.role !== 'undefined' || data.user.role !== null ? data.user.role : '';
        this.userId = data.user._id;
        this.userClients =
            typeof data.user.clients !== 'undefined' &&
            data.user.clients !== null ?
                data.user.clients : [];
        this.get('email').disable();
    }

    insert() {
        const user = {
            first_name: this.get('name').get('firstName').value,
            last_name: this.get('name').get('lastName').value,
            email: this.get('email').value,
            username: this.get('username').value,
            role: this.get('role').value,
            clients: this.userClients
        };
        this.userService.createUser(user).subscribe(
            data => {
                this.successMessage = data.message;
                this.setUser(data);
            },
            err => {
                const {error} = err;
                this.userForm.setErrors({'message': error.message});
            }
        );
    }

    update() {
        const user = {
            first_name: this.get('name').get('firstName').value,
            last_name: this.get('name').get('lastName').value,
            role: this.get('role').value,
            username: this.get('username').value,
            clients: this.userClients
        };
        this.userService.updateUser(user, this.userId).subscribe(
            data => {
                this.successMessage = data.message;
                this.setUser(data);
            },
            err => {
                const {error} = err;
                this.userForm.setErrors({'message': error.message});
            }
        );
    }

}
