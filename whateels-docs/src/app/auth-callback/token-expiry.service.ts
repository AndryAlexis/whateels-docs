import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, timer } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class TokenExpiryService {
  private authService = inject(AuthService);
  private timerSub?: Subscription;

  startMonitoring() {
    this.stopMonitoring();
    const token = this.authService.getAccessToken();
    if (!token) return;

    const payload = this.authService.decodeToken(token);
    if (!payload?.exp) return;

    const expiryMs = payload.exp * 1000;
    const now = Date.now();
    const msLeft = expiryMs - now;

    if (msLeft <= 0) {
      console.log('Token has already expired.');
      return;
    }

    // Show warning 2 minutes (120000 ms) before expiry
    const warningAt = msLeft - 120000;
    if (warningAt > 0) {
      this.timerSub = timer(warningAt).subscribe(() => this.startCountdown(expiryMs));
    } else {
      // Already within warning window
      this.startCountdown(expiryMs);
    }
  }

  private startCountdown(expiryMs: number) {
    this.timerSub = timer(0, 1000).subscribe(() => {
      const secondsLeft = Math.floor((expiryMs - Date.now()) / 1000);
      if (secondsLeft > 0) {
        console.log(`Token will expire in ${secondsLeft} seconds.`);
        if (secondsLeft === 120) {
          console.log('Warning: Token will expire in 2 minutes!');
        }
      } else {
        console.log('Token has expired. Logging out.');
        this.authService.logout();
        this.stopMonitoring();
      }
    });
  }

  stopMonitoring() {
    this.timerSub?.unsubscribe();
  }
}
