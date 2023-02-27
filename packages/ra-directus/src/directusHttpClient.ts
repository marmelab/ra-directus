import { fetchUtils } from 'react-admin';

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
