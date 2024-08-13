import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const excludedUrls = [
            `${environment.urlApiDocuments}pdfconvert`,
            `${environment.urlApiDocuments}excelgenerate`,
            `${environment.urlApiDocuments}wordgenerate`,
        ];

        const isExcluded = excludedUrls.some((url) => req.url.includes(url));

        if (isExcluded) {
            return next.handle(req);
        }

        const token = this.authService.getToken();

        if (token) {
            const cloned = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`),
            });
            return next.handle(cloned);
        } else {
            return next.handle(req);
        }
    }
}
