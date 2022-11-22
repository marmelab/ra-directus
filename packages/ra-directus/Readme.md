# Directus Data Provider & Auth Provider For React-Admin

Directus Data Provider & Auth Provider for [react-admin](https://github.com/marmelab/react-admin), the frontend framework for building admin applications on top of REST/GraphQL services.

This package provides:

- A `directusDataProvider`
- A `directusAuthProvider`

## Installation

```sh
yarn add ra-directus
# or
npm install --save ra-directus
```

## Data Provider

### REST Dialect

This Data Provider fits REST APIs powered by [Directus](https://directus.io/).

| Method             | API calls                                                                                                |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| `getList`          | `GET http://my.api.url/items/posts?page=1&limit=10&sort=title&meta=*`                                    |
| `getOne`           | `GET http://my.api.url/items/posts/123`                                                                  |
| `getMany`          | `GET http://my.api.url/items/posts?filter={"id":{"_in":["123","456","789"]}}`                            |
| `getManyReference` | `GET http://my.api.url/items/posts?filter={"author_id":{"_eq":119}}`                                     |
| `create`           | `POST http://my.api.url/items/posts`                                                                     |
| `update`           | `PATCH http://my.api.url/items/posts/123`                                                                |
| `updateMany`       | `PATCH http://my.api.url/items/posts`                                                                    |
| `delete`           | `DELETE http://my.api.url/items/posts/123`                                                               |

### Usage

```jsx
// in src/App.js
import * as React from "react";
import { Admin, Resource } from 'react-admin';
import { directusDataProvider } from 'ra-directus';

import { PostList } from './posts';

const App = () => (
    <Admin dataProvider={directusDataProvider('http://my-app.directus.app')}>
        <Resource name="posts" list={PostList} />
    </Admin>
);

export default App;
```

### Adding Custom Headers

The provider function accepts an HTTP client function as second argument. By default, they use react-admin's `fetchUtils.fetchJson()` as HTTP client. It's similar to HTML5 `fetch()`, except it handles JSON decoding and HTTP error codes automatically.

That means that if you need to add custom headers to your requests, you just need to *wrap* the `fetchJson()` call inside your own function:

```jsx
import { fetchUtils, Admin, Resource } from 'react-admin';
import { directusDataProvider } from 'ra-directus';

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    // add your own headers here
    options.headers.set('X-Custom-Header', 'foobar');
    return fetchUtils.fetchJson(url, options);
};
const dataProvider = directusDataProvider('http://my-app.directus.app', httpClient);

render(
    <Admin dataProvider={dataProvider} title="Example Admin">
       ...
    </Admin>,
    document.getElementById('root')
);
```

Now all the requests to the REST API will contain the `X-Custom-Header: foobar` header.

**Tip**: The most common usage of custom headers is for authentication. `fetchJson` has built-on support for the `Authorization` token header:

```js
const httpClient = (url, options = {}) => {
    options.user = {
        authenticated: true,
        token: 'SRTRDFVESGNJYTUKTYTHRG'
    };
    return fetchUtils.fetchJson(url, options);
};
```

Now all the requests to the REST API will contain the `Authorization: SRTRDFVESGNJYTUKTYTHRG` header.

### Filter

To search on all string and text fields: use `q` parameter.

```jsx
const PostFilter = [
    <TextInput source="q" label="Search" alwaysOn />,
];

const PostList = () => (
    <List filters={<PostFilter />}>
        ...
    </List>
);
```

You can use [Directus filter operators](https://docs.directus.io/reference/filter-rules.html#filter-operators) by adding one operator in the `source` props separated by a `/` :

```jsx
const PostFilter = [
    <DateInput source="publish_date/_gte" label="Published after" />,
];

const PostList = () => (
    <List filters={<PostFilter />}>
        ...
    </List>
);
```

### Directus system collections

Directus has some system collections, for example `directus_users`. You can use them as resource, please note that every resource starting with `directus_` will be considered as Directus system collections.

```jsx
const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="directus_users" list={UsersList} edit={UsersEdit} />
  </Admin>
);
```

## License

This data provider is licensed under the MIT License, and sponsored by [marmelab](https://marmelab.com).
