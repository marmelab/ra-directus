import jwt_decode, { JwtPayload } from 'jwt-decode';
import { HttpError } from 'react-admin';

/**
 * A factory that returns function that refreshes the auth token when it is expired.
 * @param apiBaseUrl The base URL of the Directus API
 * @param storage The Web Storage to use for the auth token. Defaults to localStorage.
 * @returns A function that refreshes the auth token when it is expired. To be used with addRefreshAuthToAuthProvider or addRefreshAuthToDataProviderAsync.
 */
export const directusRefreshAuthToken = (
    apiBaseUrl: string,
    storage: Storage = localStorage
) => {
    let refreshPromise: Promise<void> = null;

    return async () => {
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
            ? jwt_decode<JwtPayload>(access_token).exp < now.getTime() / 1000
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
                    throw new HttpError(response.statusText, response.status);
                }
                const { data } = await response.json();
                storage.setItem('auth', JSON.stringify(data));
            })().finally(() => {
                refreshPromise = null;
            });
            return refreshPromise;
        }
    };
};
