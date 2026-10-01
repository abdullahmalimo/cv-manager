import { Routes } from '@angular/router';
import { CvForm } from './components/cv-form/cv-form';
import { Login } from './components/login/login';
import { authGuard } from './guards/auth.guard';
import { Register } from './components/register/register';
import { ProfileHub } from './components/profile-hub/profile-hub';
import { Dashboard } from './components/dashboard/dashboard';


export const routeConfig: Routes = [
  { path: '', component: Dashboard, canActivate: [authGuard] },
  { path: 'create', component: CvForm, canActivate: [authGuard] },
  { path: 'edit/:id', component: CvForm, canActivate: [authGuard] },
  { path: 'profile', component: ProfileHub, canActivate: [authGuard] },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: '**', redirectTo: ''}
  
];

export default routeConfig;
