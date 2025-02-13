import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { Module, Role } from 'src/app/interfaces/User.interface';
import { RoleService } from 'src/app/services/role.service';

@Component({
    selector: 'app-create-rol',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        MessagesModule,
        DropdownModule,
    ],
    templateUrl: './createRol.component.html',
    styleUrl: './createRol.component.scss',
})
export class CreateRolComponent {
    @Input() rolSelected: Role | undefined;
    @Input() listModules: Module[] = [];
    @Output() emitterCloseModal: EventEmitter<boolean> =
        new EventEmitter<boolean>();

    rolServices = inject(RoleService);
    messagesform: Message[] = [];
    constructor(private fb: FormBuilder) {}

    form: FormGroup = this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
    });

    ngOnInit() {
        if (this.rolSelected) {
            this.populateForm(this.rolSelected);
        }
    }

    private populateForm(role: Role): void {
        this.form.patchValue({
            name: role.name,
            description: role.description,
        });
    }

    onSave() {
        if (this.form.valid) {
            const role: Role = {
                id: this.rolSelected ? this.rolSelected.id : null,
                name: this.form.get('name').value,
                description: this.form.get('description').value,
            };
            if (this.rolSelected) {
                this.rolServices.updateRole(role).subscribe({
                    next: (data) => {
                        if (data.success) {
                            this.emitterCloseModal.emit(true);
                        } else {
                            this.showError(data.message);
                        }
                    },
                    error: (error) => {
                        this.showError(error.error.message);
                    },
                });
            } else {
                this.rolServices.createRole(role).subscribe({
                    next: (data) => {
                        if (data.success) {
                            this.emitterCloseModal.emit(true);
                        } else {
                            this.showError(data.message);
                        }
                    },
                    error: (error) => {
                        this.showError(error.error.message);
                    },
                });
            }
        }
    }

    private showError(detail: string): void {
        this.messagesform = [{ severity: 'error', detail }];
    }
}
