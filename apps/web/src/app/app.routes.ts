import { Routes } from '@angular/router';
import { authGuard } from './shared/services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'journal',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/journal-list/journal-list.component').then((m) => m.JournalListComponent),
  },
  {
    path: 'editor',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/journal-editor/journal-editor.component').then((m) => m.JournalEditorComponent),
  },
  {
    path: 'editor/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/journal-editor/journal-editor.component').then((m) => m.JournalEditorComponent),
  },
  {
    path: 'calendar',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/calendar/calendar.component').then((m) => m.CalendarComponent),
  },
  {
    path: 'insights',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/insights/insights.component').then((m) => m.InsightsComponent),
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/settings/settings.component').then((m) => m.SettingsComponent),
  },
  { path: '**', redirectTo: '/dashboard' },
];
