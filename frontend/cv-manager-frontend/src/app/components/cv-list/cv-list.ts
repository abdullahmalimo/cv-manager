import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CvService, CV } from '../../services/cv';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cv-list',
  standalone: true,
  templateUrl: './cv-list.html',
  styleUrls: ['./cv-list.css'],
  imports: [CommonModule,RouterModule]
})
export class CvList implements OnInit {
  cvs: CV[] = [];

  constructor(private cvService: CvService) {}

  ngOnInit(): void {
    this.loadCVs();
  }


  loadCVs(): void {
    this.cvService.getCVs().subscribe({
      next: (data: CV[]) => {
        this.cvs = data; 
      },
      error: (err) => {
        console.error('Error fetching CVs:', err);
      }
    });
  }

  
  deleteCV(id: number): void {
    this.cvService.deleteCV(id).subscribe({
      next: () => this.loadCVs(),
      error: (err) => console.error('Error deleting CV:', err)
    });
  }
}
