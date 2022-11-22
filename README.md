# Directus Data Provider & Auth Provider For React-Admin

Directus Data Provider & Auth Provider for [react-admin](https://github.com/marmelab/react-admin), the frontend framework for building admin applications on top of REST/GraphQL services.

This repository contains:

- The actual `ra-directus` package
- A simple demo app you can run locally to try out `ra-directus` with your own Directus app

## The `ra-directus` package

- Please have a look at the [DOCUMENTATION](./packages/ra-directus/Readme.md)
- And also why not the [source code](https://github.com/marmelab/ra-directus/tree/main/src/packages/ra-directus)

## Simple Demo

### Prerequesites

You need to have a [Directus](https://directus.io/) account and to create a new Community Cloud project with the Demo template.
This should initialize a project with the `products` and `articles` collections which we are using in this demo.

### Initial setup

- Clone this project
- Update `packages/demo/src/App.tsx` with your Directus project URL :

```jsx
// in packages/demo/src/App.tsx
import * as React from "react";
import { Admin, Resource } from 'react-admin';
import { directusDataProvider } from 'ra-directus';

import { PostList } from './posts';

const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="products" {...products} />
        <Resource name="articles" {...articles} />
        <Resource name="directus_users" {...users} />
    </Admin>
);

export default App;
```

- Run `make install build-ra-directus run` to install the dependencies and start the Demo App

## License

This repository and the code it contains is licensed under the MIT License and sponsored by [marmelab](https://marmelab.com).
