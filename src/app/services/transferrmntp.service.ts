import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response } from '../interfaces/Response.interface';

@Injectable({
    providedIn: 'root',
})
export class TransferRmntpService {
    constructor(private http: HttpClient) {}

    listTransferAvailable(): Observable<Response> {
        return this.http.get<Response>(`${environment.apiUrl}transfer`);
    }

    listPending(): Observable<Response> {
        return this.http.get<Response>(
            `${environment.apiUrl}transfer/listpending`
        );
    }

    listCompleted(): Observable<Response> {
        return this.http.get<Response>(
            `${environment.apiUrl}transfer/listcompleted`
        );
    }
    loadCourt(): Observable<Response> {
        return this.http.get<Response>(
            `${environment.apiUrl}transfer/loadcourt`
        );
    }

    loadbymonthandyeargroupday(
        month: string,
        year: string
    ): Observable<Response> {
        return this.http.post<Response>(
            `${environment.apiUrl}transfer/loadbymonthandyeargroupday`,
            { mes: month, anio: year }
        );
    }

    consultByForm(form: any): Observable<Response> {
        return this.http.post<Response>(
            `${environment.apiUrl}transfer/consultbyform`,
            form
        );
    }

    generateByPeriod(data: any): Observable<Response> {
        return this.http.post<Response>(
            `${environment.apiUrl}transfer/generatebyperiod`,
            data
        );
    }

    generateByForm(data: any): Observable<Response> {
        return this.http.post<Response>(
            `${environment.apiUrl}transfer/generatebyform`,
            data
        );
    }

    generatebyday(data: any): Observable<Response> {
        return this.http.post<Response>(
            `${environment.apiUrl}transfer/generatebyday`,
            data
        );
    }

    consultmemo(id: any): Observable<Response> {
        return this.http.get<Response>(
            `${environment.apiUrl}transfer/consultmemo/${id}`
        );
    }

    reception(id: number, dateReception:any): Observable<Response> {
        return this.http.post<Response>(
            `${environment.apiUrl}transfer/reception`,
            { id, dateReception }
        );
    }
}
