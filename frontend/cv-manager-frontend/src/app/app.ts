import {Component, signal} from '@angular/core';
import { CvList } from './components/cv-list/cv-list';
import { AuthService } from './services/auth';
import { RouterModule,RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterModule,CvList,RouterOutlet], //*
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  protected readonly title = signal('CV Manager');
  constructor(
  private authService: AuthService,
  private router: Router
) {}
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
