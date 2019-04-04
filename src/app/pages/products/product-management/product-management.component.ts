import {Component, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {PageService} from "../../../@core/data/page.service";

@Component({
  selector: 'ngx-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss'],
})
export class ProductManagementComponent implements OnInit {

  rows = [];
  count = 0;
  offset = 0;
  limit = 9;
  pages;


  constructor(private router: Router, private pageService: PageService) {
  }

  onClickAdd() {
    this.router.navigateByUrl('/pages/products/product-management/add');
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
    this.router.navigateByUrl('/pages/products/product-management/edit/' + id);
  }

  onClickDelete(id) {
    //find the employee name from the rows using
    const name = this.rows.find(x => x.id === id).username;
    if (confirm("Are you sure to delete " + name)) {
      this.deleteUser(id);
    }
  }

  deleteUser(id) {
    this.pageService.deletePage(id).subscribe(
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
    this.pageService.getPages(offset, limit).subscribe(results => {
          this.count = results.totalItems;
          this.pages = results.pages;
          const rows = [];
          this.pages.map((page) => {
            // Modify staticPage role
            page.id = page._id;
            rows.push(page);
          });
          this.rows = rows;

        },
        (err) => {
          console.log(err);
        }
    );
  }

}
