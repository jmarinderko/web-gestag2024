import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';
import { Response } from '../interfaces/Response.interface';

@Injectable({
    providedIn: 'root',
})
export class TransittaxesService {
    constructor(private http: HttpClient) {}

    getTransitTaxes(): Observable<Response> {
        return this.http.get<Response>(`${environment.apiUrl}transittaxes`);
    }

    consultTransittaxes(data: any): Observable<Response> {
        return this.http.post<Response>(`${environment.apiUrl}transittaxes/consult`, data);
    }

    loadObservationsById(id: number): Observable<Response> {
        return this.http.post<Response>(`${environment.apiUrl}transittaxes/observations/byid`, {'id':id});
    }
}
