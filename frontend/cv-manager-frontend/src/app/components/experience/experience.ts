import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ExperienceService } from '../../services/experience';
import { ExperienceRequest, ExperienceResponse } from '../../models/experience.model';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './experience.html',
  styleUrl: './experience.css'
})
export class Experience implements OnInit {
  experiences: ExperienceResponse[] = [];
  form!: FormGroup;
  showForm = false;
  editingId: number | null = null;
  errorMessage = '';

  constructor(private fb: FormBuilder, private service: ExperienceService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      companyName: ['', [Validators.required, Validators.maxLength(100)]],
      jobTitle: ['', [Validators.required, Validators.maxLength(50)]],
      city: ['', Validators.maxLength(50)],
      description: ['', Validators.maxLength(1000)],
      startDate: ['', Validators.required],
      endDate: ['']
    });
    this.load();
  }

  load(): void {
    this.service.getExperiences().subscribe({
      next: (data) => (this.experiences = data),
      error: (err) => {
        console.error('Error loading experiences:', err);
        this.errorMessage = 'Could not load your experience.';
      }
    });
  }

  startAdd(): void {
    this.editingId = null;
    this.form.reset({ companyName: '', jobTitle: '', city: '', description: '', startDate: '', endDate: '' });
    this.showForm = true;
  }

  startEdit(e: ExperienceResponse): void {
    this.editingId = e.id;
    this.form.reset({
      companyName: e.companyName,
      jobTitle: e.jobTitle,
      city: e.city ?? '',
      description: e.description ?? '',
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
    const request: ExperienceRequest = {
      companyName: v.companyName,
      jobTitle: v.jobTitle,
      city: v.city || null,
      description: v.description || null,
      startDate: v.startDate,
      endDate: v.endDate || null
    };

    this.errorMessage = '';
    const save$: Observable<unknown> = this.editingId
      ? this.service.updateExperience(this.editingId, request)
      : this.service.createExperience(request);

    save$.subscribe({
      next: () => {
        this.showForm = false;
        this.load();
      },
      error: (err) => {
        console.error('Error saving experience:', err);
        this.errorMessage = 'Could not save this experience.';
      }
    });
  }

  delete(id: number): void {
    if (!confirm('Delete this experience?')) {
      return;
    }
    this.service.deleteExperience(id).subscribe({
      next: () => this.load(),
      error: (err) => {
        console.error('Error deleting experience:', err);
        this.errorMessage = 'Could not delete this experience.';
      }
    });
  }
}