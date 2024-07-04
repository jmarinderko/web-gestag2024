import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { PasswordModule } from 'primeng/password';
import { AuthService } from 'src/app/services/auth.service';

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
})
export class LoginComponent implements OnInit {
    valCheck: string[] = ['remember'];
    loginForm!: FormGroup;
    password!: string;
    authService = inject(AuthService);
    messages: Message[] | undefined;

    constructor(private fb: FormBuilder, private router: Router) {}

    ngOnInit() {
        this.loginForm = this.fb.group({
            login: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(4)]],
        });
    }

    onSubmit() {
        if (!this.loginForm.valid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.authService.login(this.loginForm.value).subscribe({
            next: (response) => {
                this.authService.setToken(response.access_token);
                this.router.navigate(['/']);
            },
            error: (error) => {
                console.log(error);
                this.messages = [
                    {
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error con el inicio de sessión, valide sus credenciales.',
                    },
                ];
            },
        });
    }
}
