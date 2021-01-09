# [API] Ecoleta
![CircleCI](https://img.shields.io/circleci/build/github/DiegoVictor/ecoleta-api?style=flat-square&logo=circleci)
[![sqlite3](https://img.shields.io/badge/sqlite-5.0.0-003b57?style=flat-square&logo=sqlite&logoColor=white)](https://redis.io/)
[![eslint](https://img.shields.io/badge/eslint-6.8.0-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![airbnb-style](https://flat.badgen.net/badge/style-guide/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![jest](https://img.shields.io/badge/jest-26.6.3-brightgreen?style=flat-square&logo=jest)](https://jestjs.io/)
[![coverage](https://img.shields.io/codecov/c/gh/DiegoVictor/ecoleta-api?logo=codecov&style=flat-square)](https://codecov.io/gh/DiegoVictor/ecoleta-api)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://github.com/DiegoVictor/ecoleta-api/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)<br>
[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Ecoleta&uri=https%3A%2F%2Fraw.githubusercontent.com%2FDiegoVictor%2Fecoleta-api%2Fmaster%2FInsomnia_2020-06-06.json)


Responsible for provide data to the [`web`](https://github.com/DiegoVictor/ecoleta-web) and [`mobile`](https://github.com/DiegoVictor/ecoleta-app) front-ends. Allow to register points and set the items type that point receive. The app has friendly errors, validation, also a simple versioning was made.

## Table of Contents
* [Installing](#installing)
  * [Configuring](#configuring)
    * [SQLite](#sqlite)
      * [Migrations](#migrations)
      * [Seeds](#seeds)
    * [.env](#env)
* [Usage](#usage)
  * [Error Handling](#error-handling)
    * [Errors Reference](#errors-reference)
  * [Versioning](#versioning)
  * [Routes](#routes)
    * [Requests](#requests)
* [Running the tests](#running-the-tests)
  * [Coverage report](#coverage-report)

# Installing
Easy peasy lemon squeezy:
```
$ yarn
```
Or:
```
$ npm install
```
> Was installed and configured the [`eslint`](https://eslint.org/) and [`prettier`](https://prettier.io/) to keep the code clean and patterned.

## Configuring
The application use just one databases: [SQLite](https://www.sqlite.org/index.html).

### SQLite
Store the points and point's items. For more information to how to setup your database see:
* [knexfile.js](http://knexjs.org/#knexfile)
> You can find the application's `knexfile.js` file in the root folder.

#### Migrations
Remember to run the SQLite database migrations:
```
$ npx knex migrate:latest --knexfile knexfile.ts
```
> See more information on [Knex Migrations](http://knexjs.org/#Migrations).

Or simply:
```
$ yarn knex:migrate
```

#### Seeds
Also, remember to run the seeds, it will create some default items.
```
$ npx knex seed:run --knexfile knexfile.ts
```
> Read more on [Seed CLI](http://knexjs.org/#Seeds-CLI)

Or simply:
```
$ yarn knex:seed
```

### .env
In this file you may configure your app's url and port, also a url to documentation (this will be returned with error responses, see [error section](#error-handling)). Rename the `.env.example` in the root directory to `.env` then just update with your settings.

|key|description|default
|---|---|---
|APP_URL|App's url, when testing the [mobile version](https://github.com/DiegoVictor/ecoleta-app) on devices is strongly recommended to set this key to your [Expo](https://docs.expo.io/) url (e.g. `192.168.0.6`)|`http://localhost`
|APP_PORT|Port number where the app will run.|`3333`
|NODE_ENV|App environment.|`development`
|DOCS_URL|An url to docs where users can find more information about the app's internal code errors.|`https://github.com/DiegoVictor/ecoleta-api#errors-reference`

# Usage
To start up the app run:
```
$ yarn dev:server
```
Or:
```
$ npm run dev:server
```

## Error Handling
Instead of only throw a simple message and HTTP Status Code this API return friendly errors:
```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Point not found",
  "code": 144,
  "docs": "https://github.com/DiegoVictor/ecoleta-api#errors-reference"
}
```
> Errors are implemented with [@hapi/boom](https://github.com/hapijs/boom).
> As you can see a url to error docs are returned too. To configure this url update the `DOCS_URL` key from `.env` file.
> In the next sub section ([Errors Reference](#errors-reference)) you can see the errors `code` description.

### Errors Reference
|code|message|description
|---|---|---
|144|Point not found|The `id` sent not references an existing point in the database.

## Versioning
A simple versioning was made. Just remember to set after the `host` the `/v1/` string to your requests.
```
GET http://localhost:3333/v1/points
```

## Routes
|route|HTTP Method|params|description
|:---|:---:|:---:|:---:
|`/items`|GET| - |Lists points' items.
|`/points`|GET|`city`, `uf` and `items` query parameters.|Lists points.
|`/points/:id`|GET|`:id` of the point.|Return one point.
|`/points`|POST|Body with new point [form data](https://developer.mozilla.org/docs/Web/API/FormData) (See insomnia file for good example).|Create a new point.

### Requests
* `POST /points`

Request body:
```multipart
{
  "name": "Hackett, Becker and Fadel",
  "email": "contact@hbfadel.com",
  "whatsapp": "+551540331438",
  "latitude": -85.8713,
  "longitude": -73.3957,
  "city": "São Paulo",
  "uf": "SP",
  "items": "1, 2"
  "image": <file>
}
```

* `GET /points?city=Sao+Paulo&uf=SP&items=1,2`

# Running the tests
[Jest](https://jestjs.io/) was the choice to test the app, to run:
```
$ yarn test
```
Or:
```
$ npm run test
```

## Coverage report
You can see the coverage report inside `tests/coverage`. They are automatically created after the tests run.
