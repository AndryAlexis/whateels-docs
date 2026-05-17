
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);

  if (typeof window === 'undefined') return true;
  const token = authService.getAccessToken();
  if (authService.hasValidAccessToken()) {
    return true;
  }

  authService.clearAccessToken();
  if (!token) {
    authService.redirectToRootWithError('missing');
  } else {
    // Check if token is expired
    const payload = authService.decodeToken(token);
    if (payload && payload.exp && payload.exp * 1000 <= Date.now()) {
      authService.redirectToRootWithError('expired');
    } else {
      authService.redirectToRootWithError('unauthorized');
    }
  }
  return false;
};
