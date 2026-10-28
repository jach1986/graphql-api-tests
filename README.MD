# GraphQL & REST API Test Suite

Automated API tests built with **Node.js**, **Mocha** and **Chai**, running on every push with **GitHub Actions**.

## What is tested

### Countries GraphQL API (`test/countries.test.js`)
- Query a country by code and validate name, capital and currency
- Non-existent code returns `null`
- Querying a field that is not in the schema returns a GraphQL error
- Schema check via introspection: the `Country` type exposes the expected fields

### Authentication REST API (`test/login.test.js`)
- Valid login returns an access token
- The token gives access to the current user (`/auth/me`)
- Wrong password is rejected (400)
- Request without a token is rejected (401)

## Utilities
- `get-schema.js` downloads the full GraphQL schema via introspection and saves it to `schema.graphql`
- `get-currencies.js` collects every unique currency returned by the API

## How to run
```bash
npm install
npm test
```

## Tech stack
Node.js · JavaScript · Mocha · Chai · GraphQL · REST · GitHub Actions