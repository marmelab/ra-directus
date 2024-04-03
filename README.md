# Directus Data Provider & Auth Provider For React-Admin

Directus Data Provider & Auth Provider for [react-admin](https://github.com/marmelab/react-admin), the frontend framework for building admin applications on top of REST/GraphQL services.

[![Documentation]][DocumentationLink] 
[![Source Code]][SourceCodeLink] 

[Documentation]: https://img.shields.io/badge/Documentation-darkgreen?style=for-the-badge
[Source Code]: https://img.shields.io/badge/Source_Code-blue?style=for-the-badge

[DocumentationLink]: ./packages/ra-directus/Readme.md 'Documentation'
[SourceCodeLink]: https://github.com/marmelab/ra-directus/tree/main/packages/ra-directus 'Source Code'

This repository contains:

- The actual `ra-directus` package
- A simple demo app you can run locally to try out `ra-directus` with your own Directus app

## Simple Demo

### Initial setup

- Clone this project
- Run `make init run` to install the dependencies and start the Demo App
- Vite should show the local URL where the development server is running
- Go to this url and login with:
    - login: `admin@example.com`
    - password: `d1r3ctu5` 
- Your Directus environnement should run on this [http://localhost:8055/](http://localhost:8055/)
- You can login with same credentials

### Stop the Database

- Run `make stop-directus` to stop the database Docker container 

## License

This repository and the code it contains is licensed under the MIT License and sponsored by [marmelab](https://marmelab.com).
