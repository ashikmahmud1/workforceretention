import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {TinyMceService} from "../../../../@core/data/tiny-mce.service";
import {BoxService} from "../../../../@core/data/box.service";

@Component({
    selector: 'ngx-add-edit-box',
    templateUrl: './add-edit-box.component.html',
    styleUrls: ['./add-edit-box.component.scss'],
})
export class AddEditBoxComponent implements OnInit {

    // All the staticPage fields should declare here;
    // name [Input Box]
    // Image [Choose File]
    // workforce [Dropdown] Number of Employees
    // staticPage industry [dropdown]
    // staticPage country [Dropdown], staticPage state [Dropdown, Input box],
    // staticPage products [Dropdown], aggregate_reports [Dropdown], staticPage turnover[Input Box],
    // org_mgt [Dropdown]
    box = {
        title: '', description: "", large_image: '', thumb_image: ''
    };
    user;
    boxId;
    successMessage;

    constructor(private route: ActivatedRoute,
                private boxService: BoxService,
                private router: Router,
                private tinyMCEService: TinyMceService) {
    }

    ngOnInit() {
        this.boxId = this.route.snapshot.paramMap.get('id');
        if (this.boxId) {
            //get the employee from the database and set to the employee
            this.getBox();
        }
        this.createForm();
    }

    boxForm: FormGroup;

    // control reference function
    get(controlName) {
        return this.boxForm.get(controlName);
    }


    createForm() {
        this.boxForm = new FormGroup({
            title: new FormControl('', Validators.required),
            description: new FormControl(),
            large_image: new FormControl(),
            thumb_image: new FormControl()
        });
    }

    createBox() {
        if (this.boxForm.valid) {
            //create a new staticPage object instance
            const box = {
                title: this.get('title').value,
                description: this.box.description,
            };
            if (!this.boxId) {
                this.insert(box);
            } else {
                this.update(box);
            }
        }
    }

    insert(box) {
        this.boxService.createBox(box).subscribe(
            data => {
                this.successMessage = data.message;
                this.setBox(data);
            },
            err => {
                const {error} = err;
                this.boxForm.setErrors({'message': error.message});
            }
        );
    }

    update(box) {
        this.boxService.updateBox(box, this.boxId).subscribe(
            data => {
                this.successMessage = data.message;
                this.setBox(data);
            },
            err => {
                const {error} = err;
                this.boxForm.setErrors({'message': error.message});
                console.log(err);
            }
        );
    }

    getBox() {
        this.boxService.getBox(this.boxId).subscribe(data => {
                this.setBox(data);
            },
            err => {
                console.log(err);
            }
        );
    }

    getEditorContent($event) {
        this.box.description = $event;
    }

    setEditorContent(content) {
        this.tinyMCEService.contentChange.next(content);
    }

    setBox(data) {
        this.box.title = data.box.title;
        this.box.description = data.box.description;
        this.box.large_image = data.box.large_image;
        // Finally set the Id of the Client

        this.box.thumb_image = data.box.thumb_image;
        this.setEditorContent(this.box.description);
        this.boxId = data.box._id;
    }
}
