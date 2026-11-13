# Changelog

## 3.0.0

- Publish modern ESM and CommonJS package exports ([#15](https://github.com/marmelab/ra-directus/pull/15))

### Breaking Changes

`ra-directus` now publishes its ES modules and CommonJS builds in `dist/`, behind an [`exports`](https://nodejs.org/api/packages.html#package-entry-points) map. Only the package root can be imported, so these undocumented paths no longer resolve:

- the old build folders: `ra-directus/lib/*` and `ra-directus/esm/*`
- the sources: `ra-directus/src/*`, even though they are still published
- the manifest: `ra-directus/package.json`

## 2.1.0

-   Return the `httpClient` (default or provided) from `getDirectusProviders`

## 2.0.0

-   Upgrade `react-admin` to v5
-   Change imports from `ra-core` to `react-admin`

## 1.1.0

-   Remove `addRefreshAuthToDataProvider` and `addRefreshAuthToAuthProvider` methods that are included in `ra-core` since version `4.9.0`. 

To avoid breaking changes, we re-export the functions from `ra-core`.

## 1.0.1

-   Fix `dataProvider` and `authProvider` ignore the provided storage

## 1.0.0

-   Initial release
