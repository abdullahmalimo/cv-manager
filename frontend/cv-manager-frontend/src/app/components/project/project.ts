import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Observable } from 'rxjs';
import { ProjectService } from '../../services/project';
import {
  ProjectRequest,
  ProjectResponse
} from '../../models/project.model';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project.html',
  styleUrl: './project.css'
})
export class Project implements OnInit {
  projects: ProjectResponse[] = [];
  form!: FormGroup;
  showForm = false;
  editingId: number | null = null;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private service: ProjectService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(1000)],
      technologies: ['', Validators.maxLength(500)],
      url: ['', Validators.maxLength(1000)],
      startDate: [''],
      endDate: ['']
    });

    this.load();
  }

  load(): void {
    this.service.getProjects().subscribe({
      next: (data) => (this.projects = data),
      error: (err) => {
        console.error('Error loading projects:', err);
        this.errorMessage = 'Could not load your projects.';
      }
    });
  }

  startAdd(): void {
    this.editingId = null;

    this.form.reset({
      name: '',
      description: '',
      technologies: '',
      url: '',
      startDate: '',
      endDate: ''
    });

    this.showForm = true;
  }

  startEdit(p: ProjectResponse): void {
    this.editingId = p.id;

    this.form.reset({
      name: p.name,
      description: p.description ?? '',
      technologies: p.technologies ?? '',
      url: p.url ?? '',
      startDate: p.startDate ? p.startDate.slice(0, 10) : '',
      endDate: p.endDate ? p.endDate.slice(0, 10) : ''
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

    const request: ProjectRequest = {
      name: v.name,
      description: v.description || null,
      technologies: v.technologies || null,
      url: v.url || null,
      startDate: v.startDate || null,
      endDate: v.endDate || null
    };

    this.errorMessage = '';

    const save$: Observable<unknown> = this.editingId
      ? this.service.updateProject(this.editingId, request)
      : this.service.createProject(request);

    save$.subscribe({
      next: () => {
        this.showForm = false;
        this.load();
      },
      error: (err) => {
        console.error('Error saving project:', err);
        this.errorMessage = 'Could not save this project.';
      }
    });
  }

  delete(id: number): void {
    if (!confirm('Delete this project?')) {
      return;
    }

    this.service.deleteProject(id).subscribe({
      next: () => this.load(),
      error: (err) => {
        console.error('Error deleting project:', err);
        this.errorMessage = 'Could not delete this project.';
      }
    });
  }
}