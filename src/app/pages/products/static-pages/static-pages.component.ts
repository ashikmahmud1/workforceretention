import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {StaticPageService} from "../../../@core/data/static-page.service";

@Component({
  selector: 'ngx-static-pages',
  templateUrl: './static-pages.component.html',
  styleUrls: ['./static-pages.component.scss'],
})
export class StaticPagesComponent implements OnInit {

  rows = [];
  count = 0;
  offset = 0;
  limit = 9;
  staticPages;

  constructor(private router: Router, private staticPageService: StaticPageService) {
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
    this.router.navigateByUrl('/pages/products/static-pages/edit/' + id);
  }

  page(offset, limit) {
    this.staticPageService.getStaticPages(offset, limit).subscribe(results => {
          this.count = results.totalItems;
          this.staticPages = results.staticPages;
          console.log(results);
          const rows = [];
          this.staticPages.map((staticPage) => {
            // Modify staticPage role
            staticPage.id = staticPage._id;
            rows.push(staticPage);
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
