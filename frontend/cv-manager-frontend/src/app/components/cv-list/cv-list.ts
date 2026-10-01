import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CvService } from '../../services/cv';
import { CVSummaryResponse } from '../../models/cv.model';

@Component({
  selector: 'app-cv-list',
  standalone: true,
  templateUrl: './cv-list.html',
  styleUrls: ['./cv-list.css'],
  imports: [CommonModule, RouterModule]
})
export class CvList implements OnInit {
  cvs: CVSummaryResponse[] = [];

  constructor(private cvService: CvService) {}

  ngOnInit(): void {
    this.loadCVs();
  }

  loadCVs(): void {
    this.cvService.getCVs().subscribe({
      next: (data) => (this.cvs = data),
      error: (err) => console.error('Error fetching CVs:', err)
    });
  }

  deleteCV(id: number): void {
    if (!confirm('Delete this CV?')) {
      return;
    }
    this.cvService.deleteCV(id).subscribe({
      next: () => this.loadCVs(),
      error: (err) => console.error('Error deleting CV:', err)
    });
  }

  // The API sends UTC times without a 'Z'. Add it so the browser converts correctly.
  toDate(value: string): Date {
    return new Date(value.endsWith('Z') ? value : value + 'Z');
  }
}