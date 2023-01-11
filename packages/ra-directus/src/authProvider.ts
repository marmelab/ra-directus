import { AuthProvider, fetchUtils, HttpError } from 'react-admin';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { UserType } from '@directus/sdk';

export const httpClient = (storage: Storage = localStorage) => (
    url: string,
    options: fetchUtils.Options = {}
) => {
    const headers = new Headers({ Accept: 'application/json' });
    const auth = JSON.parse(storage.getItem('auth'));

    if (auth && auth.access_token) {
        headers.set('Authorization', `Bearer ${auth.access_token}`);
    }
    return fetchUtils.fetchJson(url, { ...options, headers });
};

const DefaultGetIdentityFullName = (user: UserType) =>
    `${user.last_name} ${user.first_name}`;

export const directusAuthProvider = (
    apiBaseUrl: string,
    {
        storage = localStorage,
        getIdentityFullName = DefaultGetIdentityFullName,
    }: {
        storage?: Storage;
        getIdentityFullName?: (user: UserType) => string;
    } = {
        storage: localStorage,
        getIdentityFullName: DefaultGetIdentityFullName,
    }
): AuthProvider => {
    let refreshPromise: Promise<void> = null;

    const authProvider = {
        login: async ({ username, password }) => {
            const request = new Request(`${apiBaseUrl}/auth/login`, {
                method: 'POST',
                body: JSON.stringify({
                    email: username,
                    password,
                }),
                credentials: 'include',
                headers: new Headers({ 'Content-Type': 'application/json' }),
            });
            try {
                const response = await fetch(request);
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                const { data } = await response.json();
                localStorage.setItem('auth', JSON.stringify(data));
            } catch (error) {
                throw error;
            }
        },
        logout: async () => {
            const auth = JSON.parse(localStorage.getItem('auth'));
            if (!auth) {
                return;
            }
            const { access_token, refresh_token } = auth;
            if (!access_token || !refresh_token) {
                return;
            }

            const request = new Request(`${apiBaseUrl}/auth/logout`, {
                method: 'POST',
                body: JSON.stringify({ refresh_token }),
                headers: new Headers({ 'Content-Type': 'application/json' }),
            });
            const response = await fetch(request);
            if (response.status < 200 || response.status >= 300) {
                throw new Error(response.statusText);
            }
            localStorage.removeItem('auth');
        },
        refreshAuth: async () => {
            if (refreshPromise != null) {
                return refreshPromise;
            }
            const auth = JSON.parse(storage.getItem('auth'));
            if (!auth) {
                return Promise.reject();
            }
            const { access_token, refresh_token } = auth;
            if (!access_token && !refresh_token) {
                return Promise.reject();
            }
            const now = new Date();
            const expired = access_token
                ? jwt_decode<JwtPayload>(access_token).exp <
                  now.getTime() / 1000
                : true;

            if (expired) {
                refreshPromise = (async () => {
                    const request = new Request(`${apiBaseUrl}/auth/refresh`, {
                        method: 'POST',
                        body: JSON.stringify({ refresh_token, mode: 'json' }),
                        headers: new Headers({
                            'Content-Type': 'application/json',
                        }),
                    });
                    const response = await fetch(request);
                    if (response.status < 200 || response.status >= 300) {
                        throw new HttpError(
                            response.statusText,
                            response.status
                        );
                    }
                    const { data } = await response.json();
                    storage.setItem('auth', JSON.stringify(data));
                })().finally(() => {
                    refreshPromise = null;
                });
                return refreshPromise;
            }
        },
        checkAuth: async () => {
            const auth = JSON.parse(storage.getItem('auth'));
            if (!auth) {
                throw new HttpError('', 401);
            }
            return authProvider.refreshAuth();
        },
        checkError: error => {
            const status = error.status;
            if (status === 401 || status === 403) {
                return authProvider.refreshAuth();
            }
            // other error code (404, 500, etc): no need to log out
            return Promise.resolve();
        },
        getIdentity: async () => {
            const auth = JSON.parse(localStorage.getItem('auth'));
            if (!auth) {
                return;
            }
            const { access_token } = auth;
            const request = new Request(`${apiBaseUrl}/users/me`, {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`,
                }),
            });
            const response = await fetch(request);
            if (response.status < 200 || response.status >= 300) {
                throw new HttpError(response.statusText, response.status);
            }
            const { data } = await response.json();
            return {
                id: data.id,
                fullName: getIdentityFullName(data),
                avatar: data.avatar,
            };
        },
        getPermissions: async () => {
            const auth = JSON.parse(localStorage.getItem('auth'));
            if (!auth) {
                return [];
            }
            const { access_token } = auth;

            if (!access_token) {
                throw new HttpError('', 401);
            }

            const { role } = jwt_decode<JwtPayload & { role: string }>(
                access_token
            );

            const request = new Request(`${apiBaseUrl}/roles/${role}`, {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`,
                }),
            });
            const response = await fetch(request);
            if (response.status < 200 || response.status >= 300) {
                throw new Error(response.statusText);
            }
            const { data } = await response.json();
            return data.name;
        },
    };

    return authProvider;
};
