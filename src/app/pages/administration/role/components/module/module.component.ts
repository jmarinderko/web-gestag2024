import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { Module, Role } from 'src/app/interfaces/User.interface';
import { RoleService } from 'src/app/services/role.service';

@Component({
    selector: 'app-module',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        TableModule,
        MessagesModule,
        PanelModule,
        DividerModule,
        InputSwitchModule,
        FormsModule,
    ],
    templateUrl: './module.component.html',
    styleUrls: ['./module.component.scss'],
})
export class ModuleComponent {
    @Input() rolSelected: Role = null!;
    @Input() listModules: Module[] = [];
    @Output() emitterCloseModal = new EventEmitter<boolean>();

    listModuleUpdate: Module[] = [];
    roleService = inject(RoleService);
    messagesform: Message[] = [];

    ngOnInit(): void {
        // Inicializamos los módulos seleccionados basados en el rol seleccionado
        console.log(this.rolSelected);
        // this.listModules = this.listModules.map((module) => ({
        //     ...module,
        //     selected: !!this.rolSelected.modules.find(
        //         (selected) => selected.id === module.id
        //     ),
        // }));
        this.listModuleUpdate = this.listModules.map((module) => ({
            ...module,
            selected: !!this.rolSelected.modules.find(
                (selected) => selected.id === module.id
            ),
        }));
    }

    validateSwitchMaster(module: Module): void {
        this.updateListModuleUpdate(module);

        if (module.selected) {
            // Activa al padre si es necesario
            this.activateParent(module);

            // Activa todos los hijos del módulo
            if (module.label !== 'Home') {
                this.toggleChildren(module, true);
            }
        } else {
            // Desactiva todos los hijos del módulo
            this.toggleChildren(module, false);

            // Valida si el padre debe seguir activo
            if (module.label !== 'Home') {
                this.validateParentStatus(module);
            }
        }
    }

    private activateParent(module: Module): void {
        if (module.moduleid) {
            const parent = this.listModules.find(
                (parent) => parent.id === module.moduleid
            );

            if (parent && !parent.selected) {
                parent.selected = true;
                this.updateListModuleUpdate(parent);

                // Activación recursiva si el padre también tiene un padre
                this.activateParent(parent);
            }
        }
    }

    private toggleChildren(module: Module, state: boolean): void {
        this.listModules
            .filter((child) => child.moduleid === module.id)
            .forEach((child) => {
                if (child.selected !== state) {
                    child.selected = state;
                    this.updateListModuleUpdate(child);
                    this.toggleChildren(child, state); // Recursivo para manejar múltiples niveles
                }
            });
    }

    private validateParentStatus(module: Module): void {
        if (module.moduleid) {
            const parent = this.listModules.find(
                (parent) => parent.id === module.moduleid
            );

            if (parent) {
                const hasActiveChildren = this.listModules.some(
                    (child) => child.moduleid === parent.id && child.selected
                );

                if (!hasActiveChildren && parent.selected) {
                    parent.selected = false;
                    this.updateListModuleUpdate(parent);

                    // Desactivación recursiva si el padre también tiene un padre
                    this.validateParentStatus(parent);
                }
            }
        }
    }

    private updateListModuleUpdate(module: Module): void {
        const index = this.listModuleUpdate.findIndex(
            (m) => m.id === module.id
        );

        if (index > -1) {
            this.listModuleUpdate[index].selected = module.selected;
        }
    }

    save(): void {
        this.roleService.updateModuleRole(this.rolSelected, this.listModuleUpdate).subscribe({
            next: (resp) => {
                resp.success
                    ? this.emitterCloseModal.emit(true)
                    : this.showError(resp.message);
            },
            error: (error) => this.showError(error.error.message),
        });
    }

    private showError(detail: string): void {
        this.messagesform = [{ severity: 'error', detail }];
    }
}
