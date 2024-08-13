import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response } from '../interfaces/Response.interface';

@Injectable({
    providedIn: 'root',
})
export class CitationService {
    constructor(private http: HttpClient) {}

    list(): Observable<Response> {
        return this.http.get<Response>(`${environment.apiUrl}citation`);
    }

    listQtyAvailableCitation(): Observable<Response> {
        return this.http.get<Response>(
            `${environment.apiUrl}citation/qty-available`
        );
    }

    generateCitation(data: any): Observable<Response> {
        return this.http.post<Response>(`${environment.apiUrl}citation`, data);
    }

    deleteCitation(data: any): Observable<Response> {
        return this.http.delete<Response>(
            `${environment.apiUrl}citation/${data.id}`
        );
    }

    loadQtyAvailableModulation(): Observable<Response> {
        return this.http.get<Response>(
            `${environment.apiUrl}citation/load-qty-available`
        );
    }

    generateModulationByCitation(): Observable<Response> {
        return this.http.get<Response>(
            `${environment.apiUrl}citation/generate-modulation-by-citation`);
    }
}
