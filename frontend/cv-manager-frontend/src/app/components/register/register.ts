import { Component } from '@angular/core';
import { AbstractControl, ValidationErrors, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './register.html',
    styleUrl: './register.css'
})
export class Register {

    registerForm: FormGroup;
    errorMessage = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
            email: ['', [Validators.required, Validators.email, Validators.maxLength(256)]],
            password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
            confirmpassword: ['', Validators.required],
        }, {
            validators: this.passwordMatchValidator
        });
    }

    passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password')?.value;
        const confirmPassword = control.get('confirmpassword')?.value;
        return password !== confirmPassword ? { passwordMismatch: true } : null;
    }

    onSubmit(): void {
        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }

        this.errorMessage = '';

        this.authService.register(this.registerForm.value).subscribe({
            next: () => this.router.navigate(['/login']),
            error: (err) => {
                // "Email already exists." arrives as plain text; validation errors arrive as an object.
                this.errorMessage = typeof err.error === 'string'
                    ? err.error
                    : 'Please check your details and try again.';
            }
        });
    }
}