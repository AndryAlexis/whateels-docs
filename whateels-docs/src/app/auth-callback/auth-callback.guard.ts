import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { TokenExpiryService } from './token-expiry.service';

export const authCallbackGuard = () => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const tokenExpiryService = inject(TokenExpiryService);

    // SSR-safe: Only access window in browser
    if (typeof window === 'undefined') {
        return true;
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
        try {
        const payload = authService.decodeToken(token);
        if (!payload) throw new Error('Invalid token format');
        if (payload.exp && payload.exp * 1000 <= Date.now()) throw new Error('Expired token');

        authService.setAccessToken(token);
        tokenExpiryService.startMonitoring();
        window.history.replaceState({}, document.title, '/auth/callback');

        const roleCode = authService.getRoleCode(token);
        if (roleCode === 1) {
            router.navigateByUrl('/super-admin');
        } else if (roleCode === 2) {
            router.navigateByUrl('/admin');
        } else {
            router.navigateByUrl('/dashboard');
        }

        return false;

        } catch (e) {
            authService.clearAccessToken();
            router.navigateByUrl('/?error=token_invalid');
            return false;
        }
    } else {
        router.navigateByUrl('/?error=no_token');
        return false;
    }
};