import { Doc } from './doc/doc';
import { AuthCallbackComponent } from './auth-callback/auth-callback';
import { authCallbackGuard } from './auth-callback/auth-callback.guard';
import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard';
import { SuperAdminDashboardComponent } from './super-admin-dashboard/super-admin-dashboard';

export const routes: Routes = [
  { path: '', component: Doc },
  { path: 'auth/callback', canActivate: [authCallbackGuard], component: AuthCallbackComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'super-admin', component: SuperAdminDashboardComponent }
];
