import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiEndpointsService } from '../shared/services/api-endpoints.service';
import { AuthService } from '../shared/services/auth.service';
import { TokenExpiryService } from '../shared/services/token-expiry.service';

export const authCallbackGuard: CanActivateFn = async () => {
    const router = inject(Router);
    const apiEndpoints = inject(ApiEndpointsService);
    const authService = inject(AuthService);
    const tokenExpiryService = inject(TokenExpiryService);

    // SSR-safe: Only access window in browser
    if (typeof window === 'undefined') {
        return true;
    }

    const params = new URLSearchParams(window.location.search);
    const action = (params.get('action') ?? '').trim().toLowerCase();
    const token = params.get('token');

    // Token callback flow (OAuth provider redirect back to app)
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
    }

    // Action flow (explicit callback actions with no token)
    if (action === 'logout') {
        await authService.logout();
        return router.createUrlTree(['/'], { queryParams: { action: 'logout', success: '1' } });
    }

    if (action === 'login') {
        window.location.assign(apiEndpoints.getGitHubLoginUrl());
        return false;
    }

    if (action === 'change-account') {
        authService.clearAccessToken();
        window.location.assign(`${apiEndpoints.apiBaseUrl}/auth/github/login`);
        return false;
    }

    return router.createUrlTree(['/'], { queryParams: { error: 'no_token' } });
};