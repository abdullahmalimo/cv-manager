import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ProfileService } from '../../services/profile';
import { ProfileRequest } from '../../models/profile.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  profileForm!: FormGroup;
  profileExists = false;   // false = Save will POST, true = Save will PUT
  loading = true;
  message = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(100)]],
      contactEmail: ['', [Validators.required, Validators.email, Validators.maxLength(256)]],
      mobileNumber: ['', [Validators.required, Validators.maxLength(20)]],
      cityName: ['', Validators.maxLength(100)],
      summary: ['', Validators.maxLength(2000)]
    });

    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profileForm.patchValue({
          ...profile,
          cityName: profile.cityName ?? '',
          summary: profile.summary ?? ''
        });
        this.profileExists = true;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err.status !== 404) {          // 404 just means "no profile yet"
          console.error('Error loading profile:', err);
          this.errorMessage = 'Could not load your profile.';
        }
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const v = this.profileForm.getRawValue();
    const request: ProfileRequest = {
      fullName: v.fullName,
      contactEmail: v.contactEmail,
      mobileNumber: v.mobileNumber,
      cityName: v.cityName || null,
      summary: v.summary || null
    };

    this.message = '';
    this.errorMessage = '';

    const save$: Observable<unknown> = this.profileExists
      ? this.profileService.updateProfile(request)
      : this.profileService.createProfile(request);

    save$.subscribe({
      next: () => {
        this.profileExists = true;        // from now on, Save means update
        this.message = 'Profile saved.';
      },
      error: (err) => {
        console.error('Error saving profile:', err);
        this.errorMessage = 'Could not save your profile.';
      }
    });
  }
}