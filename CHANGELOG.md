# Changelog

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
