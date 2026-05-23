import { Component, inject, signal } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent {
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
