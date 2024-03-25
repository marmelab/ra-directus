import { AuthProvider, HttpError } from 'react-admin';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { UserType } from '@directus/sdk';

const DefaultGetIdentityFullName = (user: UserType) =>
    `${user.last_name} ${user.first_name}`;

export type GetIdentityFullName = (user: UserType) => string;

/**
 * An AuthProvider for Directus with support for permissions and identity.
 * @example Basic Usage
 * import { Admin, Resource } from 'react-admin';
 * import { directusAuthProvider } from '@react-admin/ra-directus';
 * import { PostList } from './posts';
 *
 * export const App = () => (
 *    <Admin authProvider={directusAuthProvider('https://my.api.url')}>
 *       <Resource name="posts" list={PostList} />
 *    </Admin>
 * );
 *
 * @example With Session Storage
 * import { Admin, Resource } from 'react-admin';
 * import { directusAuthProvider } from '@react-admin/ra-directus';
 * import { PostList } from './posts';
 *
 * export const App = () => (
 *     <Admin authProvider={directusAuthProvider('https://my.api.url', { storage: sessionStorage })}>
 *         <Resource name="posts" list={PostList} />
 *     </Admin>
 * );
 *
 * @example With Automatic AuthToken Refresh
 * import { Admin, Resource, addRefreshAuthToAuthProvider } from 'react-admin';
 * import { directusAuthProvider, directusRefreshAuthToken } from '@react-admin/ra-directus';
 * import { PostList } from './posts';
 *
 * const refreshAuthToken = directusRefreshAuthToken('https://my.api.url');
 * const authProvider = addRefreshAuthToAuthProvider(directusAuthProvider('https://my.api.url'), refreshAuthToken);
 *
 * export const App = () => (
 *     <Admin authProvider={authProvider}>
 *         <Resource name="posts" list={PostList} />
 *     </Admin>
 * );
 *
 * @param apiBaseUrl The base URL of the Directus API
 * @param options
 * @param options.storage The Web Storage to use for the auth token. Defaults to localStorage.
 * @param options.getIdentityFullName A function to get the full name of the user. Defaults to `${user.last_name} ${user.first_name}`.
 * @returns An AuthProvider for Directus
 */
export const directusAuthProvider = (
    apiBaseUrl: string,
    {
        storage = localStorage,
        getIdentityFullName = DefaultGetIdentityFullName,
    }: {
        storage?: Storage;
        getIdentityFullName?: GetIdentityFullName;
    } = {
        storage: localStorage,
        getIdentityFullName: DefaultGetIdentityFullName,
    }
): AuthProvider => {
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
                storage.setItem('auth', JSON.stringify(data));
            } catch (error) {
                throw error;
            }
        },
        logout: async () => {
            const auth = JSON.parse(storage.getItem('auth'));
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
            storage.removeItem('auth');
        },
        checkAuth: async () => {
            const auth = JSON.parse(storage.getItem('auth'));
            if (!auth) {
                throw new HttpError('', 401);
            }
        },
        checkError: error => {
            const status = error?.status;
            if (status === 401 || status === 403) {
                return Promise.reject();
            }
            // other error code (404, 500, etc): no need to log out
            return Promise.resolve();
        },
        getIdentity: async () => {
            const auth = JSON.parse(storage.getItem('auth'));
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
            const auth = JSON.parse(storage.getItem('auth'));
            if (!auth) {
                return undefined;
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
