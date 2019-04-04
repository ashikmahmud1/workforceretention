import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CountryService} from "../../../../@core/data/country.service";
import {IndustryService} from "../../../../@core/data/industry.service";
import {NbTokenService} from "@nebular/auth";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {TinyMceService} from "../../../../@core/data/tiny-mce.service";
import {BoxService} from "../../../../@core/data/box.service";
import {PageService} from "../../../../@core/data/page.service";

@Component({
    selector: 'ngx-add-edit-product',
    templateUrl: './add-edit-product.component.html',
    styleUrls: ['./add-edit-product.component.scss'],
})
export class AddEditProductComponent implements OnInit {

    // All the staticPage fields should declare here;
    // name [Input Box]
    // Image [Choose File]
    // workforce [Dropdown] Number of Employees
    // staticPage industry [dropdown]
    // staticPage country [Dropdown], staticPage state [Dropdown, Input box],
    // staticPage products [Dropdown], aggregate_reports [Dropdown], staticPage turnover[Input Box],
    // org_mgt [Dropdown]
    page = {
        title: '', page_text: '', menu_title: '',
        home_text: '', is_home: '0',
        box_1: '', box_2: '', box_3: '',
    };
    pageId;
    boxes;
    successMessage;

    constructor(private route: ActivatedRoute,
                private countryService: CountryService,
                private industryService: IndustryService,
                private tokenService: NbTokenService,
                private router: Router,
                private tinyMCEService: TinyMceService,
                private boxService: BoxService,
                private pageService: PageService) {
    }

    ngOnInit() {
        this.pageId = this.route.snapshot.paramMap.get('id');
        if (this.pageId) {
            //get the employee from the database and set to the employee
            this.getPage();
        }
        this.getBoxes();
        this.createForm();
    }

    pageForm: FormGroup;

    // control reference function
    get(controlName) {
        return this.pageForm.get(controlName);
    }

    onClickBoxes() {
        this.router.navigateByUrl('/pages/products/box-management');
    }

    createForm() {
        this.pageForm = new FormGroup({
            title: new FormControl('', Validators.required),
            menu_title: new FormControl('', Validators.required),
            is_home: new FormControl(),
            box_1: new FormControl('', Validators.required),
            box_2: new FormControl('', Validators.required),
            box_3: new FormControl('', Validators.required),
        });
    }

    getPageText($event) {
        this.page.page_text = $event;
    }

    getHomeText($event) {
        this.page.home_text = $event;
    }

    setEditorContent(page_text) {
        //this is used for set the page_text;
        this.tinyMCEService.contentChange.next(page_text);
    }

    setSimpleEditorContent(home_text) {
        //This is used for set the home_text
        this.tinyMCEService.simpleTinyMceContentChange.next(home_text);
    }

    createPage() {
        if (this.pageForm.valid) {
            //create a new staticPage object instance
            const page = {
                title: this.get('title').value,
                menu_title: this.get('menu_title').value,
                home_text: this.page.home_text,
                page_text: this.page.page_text,
                box_1: this.get('box_1').value,
                box_2: this.get('box_2').value,
                box_3: this.get('box_3').value,
                is_home: this.get('is_home').value,
                menu_order: 0
            };
            if (!this.pageId) {
                this.insert(page);
            } else {
                this.update(page);
            }
        }
    }

    insert(page) {
        this.pageService.createPage(page).subscribe(
            data => {
                this.successMessage = data.message;
                this.setPage(data);
            },
            err => {
                const {error} = err;
                this.pageForm.setErrors({'message': error.message});
            }
        );
    }

    update(page) {
        this.pageService.updatePage(page, this.pageId).subscribe(
            data => {
                this.successMessage = data.message;
                this.setPage(data);
            },
            err => {
                const {error} = err;
                this.pageForm.setErrors({'message': error.message});
            }
        );
    }

    getPage() {
        this.pageService.getPage(this.pageId).subscribe(data => {
                this.setPage(data);
            },
            err => {
                const {error} = err;
                this.pageForm.setErrors({'message': error.message});
            }
        );
    }

    getBoxes() {
        this.boxService.getBoxes(0, 1000).subscribe(
            data => {
                this.boxes = data.boxes;
            },
            err => {
                const {error} = err;
                this.pageForm.setErrors({'message': error.message});
            }
        );
    }

    setPage(data) {
        this.page.page_text = data.page.page_text;
        this.page.home_text = data.page.home_text;
        this.page.is_home = data.page.is_home;
        this.page.title = data.page.title;
        this.page.menu_title = data.page.menu_title;
        this.page.box_1 = data.page.box_1;
        this.page.box_2 = data.page.box_2;
        this.page.box_3 = data.page.box_3;

        this.setEditorContent(this.page.page_text);
        this.setSimpleEditorContent(this.page.home_text);
        // Finally set the Id of the Page
        this.pageId = data.page._id;

    }

}
