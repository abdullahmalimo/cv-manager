import { Component } from '@angular/core';
import {
    ReactiveFormsModule,
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './login.html',
    styleUrl: './login.css'
})
export class Login {

    loginForm: FormGroup;
    errorMessage = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email, Validators.maxLength(256)]],
            password: ['', [Validators.required]],
        });
    }

    onSubmit(): void {

        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.errorMessage = '';

        this.authService.login(this.loginForm.value).subscribe({
            next: (response) => {
                localStorage.setItem('token', response.token);
                this.router.navigate(['/']);
            },
            error: (err) => {
                console.error('Login failed:', err);
                this.errorMessage = 'Invalid email or password.';
            }
        });
    }
}