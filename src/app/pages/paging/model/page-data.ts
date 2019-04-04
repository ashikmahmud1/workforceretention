import {Page} from "./page";

/**
 * An array of data with an associated staticPage object used for paging
 */
export class PagedData<T> {
    data = new Array<T>();
    page = new Page();
}