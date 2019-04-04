import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LinkCategoryService} from "../../../@core/data/link-category.service";

@Component({
    selector: 'ngx-category-management',
    templateUrl: './category-management.component.html',
    styleUrls: ['./category-management.component.scss'],
})
export class CategoryManagementComponent implements OnInit {
    rows = [];
    count = 0;
    offset = 0;
    limit = 3;
    categories;

    constructor(private categoryService: LinkCategoryService, private router: Router) {
    }

    ngOnInit() {
        this.page(this.offset, this.limit);
    }

    onClickAdd() {
        this.router.navigateByUrl('/pages/links/category-management/add');
    }

    onClickEdit(id) {
        this.router.navigateByUrl('/pages/links/category-management/edit/' + id);
    }

    onClickDelete(id) {
        //find the employee name from the rows using
        const name = this.rows.find(x => x.id === id).name;
        if (confirm("Are you sure to delete " + name)) {
            this.deleteCategory(id);
        }
    }

    deleteCategory(id) {
        this.categoryService.deleteCategory(id).subscribe(
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
        this.categoryService.getCategories(offset, limit).subscribe(results => {
                this.count = results.totalItems;
                this.categories = results.categories;
                const rows = [];
                this.categories.map((category) => {
                    category.id = category._id;
                    rows.push(category);
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
