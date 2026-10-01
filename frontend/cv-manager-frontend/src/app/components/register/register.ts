import { Component } from '@angular/core';
import { AbstractControl, ValidationErrors, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
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

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            username: [''],
            email: [''],
            password: [''],
            confirmpassword: [''],
        }, {
            validators: this.passwordMatchValidator
        });
    }

    passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password')?.value;
        const confirmPassword = control.get('confirmpassword')?.value;

        if (password !== confirmPassword) {
            return { passwordMismatch: true };
        }

        return null;
    }

    onSubmit(): void {
        if (this.registerForm.invalid) {
            alert('Passwords do not match.');
            return;
        }


        console.log(this.registerForm.value);

        this.authService.register(this.registerForm.value).subscribe({
            next: (response) => {
                console.log('Register successful:', response);
                this.router.navigate(['/login']);
            },
            error: (err) => {
                console.error('Register failed:', err);
            }
        });

    }

}