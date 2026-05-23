import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { TokenExpiryService } from '../shared/services/token-expiry.service';

export const authCallbackGuard: CanActivateFn = () => {
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
        if (roleCode === 2 || roleCode === 1) {
            return router.createUrlTree(['/admin']);
        } else {
            return router.createUrlTree(['/dashboard']);
        }

        } catch {
            authService.clearAccessToken();
            return router.createUrlTree(['/'], { queryParams: { error: 'token_invalid' } });
        }
    } else {
        return router.createUrlTree(['/'], { queryParams: { error: 'no_token' } });
    }
};