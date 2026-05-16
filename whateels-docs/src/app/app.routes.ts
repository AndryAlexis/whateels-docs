import { Doc } from './doc/doc';
import { AuthCallbackComponent } from './auth-callback/auth-callback';
import { authCallbackGuard } from './auth-callback/auth-callback.guard';
import { Routes } from '@angular/router';
import { authGuard } from './auth-callback/auth.guard';
import { DashboardComponent } from './dashboard/dashboard';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard';
import { SuperAdminDashboardComponent } from './super-admin-dashboard/super-admin-dashboard';

export const routes: Routes = [
  { path: '', component: Doc },
  { path: 'auth/callback', canActivate: [authCallbackGuard], component: AuthCallbackComponent },
  { path: 'dashboard', canActivate: [authGuard], component: DashboardComponent },
  { path: 'admin', canActivate: [authGuard], component: AdminDashboardComponent },
  { path: 'super-admin', canActivate: [authGuard], component: SuperAdminDashboardComponent },
  { path: ':slug', component: Doc }
];
