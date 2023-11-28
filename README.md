# Directus Data Provider & Auth Provider For React-Admin

Directus Data Provider & Auth Provider for [react-admin](https://github.com/marmelab/react-admin), the frontend framework for building admin applications on top of REST/GraphQL services.

[![Documentation]][DocumentationLink] 
[![Source Code]][SourceCodeLink] 

[Documentation]: https://img.shields.io/badge/Documentation-green?style=for-the-badge
[Source Code]: https://img.shields.io/badge/Source_Code-blue?style=for-the-badge

[DocumentationLink]: ./packages/ra-directus/Readme.md 'Documentation'
[SourceCodeLink]: https://github.com/marmelab/ra-directus/tree/main/packages/ra-directus 'Source Code'

This repository contains:

- The actual `ra-directus` package
- A simple demo app you can run locally to try out `ra-directus` with your own Directus app

## Simple Demo

### Prerequesites

You need to have a [Directus](https://directus.io/) account and to create a new Community Cloud project with the Demo template.
This should initialize a project with the `products` and `articles` collections which we are using in this demo.

### Initial setup

- Clone this project
- Setup environment variables. You can do this by creating a `.env` file in `packages-demo`. The following variable is required:

```
VITE_DIRECTUS_URL=http://my-app.directus.app
```

- Run `make install build-ra-directus run` to install the dependencies and start the Demo App

## License

This repository and the code it contains is licensed under the MIT License and sponsored by [marmelab](https://marmelab.com).
