import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ArticleService} from "../../../@core/data/article.service";

@Component({
    selector: 'ngx-article-management',
    templateUrl: './article-management.component.html',
    styleUrls: ['./article-management.component.scss'],
})
export class ArticleManagementComponent implements OnInit {

    rows = [];
    count = 0;
    offset = 0;
    limit = 9;
    articles;
    constructor(private router: Router, private articleService: ArticleService) {
    }

    onClickAdd() {
        this.router.navigateByUrl('/pages/articles/article-management/add');
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
        this.router.navigateByUrl('/pages/articles/article-management/edit/' + id);
    }

    onClickDelete(id) {
        //find the employee name from the rows using
        const name = this.rows.find(x => x.id === id).username;
        if (confirm("Are you sure to delete " + name)) {
            this.deleteUser(id);
        }
    }

    deleteUser(id) {
        this.articleService.deleteArticle(id).subscribe(
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
        this.articleService.getArticles(offset, limit).subscribe(results => {
                this.count = results.totalItems;
                this.articles = results.articles;
                const rows = [];
                this.articles.map((article) => {
                    // Modify article role
                    article.id = article._id;
                    article.linkUrl = article.link_url;
                    rows.push(article);
                });
                this.rows = rows;

            },
            (err) => {
                console.log(err);
            }
        );
    }

}
