# My Utilities Backend

![Coverage Badges](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/MadeleenRoestorff/e3835b95ac826635d78b5d047b92b16a/raw/mygas_heads_main.json)
[![ESLinter Badges](https://img.shields.io/badge/Linter-ESlint-4B32C3?logo=ESLint)](https://eslint.org/docs/latest/rules/)
[![Prettier Badges](https://img.shields.io/badge/Formater-Prettier-F7B93E?logo=Prettier)](https://prettier.io/docs/en/precommit.html)
[![license](https://img.shields.io/badge/License-MIT-F0047F.svg)](LICENSE)
[![GitHub Workflow Status (with branch)](https://img.shields.io/github/actions/workflow/status/MadeleenRoestorff/mygas/validate-test-script.yml)](https://github.com/MadeleenRoestorff/mygas/actions)

This repository contains the server-side code for My Utilities, a web application that helps you keep track of your utilities. The frontend code is located in a separate repository. The backend is built with ExpressJS and written in TypeScript, and uses the Sequelize ORM to map to a SQLite database. ExpressJS is used for creating the API endpoints. Jest is used for testing, and ESLint and Prettier are used for formatting and consistency.

## Installation

To install My Utilities, clone the repository and install the dependencies using npm:

```bash
git clone https://github.com/MadeleenRoestorff/mygas.git
cd mygas
npm install
```

## Usage Steps

To run the app during development, use the following command:

```bash
npm run dev
```

This will compile the TypeScript code to JavaScript and start the server on http://localhost:8000 using nodemon.

If you prefer to run the distributed JavaScript code directly, use the following command:

```bash
npm start
```

This will start the server using the pre-compiled (npm run build) JavaScript files.

## Logger

This project includes a custom logger class that can be used to log various events in the application. The logger can write logs to a file on the local filesystem or to a Slack channel, depending on the environment the application is running in.

The logger is used to capture errors, API requests, database errors, login attempts, and more. By default, logs are written to a file in the logs directory. In production, logs are sent to a designated Slack channel for easy monitoring.

To use the logger, simply import the Logger class from the logger module:

```typescript
import { Logger } from "../models/logger-model";
const logger = new Logger();

//The logger can then be used to write messages to the log file or to the Slack channel:
logger.info("Server started.");
logger.error("Unauthorized request detected.");
```

The logger class is highly customizable, and can be configured to meet the specific needs of your application. For more information on how to use the logger, please see the documentation in the logger-model.ts file.

## API Endpoints

My Utilities includes several API endpoints that allow you to manage your utility usage. Some of these endpoints are restricted and require authentication. To access these endpoints, you must have a user account and obtain a JSON Web Token (JWT).

### Authentication

New user accounts are created manually.
To log in, send a POST request to the /login endpoint with a JSON payload containing your username and password. This will return a JWT that you can use to authenticate future requests.

### Utility Usage

Once you have obtained a JWT, you can use it to access the restricted utility usage endpoints. These endpoints allow you to create, read, update, and delete utility usage records.

### API Reference

| Route              | HTTP Method | Request Parameters                         | Response Type                           | Description                                 |
| :----------------- | :---------- | :----------------------------------------- | :-------------------------------------- | ------------------------------------------- |
| `/login`           | `POST`      | username, password                         | token                                   | Logs a user in and returns a JSON web token |
| `/gas`             | `GET`       | -                                          | Array of Gas Record Objects             | Retrieves all gas records                   |
| `/gas`             | `POST`      | units, topup, measuredAt                   | The new Gas Record Object               | Adds a new gas record                       |
| `/gas/:id`         | `GET`       | id (in URL path)                           | The requested Gas Record Object         | Retrieves a single gas record by ID         |
| `/gas/:id`         | `PATCH`     | units, topup, measuredAt, id (in URL path) | The updated Gas Record Object           | Updates a single gas record by ID           |
| `/electricity`     | `GET`       | -                                          | Array of Electricity Record Objects     | Retrieves all electricity records           |
| `/electricity`     | `POST`      | electricity, measuredAt                    | The new Electricity Record Object       | Adds a new electricity record               |
| `/electricity/:id` | `GET`       | id (in URL path)                           | The requested Electricity Record Object | Retrieves a single electricity record by ID |
| `/electricity/:id` | `PATCH`     | electricity, measuredAt, id (in URL path)  | The updated Electricity Record Object   | Updates a single electricity record by ID   |

### Request and Response parameters definitions

| Parameter     | Type          | Required                  | Description                                                                         |
| :------------ | :------------ | :------------------------ | :---------------------------------------------------------------------------------- |
| `username`    | `string`      | Yes                       | The username of the user                                                            |
| `password`    | `string`      | Yes                       | The password of the user                                                            |
| `token`       | `string`      | -                         | The authentication token                                                            |
| `id`          | `number`      | Yes for `PATCH` or `:/id` | This ID refers to GasLogID or ElecLogID of the utility that is requested or updated |
| `units`       | `number`      | `units` or `topup`        | The gas units that are left on the gas meter                                        |
| `topup`       | `number`      | `topup` or `units`        | The cost of the newly added gas units                                               |
| `measuredAt`  | `Date string` | Optional                  | If the measurements were taken at a earlier date, provide measurement date          |
| `GasLogID`    | `number`      | -                         | The ID of the Gas record                                                            |
| `createdAt`   | `Date`        | -                         | The date when the record was created in the database                                |
| `updatedAt`   | `Date`        | -                         | The date when the record was updated in the database                                |
| `uuid`        | `string`      | -                         | The unique identifier for record                                                    |
| `electricity` | `number`      | Yes                       | The electricity meter reading                                                       |
| `ElecLogID`   | `number`      | -                         | The ID of the Electricity record                                                    |

Note: The GasLogID, ElecLogID, uuid, createdAt, and updatedAt parameters are automatically generated by the Sequelize ORM and do not need to be provided in the request.

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

## Tech Stack

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [ExpressJS](https://expressjs.com/)
- [SQLite3](https://www.sqlite.org/index.html)
- [Sequelize](https://sequelize.org/)
- [Jest](https://jestjs.io/) with supertest
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [nodemon](https://nodemon.io/)
- [Husky](https://typicode.github.io/husky/)

### Notes

If you want skip the husky validate (ESlint and prettier) hook use --no-verify
git commit -m "yolo!" --no-verify.
Run npm test to ensure that your changes pass all tests.

## Acknowledgements

- [OpenAI](https://openai.com/) for providing the ChatGPT model used to generate this README.
- [Mintlify](https://marketplace.visualstudio.com/items?itemname=mintlify.document) for helping me write code comments.
