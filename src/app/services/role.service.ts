import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';
import { Response } from '../interfaces/Response.interface';
import { Module, Role } from '../interfaces/User.interface';

@Injectable({
    providedIn: 'root',
})
export class RoleService {
    constructor(private http: HttpClient) {}

    getRoles(): Observable<Response> {
        return this.http.get<Response>(`${environment.apiUrl}roles`);
    }

    RoleById(id: number): Observable<Response> {
        return this.http.get<Response>(`${environment.apiUrl}roles/${id}`);
    }

    createRole(Role: any): Observable<Response> {
        return this.http.post<Response>(`${environment.apiUrl}roles`, Role);
    }

    updateRole(Role: any): Observable<Response> {
        return this.http.put<Response>(`${environment.apiUrl}roles/${Role.id}`, Role);
    }

    deleteRole(id: number): Observable<Response> {
        return this.http.delete<Response>(`${environment.apiUrl}roles/${id}`);
    }

    getModules(): Observable<Response> {
        return this.http.get<Response>(`${environment.apiUrl}modules`);
    }

    updateModuleRole(rol: Role, modules: Module[]): Observable<Response> {
        return this.http.post<Response>(
            `${environment.apiUrl}modules/updateModuleRol/${rol.id}`,
            {'modulos':modules}
        );
    }

    // getMenu(): Observable<ResponseLoginToken> {
    //     return this.http.post<ResponseLoginToken>(this.baseUrl + "/auth/getmenu/",{});
    // }

}
