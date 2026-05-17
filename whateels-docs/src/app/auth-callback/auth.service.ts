import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';

type AppJwtPayload = JwtPayload & {
  roleCode?: number | string;
  role_code?: number | string;
  roleId?: number | string;
  role?: number | string;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly accessTokenKey = 'auth_token';
  private readonly apiBaseUrl = 'http://localhost:3000';

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  getAccessToken(): string | null {
    if (!this.isBrowser()) {
      return null;
    }
    return localStorage.getItem(this.accessTokenKey);
  }

  setAccessToken(token: string): void {
    if (!this.isBrowser()) {
      return;
    }
    localStorage.setItem(this.accessTokenKey, token);
  }

  clearAccessToken(): void {
    if (!this.isBrowser()) {
      return;
    }
    localStorage.removeItem(this.accessTokenKey);
  }


  /**
   * Redirects to the root page with an error query parameter.
   * @param errorType The error type to include in the query string (e.g., 'unauthorized', 'expired', 'missing').
   */
  redirectToRootWithError(errorType: string): void {
    if (typeof window === 'undefined') {
      return;
    }
    const url = `/?error=${encodeURIComponent(errorType)}`;
    window.location.assign(url);
  }

  decodeToken(token: string): AppJwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }
      return jwtDecode<AppJwtPayload>(token);
    } catch {
      return null;
    }
  }

  hasValidAccessToken(): boolean {
    const token = this.getAccessToken();
    if (!token) {
      return false;
    }

    const payload = this.decodeToken(token);
    if (!payload) {
      return false;
    }

    if (!payload.exp) {
      return true;
    }

    return payload.exp * 1000 > Date.now();
  }

  getRoleCode(token?: string): number {
    const sourceToken = token ?? this.getAccessToken();
    if (!sourceToken) {
      return 0;
    }

    const payload = this.decodeToken(sourceToken);
    if (!payload) {
      return 0;
    }

    return Number(payload.roleCode ?? payload.role_code ?? payload.roleId ?? payload.role ?? 0);
  }

  logout(): void {
    this.clearAccessToken();
  }
}
