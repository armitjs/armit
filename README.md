# Armitjs

A elegant small typescript based front-end dev-kits that includes most usefull feature for develop `miniprogram`

<p align="left">
  <a aria-label="Build" href="https://github.com/armitjs/armit/actions?query=workflow%3ACI">
    <img alt="build" src="https://img.shields.io/github/workflow/status/armitjs/armit/CI-lib-common/main?label=CI&logo=github&style=flat-quare&labelColor=000000" />
  </a>
  <a aria-label="LoC">  
    <img alt="LoC" src="https://img.shields.io/tokei/lines/github/armitjs/armit?style=flat-quare&labelColor=000000" />
  </a>
  <a aria-label="Top language" href="https://github.com/armitjs/armit/search?l=typescript">
    <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/armitjs/armit?style=flat-square&labelColor=000&color=blue">
  </a>
  <a aria-label="Licence" href="https://github.com/armitjs/armit/blob/main/LICENSE">
    <img alt="Licence" src="https://img.shields.io/github/license/armitjs/armit?style=flat-quare&labelColor=000000" />
  </a>
</p>

## Development

The following instructions are for those who want to develop the armit core framework or plugins (e.g. if you intend to make a pull request). For instructions on how to build a project _using_ Armit, please see the [Getting Started guide](https://www.armitjs.io/docs/getting-started/).

### 1. Install top-level dependencies

`yarn`

The root directory has a `package.json` which contains build-related dependencies for tasks including:

- Building & deploying the docs
- Generating TypeScript types from the GraphQL schema
- Linting, formatting & testing tasks to run on git commit & push

### 2. Switch yarn to berry

- `yarn set version berry`
- `yarn plugin import workspace-tools`
- `yarn install`

This runs the yarn "install" command, will scan those directories and look for children `package.json`. Their content is used to define the workspace topology (core, common, dependencies...), and cross-links monorepo dependencies.

### 3. Build all packages

- `yarn g:build`

### 4. Publishing

> Optional

If you need to share some packages outside of the monorepo, you can publish them to npm or private repositories.
An example based on tsup is present in each package. Versioning and publishing can be done with [atlassian/changeset](https://github.com/atlassian/changesets),
and it's simple as typing:

```bash
$ yarn g:changeset
```

Follow the instructions... and commit the changeset file. A "Version Packages" P/R will appear after CI checks.
When merging it, a [github action](./.github/workflows/release-or-version-pr.yml) will publish the packages
with resulting semver version and generate CHANGELOGS for you.
