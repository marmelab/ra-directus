import { fetchUtils } from 'react-admin';

/**
 * A function that returns an HTTP client to use with react-admin and Directus. It adds the Authorization request headers.
 * @param storage The Web Storage to use for the auth token. Defaults to localStorage.
 * @returns An HTTP client to use with react-admin and Directus.
 */
export const directusHttpClient = (storage: Storage = localStorage) => (
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
