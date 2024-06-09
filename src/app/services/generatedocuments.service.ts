import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class GeneratedocumentsService {
    constructor(private http: HttpClient) {}


    downloadLetter(html: string): Observable<Blob> {
        return this.http.post(
            `${environment.urlApiDocuments}pdfconvert`,
            {
                HtmlContent: html,
            },
            { responseType: 'blob' }
        );
    }

    excelGenerator(data: any): Observable<Blob> {
        return this.http.post(
            `${environment.urlApiDocuments}excelgenerate`,
            data,
            { responseType: 'blob' }
        );
    }

    wordGenerator(data: any): Observable<Blob> {
        return this.http.post(
            `${environment.urlApiDocuments}wordgenerate`,
            data,
            { responseType: 'blob' }
        );
    }
}
