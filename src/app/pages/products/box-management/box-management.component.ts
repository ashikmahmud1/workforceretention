import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BoxService} from "../../../@core/data/box.service";

@Component({
  selector: 'ngx-box-management',
  templateUrl: `./box-management.component.html`,
  styleUrls: ['./box-management.component.scss'],
})
export class BoxManagementComponent implements OnInit {
  rows = [];
  count = 0;
  offset = 0;
  limit = 9;
  boxes = [];

  constructor(private router: Router, private boxService: BoxService) {
  }

  onClickAdd() {
    this.router.navigateByUrl('/pages/products/box-management/add');
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
    this.router.navigateByUrl('/pages/products/box-management/edit/' + id);
  }

  onClickDelete(id) {
    //find the employee name from the rows using
    const name = this.rows.find(x => x.id === id).username;
    if (confirm("Are you sure to delete " + name)) {
      this.deleteUser(id);
    }
  }

  deleteUser(id) {
    this.boxService.deleteBox(id).subscribe(
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
    this.boxService.getBoxes(offset, limit).subscribe(results => {
          this.count = results.totalItems;
          this.boxes = results.boxes;
          const rows = [];
          this.boxes.map((box) => {
            // Modify box role
            box.id = box._id;
            rows.push(box);
            console.log(box);
          });
          this.rows = rows;

        },
        (err) => {
          console.log(err);
        }
    );
  }

}
