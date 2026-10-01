import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CertificateService } from '../../services/certificate';
import { CertificateRequest, CertificateResponse } from '../../models/certificate.model';

@Component({
    selector: 'app-certificate',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './certificate.html',
    styleUrl: './certificate.css'
})
export class Certificate implements OnInit {
    certificates: CertificateResponse[] = [];
    form!: FormGroup;
    showForm = false;
    editingId: number | null = null;
    errorMessage = '';

    constructor(
        private fb: FormBuilder,
        private service: CertificateService
    ) { }

    ngOnInit(): void {
        this.form = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(200)]],
            issuer: ['', [Validators.required, Validators.maxLength(200)]],
            description: ['', Validators.maxLength(2000)],
            url: ['', Validators.maxLength(1000)],
            issueDate: ['', Validators.required]
        });

        this.load();
    }

    load(): void {
        this.service.getCertificates().subscribe({
            next: (data) => (this.certificates = data),
            error: (err) => {
                console.error('Error loading certificates:', err);
                this.errorMessage = 'Could not load your certificates.';
            }
        });
    }

    startAdd(): void {
        this.editingId = null;

        this.form.reset({
            name: '',
            issuer: '',
            description: '',
            url: '',
            issueDate: ''
        });

        this.showForm = true;
    }

    startEdit(c: CertificateResponse): void {
        this.editingId = c.id;

        this.form.reset({
            name: c.name,
            issuer: c.issuer,
            description: c.description ?? '',
            url: c.url ?? '',
            issueDate: c.issueDate.slice(0, 10)
        });

        this.showForm = true;
    }

    cancel(): void {
        this.showForm = false;
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const v = this.form.getRawValue();

        const request: CertificateRequest = {
            name: v.name,
            issuer: v.issuer,
            description: v.description || null,
            url: v.url || null,
            issueDate: v.issueDate
        };

        this.errorMessage = '';

        const save$: Observable<unknown> = this.editingId
            ? this.service.updateCertificate(this.editingId, request)
            : this.service.createCertificate(request);

        save$.subscribe({
            next: () => {
                this.showForm = false;
                this.load();
            },
            error: (err) => {
                console.error('Error saving certificate:', err);
                this.errorMessage = 'Could not save this certificate.';
            }
        });
    }

    delete(id: number): void {
        if (!confirm('Delete this certificate?')) {
            return;
        }

        this.service.deleteCertificate(id).subscribe({
            next: () => this.load(),
            error: (err) => {
                console.error('Error deleting certificate:', err);
                this.errorMessage = 'Could not delete this certificate.';
            }
        });
    }
}