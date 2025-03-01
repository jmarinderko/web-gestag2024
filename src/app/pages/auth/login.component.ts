import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Message, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { PasswordModule } from 'primeng/password';
import { AuthService } from 'src/app/services/auth.service';
import { catchError, finalize } from 'rxjs';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        ReactiveFormsModule,
        MessagesModule,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    providers: [MessageService]
})
export class LoginComponent {
    // Estado del formulario
    loginForm: FormGroup;
    loading = false;
    messages: Message[] = [];
    // Servicios inyectados
    private readonly authService = inject(AuthService);
    private readonly messageService = inject(MessageService);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);
    private readonly destroyRef = inject(DestroyRef);

    constructor() {
        this.initForm();
    }

    /**
     * Inicializa el formulario de login con validaciones
     */
    private initForm(): void {
        this.loginForm = this.fb.group({
            login: ['', [
                Validators.required,
            ]],
            password: ['', [
                Validators.required,
            ]]
        });
    }

    /**
     * Maneja el envío del formulario de login
     */
    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            this.showError('Por favor, complete todos los campos correctamente');
            return;
        }

        this.loading = true;

        this.authService.login(this.loginForm.value)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                catchError(error => {
                    this.showError('Error de autenticación. Por favor, verifique sus credenciales.');
                    throw error;
                }),
                finalize(() => this.loading = false)
            )
            .subscribe({
                next: (response) => {
                    if (response.access_token) {
                        this.handleSuccessfulLogin(response.access_token);
                    } else {
                        this.showError('Error al obtener el token de acceso');
                    }
                }
            });
    }

    /**
     * Maneja el proceso después de un login exitoso
     */
    private handleSuccessfulLogin(token: string): void {
        this.authService.setToken(token);

        if (this.loginForm.get('rememberMe')?.value) {
            // Implementar lógica para recordar usuario si es necesario
            localStorage.setItem('rememberMe', 'true');
        }

        this.router.navigate(['/']);
    }

    /**
     * Verifica si un campo del formulario es inválido
     */
    isFieldInvalid(fieldName: string): boolean {
        const field = this.loginForm.get(fieldName);
        return field ? field.invalid && (field.dirty || field.touched) : false;
    }

    /**
     * Obtiene el mensaje de error para un campo
     */
    getErrorMessage(fieldName: string): string {
        const field = this.loginForm.get(fieldName);
        if (!field) return '';

        if (field.hasError('required')) {
            return 'Este campo es requerido';
        }
        if (field.hasError('minlength')) {
            const minLength = field.errors?.['minlength'].requiredLength;
            return `Mínimo ${minLength} caracteres`;
        }
        return '';
    }

    /**
     * Muestra un mensaje de error
     */
    private showError(detail: string): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail,
            life: 3000
        });
    }
}
