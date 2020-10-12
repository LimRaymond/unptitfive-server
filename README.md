# unptitfive-server (API)

Real time chat application API developed in Node.js using Express, Mongoose and Socket.io.

## Requirements

- NodeJS (>= 10)
- [MongoDB](https://docs.mongodb.com/manual/installation/)
- Git

## Deployment

Clone the repo:

```bash
git clone https://github.com/LimRaymond/unptitfive-server.git
cd unptitfive-server
```

Then run the following command to install the dependencies:

```bash
npm install
```

Finally run the following command to start the API server:

```bash
npm start
```

## Linter

### `npm run lint`

Lint all JS files in this directory, including immediate children as well as files that are deeper in the directory structure.<br />
See the [official ESLint website](https://eslint.org) for more information.

## Database Migration System

### `npm run migration:create [description]`

Create a new database migration with the provided description.

### `npm run migration:up`

Run all unapplied database migrations.

### `npm run migration:down`

Undo the last applied database migration.