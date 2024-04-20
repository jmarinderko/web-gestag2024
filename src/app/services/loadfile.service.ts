import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response } from '../interfaces/Response.interface';

@Injectable({
    providedIn: 'root',
})
export class LoadFileService {
    constructor(private http: HttpClient) {}

    getloadFile(): Observable<Response> {
        return this.http.get<Response>(`${environment.apiUrl}loadfile`);
    }

    postloadFile(data: any): Observable<Response> {
        return this.http.post<Response>(`${environment.apiUrl}loadfile`, data);
    }
}
