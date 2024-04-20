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

    getInfoCard(): Observable<Response> {
        return this.http.get<Response>(`${environment.apiUrl}home`);
    }
}
