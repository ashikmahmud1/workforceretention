import {Component, OnInit} from '@angular/core';
import {TinyMceService} from "../../../../@core/data/tiny-mce.service";
import {LinkCategoryService} from "../../../../@core/data/link-category.service";
import {LinkService} from "../../../../@core/data/link.service";
import {NbTokenService} from "@nebular/auth";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'ngx-add-edit-link',
    templateUrl: './add-edit-link.component.html',
    styleUrls: ['./add-edit-link.component.scss']
})
export class AddEditLinkComponent implements OnInit {

    linkId;
    link;
    user;
    categories;
    successMessage;
    errorMessage;

    constructor(private tinyMCEService: TinyMceService,
                private linkCategoryService: LinkCategoryService,
                private linkService: LinkService,
                private tokenService: NbTokenService,
                private route: ActivatedRoute) {
        this.link = {title: '', link_url: '', description: '', category: ''};
    }

    getEditorContent($event) {
        this.link.description = $event;
        console.log($event);
    }

    setEditorContent(content) {
        this.tinyMCEService.contentChange.next(content);
    }

    ngOnInit() {
        this.linkId = this.route.snapshot.paramMap.get('id');
        if (this.linkId) {
            //get the employee from the database and set to the employee
            this.getLink();
        }
        //get the employee from the localStorage
        // call the refresh token here
        this.tokenService.get()
            .subscribe(token => {
                this.user = token.getPayload();
            });
        this.getLinkCategories();
    }

    getLink() {
        this.linkService.getLink(this.linkId).subscribe(
            data => {
                this.setLink(data);
            },
            err => {
                console.log(err);
            }
        );
    }

    createLink() {
        console.log(this.link);
        // get the employee from the localstorage
        const link = {
            title: this.link.title,
            link_url: this.link.link_url,
            description: this.link.description,
            category: this.link.category
        };
        if (this.linkId) {
            this.update(link);
        } else {
            this.insert(link);
        }
    }

    insert(link) {
        this.linkService.createLink(link, this.user._id).subscribe(
            data => {
                this.successMessage = data.message;
                this.setLink(data);
            },
            err => {
                const {error} = err;
                this.errorMessage = error.message;
            }
        );
    }

    update(link) {
        this.linkService.updateLink(link, this.linkId).subscribe(
            data => {
                this.successMessage = data.message;
                this.setLink(data);
            },
            err => {
                const {error} = err;
                this.errorMessage = error.message;
            }
        );
    }

    setLink(data) {
        this.link.title = data.link.title;
        this.link.description = data.link.description;
        this.link.link_url = data.link.link_url;
        this.link.category = data.link.category;

        this.setEditorContent(this.link.description);

    }

    getLinkCategories() {
        this.linkCategoryService.getCategories(0, 1000).subscribe(
            data => {
                this.categories = data.categories;
            }
        );
    }

}
