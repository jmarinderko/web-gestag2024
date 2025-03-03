import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { TransittaxesComponent } from './pages/transittaxes/transittaxes.component';
import { HomeComponent } from './pages/home/home.component';
import { LoadfileComponent } from './pages/loadfile/loadfile.component';
import { ModulationComponent } from './pages/modulation/modulation.component';
import { LetterComponent } from './pages/letter/letter.component';
import { TransferComponent } from './pages/transfer/transfer.component';
import { LoginComponent } from './pages/auth/login.component';
import { AuthGuard } from './guard/auth.guard';
import { CitationComponent } from './pages/citation/citation.component';
import { ReasonsComponent } from './pages/administration/reasons/reasons.component';
import { UsersComponent } from './pages/administration/users/users.component';
import { RoleComponent } from './pages/administration/role/roles.component';
import { TransferrmntpComponent } from './pages/transferrmntp/transferrmntp.component';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: 'login',
                    component: LoginComponent,
                },
                {
                    path: '',
                    component: AppLayoutComponent,
                    canActivate: [AuthGuard],
                    children: [
                        {
                            path: 'transittaxes',
                            component: TransittaxesComponent,
                        },
                        {
                            path: 'loadfile',
                            component: LoadfileComponent,
                        },
                        {
                            path: 'modulation',
                            component: ModulationComponent,
                        },
                        {
                            path: 'letter',
                            component: LetterComponent,
                        },
                        {
                            path: 'transfer',
                            component: TransferComponent,
                        },
                        {
                            path: 'citation',
                            component: CitationComponent,
                        },
                        {
                            path: 'reason',
                            component: ReasonsComponent,
                        },
                        {
                            path: 'users',
                            component: UsersComponent,
                        },
                        {
                            path: 'role',
                            component: RoleComponent,
                        },
                        {
                            path: 'rmntp',
                            component: TransferrmntpComponent,
                        },
                        {
                            path: '',
                            component: HomeComponent,
                        },
                    ],
                },
                // {
                //     path: 'auth',
                //     loadChildren: () =>
                //         import('./demo/components/auth/auth.module').then(
                //             (m) => m.AuthModule
                //         ),
                // },
                // {
                //     path: 'landing',
                //     loadChildren: () =>
                //         import('./demo/components/landing/landing.module').then(
                //             (m) => m.LandingModule
                //         ),
                // },
                // { path: 'notfound', component: NotfoundComponent },
                // { path: '**', redirectTo: '/notfound' },
            ],
            {
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
                onSameUrlNavigation: 'reload',
            }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
