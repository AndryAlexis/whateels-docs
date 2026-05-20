import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth-callback/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isLoggingOut = signal(false);
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
}
