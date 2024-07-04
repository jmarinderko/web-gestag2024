import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { jwtDecode } from 'jwt-decode';
import { Auth } from '../interfaces/Auth.interface';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private tokenKey = 'access_token';

    constructor(private http: HttpClient) {}

    login(form: any): Observable<Auth>{
        return this.http.post<Auth>(`${environment.apiUrl}login`, form);
    }

    // Método para guardar el token en sessionStorage
    setToken(token: string): void {
        sessionStorage.setItem(this.tokenKey, token);
        this.saveUserInfoFromToken(token);
    }

    // Método para obtener el token de sessionStorage
    getToken(): string | null {
        return sessionStorage.getItem(this.tokenKey);
    }

    // Método para guardar la información del usuario en sessionStorage
    private saveUserInfoFromToken(token: string): void {
        const decodedToken = this.decodeToken(token);
        if (decodedToken && decodedToken.user) {
            sessionStorage.setItem(
                'user_info',
                JSON.stringify(decodedToken.user)
            );
        }
    }

    // Método para obtener la información del usuario desde sessionStorage
    getUserInfo(): any {
        const userInfo = sessionStorage.getItem('user_info');
        return userInfo ? JSON.parse(userInfo) : null;
    }

    // Método para decodificar el token
    private decodeToken(token: string): any {
        try {
            return jwtDecode(token);
        } catch (error) {
            console.error('Error decoding token', error);
            return null;
        }
    }

    // Método para eliminar el token y la información del usuario de sessionStorage
    clearSession(): void {
        sessionStorage.removeItem(this.tokenKey);
        sessionStorage.removeItem('user_info');
    }
}
