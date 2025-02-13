import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response } from '../interfaces/Response.interface';

@Injectable({
    providedIn: 'root',
})
export class HomeService {
    constructor(private http: HttpClient) {}

    getInfoCardmun(): Observable<Response> {
        return this.http.get<Response>(`${environment.apiUrl}homemun`);
    }

    getInfoCardjpl(): Observable<Response> {
        return this.http.get<Response>(`${environment.apiUrl}homejpl`);
    }

    getEntities(): Observable<Response> {
        return this.http.get<Response>(`${environment.apiUrl}entities`);
    }
}
