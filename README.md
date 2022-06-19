# node-crud-api

[Assignment](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md)

[Study materials](https://github.com/rolling-scopes-school/tasks/blob/master/node/modules/crud-api/README.md)

# Installing

Install with `npm install`

Packages used for testing : `vitest`, `supertest`, `c8`

# Running

Development server with nodemon: `start:dev`

Production server: `start:prod`

Cluster server: `start:multi`

# Using

Server starts with 8000 port, you can change starting port in `.env` file.

Users endpoint: `http://localhost:8000/api/users`

# Testing

Run tests with: `npm t`

Tests for cluster server is separated, you can run them with:

```bash
node run start:multi # console 1
node run test:multi  # console 2
```

Test coverage: `npm run coverage`
