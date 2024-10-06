import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';
import { Response } from '../interfaces/Response.interface';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private http: HttpClient) {}

    getUsers(): Observable<Response> {
        return this.http.get<Response>(`${environment.apiUrl}users`);
    }

    userById(id: number): Observable<Response> {
        return this.http.get<Response>(`${environment.apiUrl}users/${id}`);
    }

    createUser(User: any): Observable<Response> {
        return this.http.post<Response>(`${environment.apiUrl}users`, User);
    }

    updateUser(User: any): Observable<Response> {
        return this.http.put<Response>(`${environment.apiUrl}users/${User.id}`, User);
    }
}
