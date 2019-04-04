import {Component, OnDestroy, AfterViewInit, Output, EventEmitter, ElementRef, OnInit} from '@angular/core';
import {TinyMceService} from "../../../@core/data/tiny-mce.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'ngx-simple-tiny-mce',
    template: '',
})
export class SimpleTinyMCEComponent implements OnInit, OnDestroy, AfterViewInit {

    @Output() editorKeyup = new EventEmitter<any>();
    tinyMCESubscription: Subscription;


    editor: any;

    constructor(private host: ElementRef, private tinyMCEService: TinyMceService) {
    }

    ngAfterViewInit() {
        tinymce.init({
            selector: '',
            target: this.host.nativeElement,
            plugins: ['link', 'paste', 'table'],
            skin_url: 'assets/skins/lightgray',
            setup: editor => {
                this.editor = editor;
                editor.on('keyup change', () => {
                    this.editorKeyup.emit(editor.getContent());
                });
            },
            height: '320',
        });
    }

    ngOnDestroy() {
        tinymce.remove(this.editor);
        this.tinyMCESubscription.unsubscribe();
    }

    ngOnInit() {
        this.tinyMCESubscription = this.tinyMCEService.simpleTinyMceContentChange.subscribe(
            content => {
                this.editor.setContent(content);
                this.editorKeyup.emit(this.editor.getContent());
            }
        );
    }
}
