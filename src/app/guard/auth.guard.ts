import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Ajusta la ruta según sea necesario
import { jwtDecode } from 'jwt-decode';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        const token = this.authService.getToken();
        if (token && !this.isTokenExpired(token)) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }

    private isTokenExpired(token: string): boolean {
        const expiry = (jwtDecode(token) as any).exp;
        return Math.floor(new Date().getTime() / 1000) >= expiry;
    }
}
