import { AuthProvider, fetchUtils } from 'react-admin';
import jwt_decode, { JwtPayload } from 'jwt-decode';

export const httpClient = (url: string, options: fetchUtils.Options = {}) => {
    const headers = new Headers({ Accept: 'application/json' });
    const { access_token } = JSON.parse(localStorage.getItem('auth'));
    headers.set('Authorization', `Bearer ${access_token}`);
    return fetchUtils.fetchJson(url, { ...options, headers });
};

export const directusAuthProvider = (apiBaseUrl: string): AuthProvider => ({
    login: ({ username, password }) => {
        const request = new Request(`${apiBaseUrl}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
                email: username,
                password,
            }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });
        return fetch(request)
            .then(response => {
                console.log('login', response);
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(({ data }) => {
                localStorage.setItem('auth', JSON.stringify(data));
            })
            .catch(error => {
                throw error;
            });
    },
    logout: () => {
        console.log('logout');
        const { access_token, refresh_token } = JSON.parse(
            localStorage.getItem('auth')
        );
        if (!access_token || !refresh_token) {
            return Promise.resolve();
        }
        const request = new Request(`${apiBaseUrl}/auth/logout`, {
            method: 'POST',
            body: JSON.stringify({ refresh_token }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                localStorage.removeItem('auth');
                Promise.resolve();
            })
            .catch(error => {
                throw error;
            });
    },
    checkAuth: () => {
        console.log('checkAuth');
        const auth = JSON.parse(localStorage.getItem('auth'));
        if (!auth) {
            return Promise.reject();
        }
        const { access_token, refresh_token } = auth;

        const decoded = jwt_decode<JwtPayload>(access_token);
        const now = new Date();

        if (decoded.exp < now.getTime() / 1000) {
            const request = new Request(`${apiBaseUrl}/auth/refresh`, {
                method: 'POST',
                body: JSON.stringify({ refresh_token, mode: 'json' }),
                headers: new Headers({ 'Content-Type': 'application/json' }),
            });
            return fetch(request)
                .then(response => {
                    if (response.status < 200 || response.status >= 300) {
                        throw new Error(response.statusText);
                    }
                    return response.json();
                })
                .then(({ data }) => {
                    localStorage.setItem('auth', JSON.stringify(data));
                })
                .catch(error => {
                    throw error;
                });
        }
        return Promise.resolve();
    },
    checkError: error => {
        const status = error.status;
        if (status === 401 || status === 403) {
            return Promise.reject();
        }
        // other error code (404, 500, etc): no need to log out
        return Promise.resolve();
    },
    getIdentity: () => {
        console.log('getIdentity');
        const { access_token } = JSON.parse(localStorage.getItem('auth'));
        const request = new Request(`${apiBaseUrl}/users/me`, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`,
            }),
        });
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(({ data }) => {
                return Promise.resolve({
                    id: data.id,
                    fullName: data.first_name + ' ' + data.last_name,
                    avatar: data.avatar,
                });
            })
            .catch(error => {
                throw error;
            });
    },
    getPermissions: () => {
        console.log('getPermissions');
        const { access_token } = JSON.parse(localStorage.getItem('auth'));

        if (!access_token) {
            return Promise.reject();
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
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(({ data }) => {
                console.log(data.name);
                return Promise.resolve(data.name);
            })
            .catch(error => {
                throw error;
            });
    },
});
