import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode, JwtPayload } from 'jwt-decode';

function isJwtValid(token: string | null): boolean {
    if (!token) return false;
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return false;
        const payload: JwtPayload = jwtDecode(token);
        if (payload.exp && payload.exp * 1000 <= Date.now()) return false;
        return true;
    } catch {
        return false;
    }
}

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  if (typeof window === 'undefined') return true;
  const token = localStorage.getItem('auth_token');
  if (isJwtValid(token)) {
    return true;
  } else {
    router.navigateByUrl('/?error=unauthorized');
    return false;
  }
};
