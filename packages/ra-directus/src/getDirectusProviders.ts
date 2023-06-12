import {
    addRefreshAuthToDataProvider,
    addRefreshAuthToAuthProvider,
} from 'ra-core';
import { directusRefreshAuthToken } from './directusRefreshAuthToken';
import {
    directusAuthProvider,
    GetIdentityFullName,
} from './directusAuthProvider';
import { directusHttpClient } from './directusHttpClient';
import { directusDataProvider } from './directusDataProvider';
import { fetchUtils } from 'ra-core';

/**
 * A function that returns a dataProvider and an authProvider to use react-admin with Directus, configured to support automatic AuthToken refresh.
 * @example Basic Usage
 * import { Admin, Resource } from 'react-admin';
 * import { getDirectusProviders } from '@react-admin/ra-directus';
 * import { PostList } from './posts';
 *
 * const { authProvider, dataProvider } = getDirectusProviders('https://my.api.url');
 *
 * export const App = () => (
 *    <Admin authProvider={authProvider} dataProvider={dataProvider}>
 *        <Resource name="posts" list={PostList} />
 *    </Admin>
 * );
 * @param apiBaseUrl The base URL of the Directus API
 * @param options.storage The Web Storage to use for the auth token. Defaults to localStorage.
 * @param options.getIdentityFullName A function to get the full name of the user. Defaults to `${user.last_name} ${user.first_name}`.
 * @param options.httpClient The HTTP client to use. Defaults to `directusHttpClient`.
 * @returns An object containing the dataProvider, the authProvider, the httpClient and the refreshAuthToken function.
 */
export const getDirectusProviders = (
    apiBaseUrl: string,
    {
        storage,
        getIdentityFullName,
        httpClient,
    }: {
        storage?: Storage;
        getIdentityFullName?: GetIdentityFullName;
        httpClient?: typeof fetchUtils.fetchJson;
    } = {}
) => {
    const authProvider = directusAuthProvider(apiBaseUrl, {
        storage,
        getIdentityFullName,
    });
    const dataProvider = directusDataProvider(
        apiBaseUrl,
        httpClient ?? directusHttpClient(storage)
    );

    const refreshAuthToken = directusRefreshAuthToken(apiBaseUrl, storage);

    return {
        authProvider: addRefreshAuthToAuthProvider(
            authProvider,
            refreshAuthToken
        ),
        dataProvider: addRefreshAuthToDataProvider(
            dataProvider,
            refreshAuthToken
        ),
        httpClient,
        refreshAuthToken,
    };
};
