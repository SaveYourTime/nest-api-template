<p align="center">
  <img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" />
</p>
  
<p align="center">A performance oriented Nest.js application template for building efficient and scalable server-side applications, with TypeScript, TypeORM and MySQL.</p>

## Description

This template makes it easier to get up and running with a `well-structured` Nest.js and TypeScript application.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

1. Clone the project `git clone https://github.com/SaveYourTime/nest-api-template.git`
2. Install dependencies (we use `yarn`)
3. Create a `.env` file in the root like the `.env.example` file.

> ⚠️ Ensure you have setup the `.env` file, before starting the server.

### Installation

```bash
# clone and install dependencies
git clone https://github.com/SaveYourTime/nest-api-template.git
cd nest-api-template
yarn

# Run in development and serve at localhost:3000
yarn start:dev

# build for production
yarn build

# Run in production and serve at localhost:3000
yarn start
```

### Seeds

For seed data just run the following comand. This is helpful in dev for making fake user.

```
yarn seed:run
```

## Features

`nest-api-template` provides a lot of features out of the box. Here's an overview of the included components and tools.

- **Nest.js** - A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
- **TypeScript** - Superset of JavaScript which primarily provides optional static typing, classes and interfaces.
- **ESLint** - The pluggable linting utility. Find and fix problems in your JavaScript code.
- **Jest** - A delightful JavaScript Testing Framework with a focus on simplicity.
- **Prettier** - An opinionated code formatter. Enforces a consistent style by parsing your code and re-printing it with its own rules.
- **husky** - Git hooks 🎣prevent bad git commit and git push.
- **lint-staged** - Run linters against staged git files and don't let 💩slip into your code base.
- **TypeORM** - The most mature Object Relational Mapper (ORM) available in the node.js world written in TypeScript.
- **typeorm-seeding** - A delightful way to seed test data into your database.
- **Swagger** - Swagger takes the manual work out of API documentation, with a range of solutions for generating, visualizing, and maintaining API docs.
- **Passport** - Simple, unobtrusive authentication middleware for Node.js. Support `Local`, `Facebook`, `Google` and `LINE` login in this template.

## Pre-Commit Hook

We add `hasky` and `lint-staged` for linting and formatting your code before commit. That can maybe take time. ⏳

## Teck Stack

- Nest.js
- MySQL
- TypeScript
- TypeORM
- Authenticate with cookie based JWT
- Passport with Local, Facebook, Google, LINE Login

---

## Folder Structure

#### src

##### `src/auth`, `src/providers`, `src/tasks`, `src/users`, `src/[feature]`

Having `module`, `controller`, `service`, `entity`, `repository` inside.

> naming these files like this: `users.module.ts`, `users.controller.ts`, `users.service.ts`, `user.entity.ts`, `user.repository.ts`

- **Modules** organizes code relevant for a specific `feature`, keeping `code organized` and establishing clear boundaries.
- **Controllers** are responsible for handling `incoming requests` and `returning responses` to the client.
- **Services** are responsible for `data storage` and retrieval, and is designed to be used by the Controller.

##### `src/config`

The typeorm configuration file for creating a new connection.

##### `src/database`

Here's where we create a factory and a seed script.

##### `src/app.module.ts`

The root module of the application.

##### `src/main.ts`

The entry file of the application which uses the core function `NestFactory` to create a Nest application instance.

##### `.env`

A file for storing environment-specific variables `NAME=VALUE`, separated by new lines.
