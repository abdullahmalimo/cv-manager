import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { forkJoin, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CvList } from '../cv-list/cv-list';
import { ProfileService } from '../../services/profile';
import { ExperienceService } from '../../services/experience';
import { EducationService } from '../../services/education';
import { CertificateService } from '../../services/certificate';
import { ProfileResponse } from '../../models/profile.model';
import { ExperienceResponse } from '../../models/experience.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CvList],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  profile: ProfileResponse | null = null;
  loading = true;
  errorMessage = '';

  certificateCount = 0;
  latestCertificate = '';
  educationCount = 0;
  latestEducation = '';
  experienceText = '';
  companyCount = 0;
  roleCount = 0;

  constructor(
    private profileService: ProfileService,
    private experienceService: ExperienceService,
    private educationService: EducationService,
    private certificateService: CertificateService
  ) {}

  ngOnInit(): void {
    forkJoin({
      profile: this.profileService.getProfile().pipe(
        // 404 just means "no profile yet". Anything else is a real error.
        catchError(err => (err.status === 404 ? of(null) : throwError(() => err)))
      ),
      experiences: this.experienceService.getExperiences(),
      educations: this.educationService.getEducations(),
      certificates: this.certificateService.getCertificates()
    }).subscribe({
      next: ({ profile, experiences, educations, certificates }) => {
        this.profile = profile;

        this.certificateCount = certificates.length;
        this.latestCertificate = certificates[0]?.name ?? '';

        this.educationCount = educations.length;
        this.latestEducation = educations[0]?.degree ?? '';

        this.roleCount = experiences.length;
        this.companyCount = new Set(
          experiences.map(e => e.companyName.trim().toLowerCase())
        ).size;
        this.experienceText = this.formatDuration(this.totalMonths(experiences));

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
        this.errorMessage = 'Could not load your dashboard.';
        this.loading = false;
      }
    });
  }

  get initials(): string {
    if (!this.profile) {
      return '?';
    }
    return this.profile.fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(word => word[0].toUpperCase())
      .join('');
  }

  // Total months worked. Overlapping jobs are merged so time isn't counted twice.
  private totalMonths(experiences: ExperienceResponse[]): number {
    const now = Date.now();
    const ranges = experiences
      .map(e => ({
        start: new Date(e.startDate).getTime(),
        end: e.endDate ? new Date(e.endDate).getTime() : now
      }))
      .filter(r => r.end > r.start)
      .sort((a, b) => a.start - b.start);

    const merged: { start: number; end: number }[] = [];
    for (const r of ranges) {
      const last = merged[merged.length - 1];
      if (last && r.start <= last.end) {
        last.end = Math.max(last.end, r.end);
      } else {
        merged.push({ ...r });
      }
    }

    const ms = merged.reduce((sum, r) => sum + (r.end - r.start), 0);
    return Math.round(ms / (1000 * 60 * 60 * 24 * 30.4375));
  }

  private formatDuration(months: number): string {
    if (months === 0) {
      return 'No experience yet';
    }
    const years = Math.floor(months / 12);
    const rest = months % 12;
    const parts: string[] = [];
    if (years > 0) { parts.push(`${years} yr${years > 1 ? 's' : ''}`); }
    if (rest > 0) { parts.push(`${rest} mo${rest > 1 ? 's' : ''}`); }
    return parts.join(' ');
  }
}