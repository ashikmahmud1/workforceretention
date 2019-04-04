import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LinkService} from "../../../@core/data/link.service";

@Component({
    selector: 'ngx-link-management',
    templateUrl: './link-management.component.html',
    styleUrls: ['./link-management.component.scss'],
})
export class LinkManagementComponent implements OnInit {

    rows = [];
    count = 0;
    offset = 0;
    limit = 9;
    links;


    constructor(private router: Router, private linkService: LinkService) {
    }

    onClickAdd() {
        this.router.navigateByUrl('/pages/links/link-management/add');
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
        this.router.navigateByUrl('/pages/links/link-management/edit/' + id);
    }

    onClickDelete(id) {
        //find the employee name from the rows using
        const name = this.rows.find(x => x.id === id).username;
        if (confirm("Are you sure to delete " + name)) {
            this.deleteUser(id);
        }
    }

    deleteUser(id) {
        this.linkService.deleteLink(id).subscribe(
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
        this.linkService.getLinks(offset, limit).subscribe(results => {
                this.count = results.totalItems;
                this.links = results.links;
                const rows = [];
                this.links.map((link) => {
                    // Modify link role
                    link.id = link._id;
                    link.linkUrl = link.link_url;
                    rows.push(link);
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
