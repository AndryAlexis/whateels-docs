import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

type JwtPayload = {
  exp?: number;
  roleCode?: number | string;
  role_code?: number | string;
  roleId?: number | string;
  role?: number | string;
};

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  return atob(padded);
}

function parseJwtPayload(token: string): JwtPayload {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token format');
  }
  const rawPayload = decodeBase64Url(parts[1]);
  return JSON.parse(rawPayload) as JwtPayload;
}

export const authCallbackGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // SSR-safe: Only access window in browser
  if (typeof window === 'undefined') {
    // On server, skip guard logic (let navigation continue)
    return true;
  }

  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  if (token) {
    try {
      const payload = parseJwtPayload(token);

      // Basic client-side validation. Signature verification must happen on the API.
      if (payload.exp && payload.exp * 1000 <= Date.now()) {
        throw new Error('Expired token');
      }

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('auth_token', token);
      }

      // Remove token from URL to reduce leak risk in history/logs.
      window.history.replaceState({}, document.title, '/auth/callback');

      // Decode JWT to get user role code
      const roleCode = Number(payload.roleCode ?? payload.role_code ?? payload.roleId ?? payload.role);
      if (roleCode === 1) {
        router.navigateByUrl('/super-admin');
      } else if (roleCode === 2) {
        router.navigateByUrl('/admin');
      } else {
        router.navigateByUrl('/dashboard');
      }
      return false;
    } catch (e) {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
      router.navigateByUrl('/?error=token_invalid');
      return false;
    }
  } else {
    router.navigateByUrl('/?error=no_token');
    return false;
  }
};
