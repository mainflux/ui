// service
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

@Injectable()
export class UrlHelperService {
    constructor(private http: HttpClient) {
    }

        // get(url: string): Observable<any> {
        //     return new Observable((observer: Subscriber<any>) => {
        //         let objectUrl: string = null;

        //         this.http
        //             .get(url, {observe: 'response', responseType: 'blob'})
        //             .subscribe(m => {
        //                 objectUrl = URL.createObjectURL(m);
        //                 observer.next(objectUrl);
        //             });

        //         return () => {
        //             if (objectUrl) {
        //                 URL.revokeObjectURL(objectUrl);
        //                 objectUrl = null;
        //             }
        //         };
        //     });
        // }
}
