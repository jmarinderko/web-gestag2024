import { inject, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { User } from '../interfaces/User.interface';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
    model: any[] = [];
    user: User = null;
    authService = inject(AuthService);
    userService = inject(UserService);
    constructor(public layoutService: LayoutService) {}

    ngOnInit() {
        // this.model = [
        //     {
        //         label: 'Home',
        //         items: [
        //             {
        //                 label: 'Dashboard',
        //                 icon: 'pi pi-fw pi-home',
        //                 routerLink: ['/'],
        //             },
        //             {
        //                 label: 'Consultas',
        //                 icon: 'pi pi-fw pi-home',
        //                 routerLink: ['/transittaxes'],
        //             },
        //             {
        //                 label: 'Carga de Archivos',
        //                 icon: 'pi pi-fw pi-home',
        //                 routerLink: ['/loadfile'],
        //             },
        //             {
        //                 label: 'Modulación',
        //                 icon: 'pi pi-fw pi-home',
        //                 routerLink: ['/modulation'],
        //             },
        //             {
        //                 label: 'Cartas',
        //                 icon: 'pi pi-fw pi-home',
        //                 routerLink: ['/letter'],
        //             },
        //             {
        //                 label: 'Denuncios',
        //                 icon: 'pi pi-fw pi-home',
        //                 routerLink: ['/transfer'],
        //             },
        //             {
        //                 label: 'Citaciones',
        //                 icon: 'pi pi-fw pi-home',
        //                 routerLink: ['/citation'],
        //             },
        //             {
        //                 label: 'Razones',
        //                 icon: 'pi pi-fw pi-home',
        //                 routerLink: ['/reason'],
        //             },
        //             {
        //                 label: 'Usuarios',
        //                 icon: 'pi pi-fw pi-home',
        //                 routerLink: ['/users'],
        //             },
        //             {
        //                 label: 'Rol',
        //                 icon: 'pi pi-fw pi-home',
        //                 routerLink: ['/rol'],
        //             },
        //         ],
        //     },
        //     // {
        //     //     label: 'UI Components',
        //     //     items: [
        //     //         { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
        //     //         { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
        //     //         { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', routerLink: ['/uikit/floatlabel'] },
        //     //         { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/uikit/invalidstate'] },
        //     //         { label: 'Button', icon: 'pi pi-fw pi-box', routerLink: ['/uikit/button'] },
        //     //         { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
        //     //         { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
        //     //         { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
        //     //         { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
        //     //         { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
        //     //         { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
        //     //         { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'], routerLinkActiveOptions: { paths: 'subset', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' } },
        //     //         { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
        //     //         { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
        //     //         { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
        //     //         { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] }
        //     //     ]
        //     // },
        //     // {
        //     //     label: 'Prime Blocks',
        //     //     items: [
        //     //         { label: 'Free Blocks', icon: 'pi pi-fw pi-eye', routerLink: ['/blocks'], badge: 'NEW' },
        //     //         { label: 'All Blocks', icon: 'pi pi-fw pi-globe', url: ['https://www.primefaces.org/primeblocks-ng'], target: '_blank' },
        //     //     ]
        //     // },
        //     // {
        //     //     label: 'Utilities',
        //     //     items: [
        //     //         { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', routerLink: ['/utilities/icons'] },
        //     //         { label: 'PrimeFlex', icon: 'pi pi-fw pi-desktop', url: ['https://www.primefaces.org/primeflex/'], target: '_blank' },
        //     //     ]
        //     // },
        //     // {
        //     //     label: 'Pages',
        //     //     icon: 'pi pi-fw pi-briefcase',
        //     //     items: [
        //     //         {
        //     //             label: 'Landing',
        //     //             icon: 'pi pi-fw pi-globe',
        //     //             routerLink: ['/landing']
        //     //         },
        //     //         {
        //     //             label: 'Auth',
        //     //             icon: 'pi pi-fw pi-user',
        //     //             items: [
        //     //                 {
        //     //                     label: 'Login',
        //     //                     icon: 'pi pi-fw pi-sign-in',
        //     //                     routerLink: ['/auth/login']
        //     //                 },
        //     //                 {
        //     //                     label: 'Error',
        //     //                     icon: 'pi pi-fw pi-times-circle',
        //     //                     routerLink: ['/auth/error']
        //     //                 },
        //     //                 {
        //     //                     label: 'Access Denied',
        //     //                     icon: 'pi pi-fw pi-lock',
        //     //                     routerLink: ['/auth/access']
        //     //                 }
        //     //             ]
        //     //         },
        //     //         {
        //     //             label: 'Crud',
        //     //             icon: 'pi pi-fw pi-pencil',
        //     //             routerLink: ['/pages/crud']
        //     //         },
        //     //         {
        //     //             label: 'Timeline',
        //     //             icon: 'pi pi-fw pi-calendar',
        //     //             routerLink: ['/pages/timeline']
        //     //         },
        //     //         {
        //     //             label: 'Not Found',
        //     //             icon: 'pi pi-fw pi-exclamation-circle',
        //     //             routerLink: ['/notfound']
        //     //         },
        //     //         {
        //     //             label: 'Empty',
        //     //             icon: 'pi pi-fw pi-circle-off',
        //     //             routerLink: ['/pages/empty']
        //     //         },
        //     //     ]
        //     // },
        //     // {
        //     //     label: 'Hierarchy',
        //     //     items: [
        //     //         {
        //     //             label: 'Submenu 1', icon: 'pi pi-fw pi-bookmark',
        //     //             items: [
        //     //                 {
        //     //                     label: 'Submenu 1.1', icon: 'pi pi-fw pi-bookmark',
        //     //                     items: [
        //     //                         { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
        //     //                         { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
        //     //                         { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
        //     //                     ]
        //     //                 },
        //     //                 {
        //     //                     label: 'Submenu 1.2', icon: 'pi pi-fw pi-bookmark',
        //     //                     items: [
        //     //                         { label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }
        //     //                     ]
        //     //                 },
        //     //             ]
        //     //         },
        //     //         {
        //     //             label: 'Submenu 2', icon: 'pi pi-fw pi-bookmark',
        //     //             items: [
        //     //                 {
        //     //                     label: 'Submenu 2.1', icon: 'pi pi-fw pi-bookmark',
        //     //                     items: [
        //     //                         { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
        //     //                         { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' },
        //     //                     ]
        //     //                 },
        //     //                 {
        //     //                     label: 'Submenu 2.2', icon: 'pi pi-fw pi-bookmark',
        //     //                     items: [
        //     //                         { label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' },
        //     //                     ]
        //     //                 },
        //     //             ]
        //     //         }
        //     //     ]
        //     // },
        //     // {
        //     //     label: 'Get Started',
        //     //     items: [
        //     //         {
        //     //             label: 'Documentation', icon: 'pi pi-fw pi-question', routerLink: ['/documentation']
        //     //         },
        //     //         {
        //     //             label: 'View Source', icon: 'pi pi-fw pi-search', url: ['https://github.com/primefaces/sakai-ng'], target: '_blank'
        //     //         }
        //     //     ]
        //     // }
        // ];

        this.user = this.authService.getUserInfo();
        // this.userService.findModulesByUser(this.user.id).subscribe((response) => {
        //     this.user.modules = response.data;
        // });

        // console.log(this.user);
        this.model = [
            {
                label: 'Home',
                items: this.user.modules
                    .filter((module: any) => module.level === 1)
                    // .sort((a: any, b: any) => a.position - b.position)
                    .map((module: any) => ({
                        label: module.label || module.name, // Usa el label o name según esté disponible
                        icon: `pi pi-fw ${module.icon}`, // Aplica el icono directamente
                        routerLink: [module.routerlink], // Enlaza la ruta desde `routelink`
                })),
            },
        ];
    }
}
