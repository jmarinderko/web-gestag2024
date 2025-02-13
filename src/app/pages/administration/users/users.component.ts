import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { Role, User } from 'src/app/interfaces/User.interface';
import { UserService } from 'src/app/services/user.service';
import { CreateUserComponent } from './components/create/create.component';
import { RoleService } from 'src/app/services/role.service';
import { PermissionsDirective } from 'src/app/shared/directives/permissions.directive';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [
        CommonModule,
        PanelModule,
        DividerModule,
        ButtonModule,
        TableModule,
        DialogModule,
        MessagesModule,
        CreateUserComponent,
        PermissionsDirective
    ],
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
    // Estado del componente
    messages: Message[] = [];
    users: User[] = [];
    roles: Role[] = [];
    selectedUser: User | null = null;
    loading = false;
    showUserDialog = false;

    // Servicios inyectados
    private readonly userService = inject(UserService);
    private readonly roleService = inject(RoleService);
    private readonly destroyRef = inject(DestroyRef);

    ngOnInit(): void {
        this.loadData();
    }

    /**
     * Carga los datos iniciales del componente
     */
    private loadData(): void {
        this.loading = true;

        // Cargar usuarios
        this.userService.getUsers()
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => this.loading = false)
            )
            .subscribe({
                next: (response) => this.users = response.data,
                error: () => this.showError('Error al cargar usuarios')
            });

        // Cargar roles
        this.roleService.getRoles()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    if (response.success) {
                        this.roles = response.data;
                    }
                },
                error: () => this.showError('Error al cargar roles')
            });
    }

    /**
     * Abre el diálogo para crear un nuevo usuario
     */
    openNewUserDialog(): void {
        this.selectedUser = null;
        this.showUserDialog = true;
    }

    /**
     * Abre el diálogo para editar un usuario existente
     */
    openEditUserDialog(user: User): void {
        this.selectedUser = user;
        this.showUserDialog = true;
    }

    /**
     * Maneja el evento de cierre del diálogo de usuario
     */
    handleDialogClose(): void {
        this.loadData();
        this.selectedUser = null;
        this.showUserDialog = false;
    }

    /**
     * Muestra un mensaje de error
     */
    private showError(detail: string): void {
        this.messages = [{
            severity: 'error',
            detail
        }];
    }
}
