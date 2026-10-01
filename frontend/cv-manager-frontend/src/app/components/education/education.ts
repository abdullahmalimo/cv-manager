import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Observable } from 'rxjs';
import { EducationService } from '../../services/education';
import {
  EducationRequest,
  EducationResponse
} from '../../models/education.model';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './education.html',
  styleUrl: './education.css'
})
export class Education implements OnInit {
  educations: EducationResponse[] = [];
  form!: FormGroup;
  showForm = false;
  editingId: number | null = null;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private service: EducationService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      institution: ['', [Validators.required, Validators.maxLength(100)]],
      degree: ['', [Validators.required, Validators.maxLength(100)]],
      studyField: ['', Validators.maxLength(100)],
      startDate: ['', Validators.required],
      endDate: ['']
    });

    this.load();
  }

  load(): void {
    this.service.getEducations().subscribe({
      next: (data) => (this.educations = data),
      error: (err) => {
        console.error('Error loading education:', err);
        this.errorMessage = 'Could not load your education.';
      }
    });
  }

  startAdd(): void {
    this.editingId = null;

    this.form.reset({
      institution: '',
      degree: '',
      studyField: '',
      startDate: '',
      endDate: ''
    });

    this.showForm = true;
  }

  startEdit(e: EducationResponse): void {
    this.editingId = e.id;

    this.form.reset({
      institution: e.institution,
      degree: e.degree,
      studyField: e.studyField ?? '',
      startDate: e.startDate.slice(0, 10),
      endDate: e.endDate ? e.endDate.slice(0, 10) : ''
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

    const request: EducationRequest = {
      institution: v.institution,
      degree: v.degree,
      studyField: v.studyField || null,
      startDate: v.startDate,
      endDate: v.endDate || null
    };

    this.errorMessage = '';

    const save$: Observable<unknown> = this.editingId
      ? this.service.updateEducation(this.editingId, request)
      : this.service.createEducation(request);

    save$.subscribe({
      next: () => {
        this.showForm = false;
        this.load();
      },
      error: (err) => {
        console.error('Error saving education:', err);
        this.errorMessage = 'Could not save this education.';
      }
    });
  }

  delete(id: number): void {
    if (!confirm('Delete this education?')) {
      return;
    }

    this.service.deleteEducation(id).subscribe({
      next: () => this.load(),
      error: (err) => {
        console.error('Error deleting education:', err);
        this.errorMessage = 'Could not delete this education.';
      }
    });
  }
}