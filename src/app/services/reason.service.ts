import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';
import { Response } from '../interfaces/Response.interface';

@Injectable({
    providedIn: 'root',
})
export class ReasonService {
    constructor(private http: HttpClient) {}

    getReasons(): Observable<Response> {
        return this.http.get<Response>(`${environment.apiUrl}reasons`);
    }

    reasonById(id: number): Observable<Response> {
        return this.http.get<Response>(`${environment.apiUrl}reasons/${id}`);
    }

    createReason(reason: any): Observable<Response> {
        return this.http.post<Response>(`${environment.apiUrl}reasons`, reason);
    }

    updateReason(reason: any): Observable<Response> {
        return this.http.put<Response>(`${environment.apiUrl}reasons/${reason.id}`, reason);
    }

    getReasonsPay(): Observable<Response> {
        return this.http.get<Response>(`${environment.apiUrl}reasons/pay/list`);
    }
}
