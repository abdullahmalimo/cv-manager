
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CvContent } from '../../models/cv.model';

@Component({
  selector: 'app-cv-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cv-preview.html',
  styleUrl: './cv-preview.css'
})
export class CvPreview {
  @Input({ required: true }) content!: CvContent;
  @Input() templateName = 'classic';
}
