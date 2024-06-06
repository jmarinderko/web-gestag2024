import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';
import { Response } from '../interfaces/Response.interface';
import { saveAs } from 'file-saver';

@Injectable({
    providedIn: 'root',
})
export class ModulationService {
    constructor(private http: HttpClient) {}

    getListLoad(): Observable<Response> {
        return this.http.get<Response>(`${environment.apiUrl}modulation/listload`);
    }

    getList(): Observable<Response> {
        return this.http.get<Response>(`${environment.apiUrl}modulation`);
    }

    getListProcess(): Observable<Response> {
        return this.http.get<Response>(`${environment.apiUrl}modulation/listprocess`);
    }

    consultModulation(data: any): Observable<Response> {
        return this.http.post<Response>(`${environment.apiUrl}modulation/consult`, data);
    }

    loadObservationsById(id: number): Observable<Response> {
        return this.http.post<Response>(`${environment.apiUrl}modulation/observations/byid`, {'id':id});
    }

    generateModulation(data: any): Observable<Response> {
        return this.http.post<Response>(`${environment.apiUrl}modulation/generateModulation`, data);
    }

    downloadExcel(filename: string) {
        return this.http.get(`${environment.apiUrl}modulation/download-excel/${filename}`, { responseType: 'blob' }).subscribe((response: Blob) => {
            saveAs(response, filename);
        });
    }

    uploadFile(file: File,id:number): Observable<Response>{
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        formData.append('id',id.toString());

        return this.http.post<Response>(
            `${environment.apiUrl}modulation/upload-excel`,
            formData
        );
    }

}