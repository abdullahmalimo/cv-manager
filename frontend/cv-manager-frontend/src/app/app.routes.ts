import { Routes } from '@angular/router';
import { CvList } from './components/cv-list/cv-list';
import { CvForm } from './components/cv-form/cv-form';
import { Login } from './components/login/login';
import { authGuard } from './guards/auth.guard';
import { Register } from './components/register/register';

export const routeConfig: Routes = [
  { path: '', component: CvList, canActivate: [authGuard] },
  { path: 'create', component: CvForm, canActivate: [authGuard] },
  { path: 'edit/:id', component: CvForm, canActivate: [authGuard] },
  { path: 'login', component: Login },
  { path: 'register', component: Register }
  
];

export default routeConfig;
