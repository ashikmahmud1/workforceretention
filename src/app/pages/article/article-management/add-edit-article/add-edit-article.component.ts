import {Component, OnInit} from '@angular/core';
import {NbDateService} from '@nebular/theme';
import {TinyMceService} from "../../../../@core/data/tiny-mce.service";
import {NbTokenService} from "@nebular/auth";
import {ActivatedRoute} from "@angular/router";
import {ArticleService} from "../../../../@core/data/article.service";
import {BoxService} from "../../../../@core/data/box.service";


@Component({
    selector: 'ngx-add-edit-article',
    templateUrl: './add-edit-article.component.html',
    styleUrls: ['./add-edit-article.component.scss'],
})
export class AddEditArticleComponent implements OnInit {

    min: Date;
    max: Date;
    article;
    articleId;
    user;
    boxes;
    successMessage;
    errorMessage;

    constructor(protected dateService: NbDateService<Date>,
                private tinyMCEService: TinyMceService,
                private tokenService: NbTokenService,
                private route: ActivatedRoute,
                private articleService: ArticleService,
                private boxService: BoxService) {
        this.article = {
            title: '', subtitle: '',
            author: '', keywords: '',
            description: '', order: 0,
            box_1: '', box_2: '', box_3: ''
        };
        this.min = this.dateService.addDay(this.dateService.today(), -5);
        this.max = this.dateService.addDay(this.dateService.today(), 5);
    }

    ngOnInit() {
        this.articleId = this.route.snapshot.paramMap.get('id');
        if (this.articleId) {
            //get the employee from the database and set to the employee
            this.getArticle();
        }
        //get the employee from the localStorage
        // call the refresh token here
        this.tokenService.get()
            .subscribe(token => {
                this.user = token.getPayload();
            });
        this.getBoxes();
    }

    getBoxes() {
        this.boxService.getBoxes(0, 1000).subscribe(
            data => {
                this.boxes = data.boxes;
            },
            err => {
                console.log(err);
            }
        );
    }

    getArticle() {
        this.articleService.getArticle(this.articleId).subscribe(
            data => {
                this.setArticle(data);
            },
            err => {
                console.log(err);
            }
        );
    }

    createArticle() {
        // get the employee from the localstorage
        const article = {
            title: this.article.title,
            subtitle: this.article.subtitle,
            author: this.article.author,
            keywords: this.article.keywords,
            description: this.article.description,
            order: this.article.order,
            box_1 : this.article.box_1,
            box_2: this.article.box_2,
            box_3: this.article.box_3
        };
        if (this.articleId) {
            this.update(article);
        } else {
            this.insert(article);
        }
    }

    insert(article) {
        this.articleService.createArticle(article, this.user._id).subscribe(
            data => {
                this.successMessage = data.message;
                this.setArticle(data);
            },
            err => {
                const {error} = err;
                this.errorMessage = error.message;
            }
        );
    }

    update(article) {
        this.articleService.updateArticle(article, this.articleId).subscribe(
            data => {
                this.successMessage = data.message;
                this.setArticle(data);
            },
            err => {
                const {error} = err;
                this.errorMessage = error.message;
            }
        );
    }

    getEditorContent($event) {
        this.article.description = $event;
    }

    setEditorContent(content) {
        this.tinyMCEService.contentChange.next(content);
    }

    setArticle(data) {
        this.article.title = data.article.title;
        this.article.subtitle = data.article.subtitle;
        this.article.author = data.article.author;
        this.article.keywords = data.article.keywords;
        this.article.order = data.article.order;
        this.article.description = data.article.description;
        this.article.box_1 = data.article.box_1;
        this.article.box_2 = data.article.box_2;
        this.article.box_3 = data.article.box_3;

        this.setEditorContent(this.article.description);
    }
}
