# armit

The elegant small typescript based front-end dev-kits that includes most usefull feature for develop `miniprogram`, `web`, `nodejs`

## Development

The following instructions are for those who want to develop the armit core framework or plugins (e.g. if you intend to make a pull request). For instructions on how to build a project _using_ Armit, please see the [Getting Started guide](https://www.armitjs.io/docs/getting-started/).

### 1. Install top-level dependencies

`yarn`

The root directory has a `package.json` which contains build-related dependencies for tasks including:

- Building & deploying the docs
- Generating TypeScript types from the GraphQL schema
- Linting, formatting & testing tasks to run on git commit & push

### 2. Switch yarn to berry

`yarn set version berry`
`yarn plugin import workspace-tools`
`yarn install`

This runs the yarn "install" command, will scan those directories and look for children `package.json`. Their content is used to define the workspace topology (core, common, dependencies...), and cross-links monorepo dependencies.

### 3. Build all packages

`yarn g:build`
