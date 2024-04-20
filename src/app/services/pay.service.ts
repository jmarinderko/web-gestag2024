import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';
import { Response } from '../interfaces/Response.interface';

@Injectable({
    providedIn: 'root',
})
export class PayService {
    constructor(private http: HttpClient) {}

    getPays(): Observable<Response> {
        return this.http.get<Response>(`${environment.apiUrl}pay`);
    }

    payById(id: number): Observable<Response> {
        return this.http.get<Response>(`${environment.apiUrl}pay/${id}`);
    }

    getPaymentBoxById(id: number): Observable<Response> {
        return this.http.get<Response>(`${environment.apiUrl}paymentbox/${id}`);
    }
}
