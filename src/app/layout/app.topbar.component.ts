import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent {
    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;
    authService = inject(AuthService);
    user: any = {};
    constructor(public layoutService: LayoutService, private router: Router) {
        this.user = this.authService.getUserInfo();
    }

    logout() {
        this.authService.clearSession();
        this.router.navigate(['/login']);
    }
}
