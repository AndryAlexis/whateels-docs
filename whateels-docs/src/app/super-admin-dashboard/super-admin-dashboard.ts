import { Component, inject, signal } from '@angular/core';

@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.html',
  styleUrl: './super-admin-dashboard.css'
})
export class SuperAdminDashboardComponent {
  readonly isLoggingOut = signal(false);
  readonly isChangingAccount = signal(false);

  logout(): void {
    this.isLoggingOut.set(true);
    if (typeof window === 'undefined') {
      return;
    }
    window.location.assign('/auth/callback?action=logout');
  }

  changeGitHubAccount(): void {
    if (this.isChangingAccount()) {
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    const confirmed = window.confirm('You will be redirected to GitHub to switch accounts.');
    if (!confirmed) {
      return;
    }

    this.isChangingAccount.set(true);
    window.location.assign('/auth/callback?action=change-account');
  }
}
