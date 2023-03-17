import React from 'react';
import { Admin, Resource } from 'react-admin';
import { getDirectusProviders } from 'ra-directus';
import articles from './articles';
import products from './products';
import users from './users';

const { authProvider, dataProvider } = getDirectusProviders(
    import.meta.env.VITE_DIRECTUS_URL
);

const App = () => (
    <Admin dataProvider={dataProvider} authProvider={authProvider}>
        <Resource name="products" {...products} />
        <Resource name="articles" {...articles} />
        <Resource name="directus_users" {...users} />
    </Admin>
);

export default App;
