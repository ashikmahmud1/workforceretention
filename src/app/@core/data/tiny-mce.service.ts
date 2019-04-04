import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable()
export class TinyMceService {
    contentChange = new Subject<string>();
    simpleTinyMceContentChange = new Subject<string>();
}
