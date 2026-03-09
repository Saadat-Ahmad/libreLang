import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', 
    pathMatch: 'full', 
    loadComponent: () => import('./landing/landing.component').then(m => m.LandingComponent) },
  { path: 'dashboard', 
    pathMatch: 'full', 
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'alphabets', 
    pathMatch: 'full', 
    loadComponent: () => import('./alphabets-lesson/alphabets-lesson.component').then(m => m.AlphabetsLessonComponent) }
];