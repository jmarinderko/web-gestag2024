import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';
import { Response } from '../interfaces/Response.interface';
import { Module, Role } from '../interfaces/User.interface';

@Injectable({
    providedIn: 'root',
})
export class RmntpService {
    constructor(private http: HttpClient) {}

    listbymonthandyear(): Observable<Response> {
        return this.http.get<Response>(
            `${environment.apiUrl}rmntp/listbymonthandyear`
        );
    }
    listAll(): Observable<Response> {
        return this.http.get<Response>(`${environment.apiUrl}rmntp/listall`);
    }
    create(data: any,qty:number): Observable<Response> {
        return this.http.post<Response>(`${environment.apiUrl}rmntp/create`, {
            data,
            qty
        });
    }

    downloadFile(item: any): Observable<any> {
        return this.http.get(
            `${environment.apiUrl}rmntp/downloadFile/${item.id}`,
            {
                responseType: 'blob',
                observe: 'response',
            }
        );
    }
}
