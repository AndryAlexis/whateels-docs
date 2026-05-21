import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth-callback/auth.service';
import { ApiEndpointsService } from '../shared/services/api-endpoints.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly apiEndpoints = inject(ApiEndpointsService);

  private readonly changeAccountMode: 'logout' | 'authorize' | null = null;
  readonly isLoggingOut = signal(false);
  readonly isChangingAccount = signal(false);
  readonly logoutError = signal<string | null>(null);

  async logout(): Promise<void> {
    this.logoutError.set(null);
    this.isLoggingOut.set(true);
    try {
      await this.authService.logout();
      await this.router.navigate(['/']);
    } catch {
      this.logoutError.set('Unable to complete logout. Please try again.');
    } finally {
      this.isLoggingOut.set(false);
    }
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

    const baseUrl = `${this.apiEndpoints.apiBaseUrl}/auth/github/login/change-account`;
    const url = this.changeAccountMode ? `${baseUrl}?mode=${this.changeAccountMode}` : baseUrl;
    window.location.href = url;
  }
}
