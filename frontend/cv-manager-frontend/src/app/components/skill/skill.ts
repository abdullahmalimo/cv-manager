import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Observable } from 'rxjs';
import { SkillService } from '../../services/skill';
import {
  SkillRequest,
  SkillResponse
} from '../../models/skill.model';

@Component({
  selector: 'app-skill',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './skill.html',
  styleUrl: './skill.css'
})
export class Skill implements OnInit {
  skills: SkillResponse[] = [];
  form!: FormGroup;
  showForm = false;
  editingId: number | null = null;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private service: SkillService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      level: [null]
    });

    this.load();
  }

  load(): void {
    this.service.getSkills().subscribe({
      next: (data) => (this.skills = data),
      error: (err) => {
        console.error('Error loading skills:', err);
        this.errorMessage = 'Could not load your skills.';
      }
    });
  }

  startAdd(): void {
    this.editingId = null;

    this.form.reset({
      name: '',
      level: null
    });

    this.showForm = true;
  }

  startEdit(s: SkillResponse): void {
    this.editingId = s.id;

    this.form.reset({
      name: s.name,
      level: s.level
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

    const request: SkillRequest = {
      name: v.name,
      level: v.level === '' || v.level === null
        ? null
        : Number(v.level)
    };

    this.errorMessage = '';

    const save$: Observable<unknown> = this.editingId
      ? this.service.updateSkill(this.editingId, request)
      : this.service.createSkill(request);

    save$.subscribe({
      next: () => {
        this.showForm = false;
        this.load();
      },
      error: (err) => {
        console.error('Error saving skill:', err);
        this.errorMessage = 'Could not save this skill.';
      }
    });
  }

  delete(id: number): void {
    if (!confirm('Delete this skill?')) {
      return;
    }

    this.service.deleteSkill(id).subscribe({
      next: () => this.load(),
      error: (err) => {
        console.error('Error deleting skill:', err);
        this.errorMessage = 'Could not delete this skill.';
      }
    });
  }
}