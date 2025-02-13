import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Message, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { Table, TableModule } from 'primeng/table';
import { Module, Role } from 'src/app/interfaces/User.interface';
import { RoleService } from 'src/app/services/role.service';
import { ModuleComponent } from './components/module/module.component';
import { CreateRolComponent } from './components/createRol/createRol.component';
import { PermissionsDirective } from 'src/app/shared/directives/permissions.directive';
import { catchError, finalize, forkJoin, of } from 'rxjs';

@Component({
    selector: 'app-roles',
    standalone: true,
    imports: [
        CommonModule,
        PanelModule,
        DividerModule,
        ButtonModule,
        TableModule,
        DialogModule,
        MessagesModule,
        ModuleComponent,
        CreateRolComponent,
        PermissionsDirective,
    ],
    templateUrl: './roles.component.html',
    styleUrl: './roles.component.scss',
    providers: [MessageService]
})
export class RoleComponent implements OnInit {
    // Estado del componente
    roles: Role[] = [];
    modules: Module[] = [];
    selectedRole: Role | null = null;
    loading = false;

    // Estado de diálogos
    showModuleDialog = false;
    showRoleDialog = false;

    // Servicios inyectados
    private readonly roleService = inject(RoleService);
    private readonly messageService = inject(MessageService);
    private readonly destroyRef = inject(DestroyRef);

    ngOnInit(): void {
        this.loadData();
    }

    /**
     * Carga los datos iniciales del componente
     */
    private loadData(): void {
        this.loading = true;

        forkJoin({
            roles: this.roleService.getRoles(),
            modules: this.roleService.getModules()
        }).pipe(
            takeUntilDestroyed(this.destroyRef),
            catchError(error => {
                this.showError('Error al cargar los datos');
                return of({ roles: { data: [] }, modules: { data: [] } });
            }),
            finalize(() => this.loading = false)
        ).subscribe(response => {
            this.roles = response.roles.data;
            this.modules = response.modules.data;
        });
    }

    /**
     * Abre el diálogo para crear un nuevo rol
     */
    openNewRoleDialog(): void {
        this.selectedRole = null;
        this.showRoleDialog = true;
    }

    /**
     * Limpia la tabla
     */
    clearTable(table: Table): void {
        table.clear();
    }

    /**
     * Maneja el cierre de los diálogos
     */
    handleDialogClose(): void {
        this.showRoleDialog = false;
        this.showModuleDialog = false;
        this.selectedRole = null;
        this.loadData();
    }

    /**
     * Abre el diálogo de módulos para un rol
     */
    openModuleDialog(role: Role): void {
        this.selectedRole = role;
        this.showModuleDialog = true;
    }

    /**
     * Abre el diálogo para editar un rol
     */
    openEditRoleDialog(role: Role): void {
        this.selectedRole = role;
        this.showRoleDialog = true;
    }

    /**
     * Elimina un rol
     */
    deleteRole(role: Role): void {
        this.roleService.deleteRole(role.id)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                catchError(error => {
                    this.showError('Error al eliminar el rol');
                    return of(null);
                })
            )
            .subscribe({
                next: (response) => {
                    if (response?.success) {
                        this.showSuccess('Rol eliminado correctamente');
                        this.loadData();
                    } else {
                        this.showError('Error al eliminar el rol');
                    }
                }
            });
    }

    /**
     * Muestra un mensaje de error
     */
    private showError(detail: string): void {
        this.messageService.add({
            severity: 'error',
            detail,
            life: 3000
        });
    }

    /**
     * Muestra un mensaje de éxito
     */
    private showSuccess(detail: string): void {
        this.messageService.add({
            severity: 'success',
            detail,
            life: 3000
        });
    }
}
