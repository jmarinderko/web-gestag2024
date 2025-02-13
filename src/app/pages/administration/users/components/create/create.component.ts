import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { Role, User } from 'src/app/interfaces/User.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-create-user',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        MessagesModule,
        DividerModule,
        MultiSelectModule,
        DialogModule,
        ButtonModule,
    ],
    templateUrl: './create.component.html',
    styleUrl: './create.component.scss',
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUserComponent {
    @Input() userSelected: User | undefined;
    @Input() listRoles: Role[] = [];
    @Output() closeEmiter: EventEmitter<boolean> = new EventEmitter<boolean>();

    rolesListSelected: Role[] = [];
    form: FormGroup = this.fb.group({
        nombre: ['', Validators.required],
        tipo_usuario: ['', Validators.required],
        apellido: ['', Validators.required],
        login: ['', Validators.required],
        password: ['', Validators.required],
        selectedRoles: [null, Validators.required],
    });
    messagesform: Message[] = [];
    userService = inject(UserService);

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        console.log(this.userSelected);
        if (this.userSelected) {
            this.form.patchValue(this.userSelected);
            // this.fom = this.userEdition.roles;
            this.form.controls['password'].removeValidators(
                Validators.required
            );
            this.form.controls['login'].removeValidators(Validators.required);
            this.form.controls['selectedRoles'].setValue(
                this.userSelected.roles.map((p) => p.id)
                // this.roleList.filter((role) => this.userEdition.roles.some(x => x.id === role.id))
                // this.userEdition.roles.map((role) => role)
            );
        }
    }

    public onSave(): void {
        if (this.form.invalid) return;
        const user = this.form.value as User;

        user.roles = this.form.get('selectedRoles')?.value;
        user.id = this.userSelected?.id || 0;
        const request = !this.userSelected
            ? this.userService.createUser(user)
            : this.userService.updateUser(user);
        request.subscribe({
            next: (resp) => {
                if (resp.success) {
                    this.closeEmiter.emit(true);
                } else {
                    this.showError(
                        `Usuario no se pudo ${
                            !this.userSelected ? 'crear' : 'modificar'
                        } correctamente`
                    );
                }
            },
            error(err) {},
        });
    }

    private showError(detail: string): void {
        this.messagesform = [{ severity: 'error', detail }];
    }
}
