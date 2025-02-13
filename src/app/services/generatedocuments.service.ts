import { HttpClient, HttpResponse } from '@angular/common/http';
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
            `${environment.urlApiDocuments}html-to-pdf`,
            {
                html: html,
            },
            { responseType: 'blob' }
        );
    }

    excelGenerator(data: any): Observable<Blob> {
        return this.http.post(
            `${environment.urlApiDocuments}json-to-excel`,
            data,
            { responseType: 'blob' }
        );
    }

    wordGenerator(data: any): Observable<HttpResponse<Blob>> {
        return this.http.post(
            `${environment.urlApiDocuments}json-to-word`,
            data,
            { responseType: 'blob', observe: 'response' }
        );
    }
}
