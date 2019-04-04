import {Component, OnInit} from '@angular/core';
import {StaticPageService} from "../../../../@core/data/static-page.service";
import {ActivatedRoute} from "@angular/router";
import {BoxService} from "../../../../@core/data/box.service";

@Component({
    selector: 'ngx-assign-box',
    templateUrl: './assign-box.component.html',
    styleUrls: ['./assign-box.component.scss'],
})
export class AssignBoxComponent implements OnInit {

    staticPage = {
        title: '',
        box_1: '', box_2: ''
    };
    staticPageId;
    boxes;
    successMessage;
    errorMessage;

    constructor(private staticPagService: StaticPageService,
                private route: ActivatedRoute,
                private boxService: BoxService) {
    }

    ngOnInit() {
        this.staticPageId = this.route.snapshot.paramMap.get('id');
        this.getPage();
        this.getBoxes();
    }

    update() {
        const staticPage = {
            title: this.staticPage.title,
            box_1: this.staticPage.box_1,
            box_2: this.staticPage.box_2
        };
        this.staticPagService.updateStaticPage(staticPage, this.staticPageId).subscribe(
            data => {
                this.successMessage = data.message;
                this.setPage(data);
            },
            err => {
                const {error} = err;
                this.errorMessage = error.message;
            }
        );
    }

    getPage() {
        this.staticPagService.getStaticPage(this.staticPageId).subscribe(data => {
                this.setPage(data);
            },
            err => {
                const {error} = err;
                this.errorMessage = error.message;
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
                this.errorMessage = error.message;
            }
        );
    }

    setPage(data) {

        this.staticPage.title = data.staticPage.title;
        this.staticPage.box_1 = data.staticPage.box_1;
        this.staticPage.box_2 = data.staticPage.box_2;

        this.staticPageId = data.staticPage._id;

    }

}
