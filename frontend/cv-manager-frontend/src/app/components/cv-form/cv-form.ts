
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CvService } from '../../services/cv';
import { ProfileService } from '../../services/profile';
import { ExperienceService } from '../../services/experience';
import { EducationService } from '../../services/education';
import { SkillService } from '../../services/skill';
import { ProjectService } from '../../services/project';
import { CertificateService } from '../../services/certificate';

import { CVRequest, CvContent } from '../../models/cv.model';
import { CvPreview } from '../cv-preview/cv-preview';
import html2pdf from 'html2pdf.js';


@Component({
  selector: 'app-cv-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink,CvPreview],
  templateUrl: './cv-form.html',
  styleUrl: './cv-form.css'
})
export class CvForm implements OnInit {
  cvForm!: FormGroup;
  editingId: number | null = null;
  errorMessage = '';
  profileMessage = '';
  loadingProfile = false;

  constructor(
    private fb: FormBuilder,
    private cvService: CvService,
    private profileService: ProfileService,
    private experienceService: ExperienceService,
    private educationService: EducationService,
    private skillService: SkillService,
    private projectService: ProjectService,
    private certificateService: CertificateService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cvForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(100)],
      templateName: ['classic', Validators.required],

      personalDetails: this.fb.group({
        fullName: ['', [Validators.required, Validators.maxLength(100)]],
        email: [
          '',
          [Validators.required, Validators.email, Validators.maxLength(256)]
        ],
        mobileNumber: ['', Validators.maxLength(20)],
        cityName: ['', Validators.maxLength(100)]
      }),

      summary: ['', Validators.maxLength(2000)],
      experiences: this.fb.array([]),
      educations: this.fb.array([]),
      skills: this.fb.array([]),
      projects: this.fb.array([]),
      certificates: this.fb.array([])
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.editingId = Number(id);

        this.cvService.getCV(this.editingId).subscribe({
          next: cv => {
            const content = this.parseContent(cv.content);

            this.cvForm.patchValue({
              title: cv.title,
              description: cv.description ?? '',
              templateName: cv.templateName ?? 'classic',
              personalDetails: content.personalDetails,
              summary: content.summary
            });

            this.setArray('experiences', content.experiences);
            this.setArray('educations', content.educations);
            this.setArray('skills', content.skills);
            this.setArray('projects', content.projects);
            this.setArray('certificates', content.certificates);
          },
          error: err => {
            console.error('Error loading CV:', err);
            this.errorMessage = 'Could not load this CV.';
          }
        });
      }
    });
  }

  // Convenient access to each repeatable section in the form.
  get experiences(): FormArray {
    return this.cvForm.get('experiences') as FormArray;
  }

  get educations(): FormArray {
    return this.cvForm.get('educations') as FormArray;
  }

  get skills(): FormArray {
    return this.cvForm.get('skills') as FormArray;
  }

  get projects(): FormArray {
    return this.cvForm.get('projects') as FormArray;
  }

  get certificates(): FormArray {
    return this.cvForm.get('certificates') as FormArray;
  }

  private createExperience(item: any = {}): FormGroup {
    return this.fb.group({
      companyName: [item.companyName ?? '', Validators.maxLength(100)],
      jobTitle: [item.jobTitle ?? '', Validators.maxLength(50)],
      description: [item.description ?? '', Validators.maxLength(1000)],
      city: [item.city ?? '', Validators.maxLength(100)],
      startDate: [this.dateOnly(item.startDate)],
      endDate: [this.dateOnly(item.endDate)]
    });
  }

  private createEducation(item: any = {}): FormGroup {
    return this.fb.group({
      institution: [item.institution ?? '', Validators.maxLength(100)],
      degree: [item.degree ?? '', Validators.maxLength(100)],
      studyField: [item.studyField ?? '', Validators.maxLength(100)],
      startDate: [this.dateOnly(item.startDate)],
      endDate: [this.dateOnly(item.endDate)]
    });
  }

  private createSkill(item: any = {}): FormGroup {
    return this.fb.group({
      name: [item.name ?? '', Validators.maxLength(50)],
      level: [item.level ?? null]
    });
  }

  private createProject(item: any = {}): FormGroup {
    return this.fb.group({
      name: [item.name ?? '', Validators.maxLength(100)],
      description: [item.description ?? '', Validators.maxLength(1000)],
      technologies: [item.technologies ?? '', Validators.maxLength(500)],
      url: [item.url ?? '', Validators.maxLength(1000)],
      startDate: [this.dateOnly(item.startDate)],
      endDate: [this.dateOnly(item.endDate)]
    });
  }

  private createCertificate(item: any = {}): FormGroup {
    return this.fb.group({
      name: [item.name ?? '', Validators.maxLength(200)],
      issuer: [item.issuer ?? '', Validators.maxLength(200)],
      description: [item.description ?? '', Validators.maxLength(2000)],
      url: [item.url ?? '', Validators.maxLength(1000)],
      issueDate: [this.dateOnly(item.issueDate)]
    });
  }

  addExperience(item: any = {}): void {
    this.experiences.push(this.createExperience(item));
  }

  addEducation(item: any = {}): void {
    this.educations.push(this.createEducation(item));
  }

  addSkill(item: any = {}): void {
    this.skills.push(this.createSkill(item));
  }

  addProject(item: any = {}): void {
    this.projects.push(this.createProject(item));
  }

  addCertificate(item: any = {}): void {
    this.certificates.push(this.createCertificate(item));
  }

  removeExperience(index: number): void {
    this.experiences.removeAt(index);
  }

  removeEducation(index: number): void {
    this.educations.removeAt(index);
  }

  removeSkill(index: number): void {
    this.skills.removeAt(index);
  }

  removeProject(index: number): void {
    this.projects.removeAt(index);
  }

  removeCertificate(index: number): void {
    this.certificates.removeAt(index);
  }

  private setArray(name: string, items: any[]): void {
    const array = this.cvForm.get(name) as FormArray;
    array.clear();

    for (const item of items) {
      switch (name) {
        case 'experiences':
          array.push(this.createExperience(item));
          break;
        case 'educations':
          array.push(this.createEducation(item));
          break;
        case 'skills':
          array.push(this.createSkill(item));
          break;
        case 'projects':
          array.push(this.createProject(item));
          break;
        case 'certificates':
          array.push(this.createCertificate(item));
          break;
      }
    }
  }

  // Copy the user's existing Profile data into this CV form.
  fillFromProfile(): void {
    this.loadingProfile = true;
    this.profileMessage = '';
    this.errorMessage = '';

    forkJoin({
      profile: this.profileService.getProfile().pipe(
        catchError(err =>
          err.status === 404 ? of(null) : throwError(() => err)
        )
      ),
      experiences: this.experienceService.getExperiences(),
      educations: this.educationService.getEducations(),
      skills: this.skillService.getSkills(),
      projects: this.projectService.getProjects(),
      certificates: this.certificateService.getCertificates()
    }).subscribe({
      next: data => {
        if (data.profile) {
          this.cvForm.patchValue({
            personalDetails: {
              fullName: data.profile.fullName,
              email: data.profile.contactEmail,
              mobileNumber: data.profile.mobileNumber,
              cityName: data.profile.cityName ?? ''
            },
            summary: data.profile.summary ?? ''
          });
        }

        this.setArray('experiences', data.experiences);
        this.setArray('educations', data.educations);
        this.setArray('skills', data.skills);
        this.setArray('projects', data.projects);
        this.setArray('certificates', data.certificates);

        this.profileMessage = 'Profile information copied. Remove any entries you do not want in this CV.';
        this.loadingProfile = false;
      },
      error: err => {
        console.error('Error loading profile data:', err);
        this.errorMessage = 'Could not load your profile data. Please try again.';
        this.loadingProfile = false;
      }
    });
  }

  private dateOnly(value: string | null | undefined): string {
    return value ? value.slice(0, 10) : '';
  }

  // Supports older saved CVs that do not contain the new arrays.
  private parseContent(text: string): CvContent {
    let parsed: any = {};

    try {
      parsed = JSON.parse(text) ?? {};
    } catch {
      parsed = {};
    }

    const p = parsed.personalDetails ?? {};

    return {
      personalDetails: {
        fullName: p.fullName ?? '',
        email: p.email ?? '',
        mobileNumber: p.mobileNumber ?? '',
        cityName: p.cityName ?? ''
      },
      summary: parsed.summary ?? '',
      experiences: Array.isArray(parsed.experiences) ? parsed.experiences : [],
      educations: Array.isArray(parsed.educations) ? parsed.educations : [],
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      certificates: Array.isArray(parsed.certificates) ? parsed.certificates : []
    };
  }

  onSubmit(): void {
    if (this.cvForm.invalid) {
      this.cvForm.markAllAsTouched();
      return;
    }

    const v = this.cvForm.getRawValue();

    const content: CvContent = {
      personalDetails: v.personalDetails,
      summary: v.summary,
      experiences: v.experiences,
      educations: v.educations,
      skills: v.skills,
      projects: v.projects,
      certificates: v.certificates
    };

    const request: CVRequest = {
      title: v.title,
      description: v.description || null,
      templateName: v.templateName,
      content: JSON.stringify(content)
    };

    const save$: Observable<unknown> = this.editingId
      ? this.cvService.putCV(this.editingId, request)
      : this.cvService.postCV(request);

    save$.subscribe({
      next: () => this.router.navigate(['/']),
      error: err => {
        console.error('Error saving CV:', err);
        this.errorMessage = 'Could not save this CV.';
      }
    });
  }
  exportPdf(): void {
  const preview = document.querySelector(
    '.cv-preview-panel .cv-paper'
  ) as HTMLElement | null;

  if (!preview) {
    this.errorMessage = 'Could not find the CV preview to export.';
    return;
  }

  const title = this.cvForm.get('title')?.value || 'My CV';

  const filename =
    title.replace(/[<>:"/\\|?*\x00-\x1F]/g, '-').trim() || 'My CV';

  const options = {
    margin: [10, 10, 10, 10] as [number, number, number, number],
    filename: `${filename}.pdf`,
    image: {
      type: 'jpeg' as const,
      quality: 0.98
    },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait' as const
    },
    pagebreak: {
      mode: ['css', 'legacy']
    }
  };

  this.errorMessage = '';

  html2pdf()
    .set(options)
    .from(preview)
    .save()
    .catch((error: unknown) => {
      console.error('Error exporting PDF:', error);
      this.errorMessage = 'Could not export the CV. Please try again.';
    });
}
}