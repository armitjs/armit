# @armit/eslint-config-bases

The composable eslint config bases that can be easily shared and fine-tuned by apps and packages for armitjs.

## Features

- **Customizable:** Simply extends the bases and fine-tune them.
- **Composable:** Add only what you need. Less unwanted side effects, increase perf.
- **Conventions:** Plugins enabled on file conventions patterns to increase perf.
- **Ease:** No need to install all the plugins in consuming apps/packages.
- **Monorepo:** Change detection aware.

## Install

```bash
yarn add --dev eslint @armit/eslint-config-bases:"workspace:^"
```

> **Tip** the [workspace:^](https://yarnpkg.com/features/workspaces#workspace-ranges-workspace) is supported by yarn and pnpm.

## Usage

In your app or package, create an `./apps/my-app/.eslintrc.js` file that extends any of the
existing base configs. For example:

```javascript
module.exports = {
  // Be sure to set root to true in monorepo.
  root: true,
  // Will help typescript extended rules.
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "tsconfig.json",
  },
  ignorePatterns: ["**/node_modules", "**/.cache", "build", ".next"],
  extends: [
    // It's better set vscode editor "source.organizeImports": false, because there may be competition between `source.organizeImports` and `import/order`
    "@armit/eslint-config-bases/typescript",
    "@armit/eslint-config-bases/sonar",
    "@armit/eslint-config-bases/regexp",
    "@armit/eslint-config-bases/react",
    "@armit/eslint-config-bases/jest",
    "@armit/eslint-config-bases/rtl",
    "@armit/eslint-config-bases/graphql-schema",
    "@armit/eslint-config-bases/storybook",
    "@armit/eslint-config-bases/playwright",

    // Add specific rules for your framework if needed.
    // ie:
    // - nextjs: 'plugin:@next/next/core-web-vitals',
    // - remix:  '@remix-run/eslint-config',
    // ...

    // Post configure the prettier base so there won't be
    // any conficts between eslint / prettier
    "@armit/eslint-config-bases/prettier",
  ],
  rules: {
    // Specific global rules for your app or package
  },
  overrides: [
    // Specific file rules for your app or package
  ],
};
```

> **Tip:** "@armit/eslint-config-bases/prettier" must be set at the end to disable any
> conflicting rules.

## Bases

You can find the bases in [./src/bases](./src/bases).

| Base                                            | Match convention                  | Scope                                                           |
| :---------------------------------------------- | :-------------------------------- | :-------------------------------------------------------------- |
| [typescript](./src/bases/typescript.js)         | _all_                             | Naming conventions, consistent imports, import sorting...       |
| [sonar](./src/bases/sonar.js)                   | `*.{js,jsx,ts,tsx}`               | Keep levels of code complexity sane. (excl test and stories)    |
| [regexp](./src/bases/regexp.js)                 | `*.{js,jsx,jsx,tsx}`              | Keep regexp consistent and safer.                               |
| [react](./src/bases/react.js)                   | `*.{jsx,tsx}`                     | Recommendations for react, react-hooks and jsx projects.        |
| [jest](./src/bases/jest.js)                     | `**/?(*.)+(test).{js,jsx,ts,tsx}` | Catch inconsistencies or error in jest tests.                   |
| [vitest](./src/bases/vitest.js)                 | `**/?(*.)+(test).{js,jsx,ts,tsx}` | Catch inconsistencies or error in vitest tests.                 |
| [rtl](./src/bases/rtl.js)                       | `**/?(*.)+(test).{js,jsx,ts,tsx}` | Potential errors / deprecations in react-testing-library tests. |
| [graphql-schema](./src/bases/graphql-schema.js) | `*.graphql`                       | Ensure validity of graphql schema files.                        |
| [storybook](./src/bases/storybook.js)           | `*.stories.{ts,tsx,mdx}`          | Potential errors / deprecations in stories.                     |
| [playwright](./src/bases/playwright.js)         | `**/e2e/**/*.test.{js,ts}`        | Post configure eslint for prettier compatibility.               |
| [prettier](./src/bases/prettier.js)             | _all_                             | Post configure eslint for prettier compatibility.               |

> **Notes**:
>
> - The order is important. Some bases will disable or tune previously defined
>   rules. For example the [react base](./src/bases/react.js) will tune the naming conventions
>   for function components and increase recommended cognitive complexity. The [typescript base](./src/bases/typescript.js)
>   will also relax conventions for javascript files.
>
> - Based on filename conventions some rules are relaxed or disabled to avoid false positives and
>   keep a good level of performance. For example the [sonar base](./src/bases/sonar.js) won't run on
>   test and storybook files. If you work on different conventions the patterns must be updated.

## Prettier integration

To prevent conflicts between prettier and eslint, you must re-export the prettier base from `@armit/eslint-config-bases`.

```javascript
const { getPrettierConfig } = require("@armit/eslint-config-bases/helpers");
module.exports = {
  ...prettierConfig,
  overrides: [
    {
      // optional overrides per project file match
      files: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
      rules: {
        "@typescript-eslint/naming-convention": "off",
      },
    },
  ],
};
```

> **Tip**: You can tune the provided [prettier.base.config](./src/prettier.base.config.js) for your own needs.

## Notes

### Typescript

Generic typescript project, mostly based on

| Type/Plugin                                                                                      | Comment                                                                      |
| :----------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------- |
| [eslint:recommended](https://eslint.org/docs/rules/)                                             | The basics for code linting.                                                 |
| [@typescript-eslint/recommended](https://typescript-eslint.io/rules/)                            | The basics for typescript.                                                   |
| [@typescript-eslint/consistent-type](https://typescript-eslint.io/rules/consistent-type-imports) | Use TS 3.8+ imports/exports, helps with [esbuild](https://esbuild.github.io) |
| [@typescript-eslint/naming-convention](https://typescript-eslint.io/rules/naming-convention)     |                                                                              |
| [eslint-plugin-import](https://github.com/import-js/eslint-plugin-import)                        | Order imports                                                                |

## Sonarjs

| Type/Plugin                                                                               | Comment                      |
| :---------------------------------------------------------------------------------------- | :--------------------------- |
| [eslint-plugin-sonarjs/recommended](https://github.com/SonarSource/eslint-plugin-sonarjs) | Help to keep complexity sane |

### React

| Type/Plugin                                                                                                             | Comment                                  |
| :---------------------------------------------------------------------------------------------------------------------- | :--------------------------------------- |
| [eslint-plugin-react/recommended](https://github.com/yannickcr/eslint-plugin-react)                                     |                                          |
| [eslint-plugin-react-hooks/recommended](https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks) |                                          |
| [eslint-plugin-jsx-a11y/recommended](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)                              | Helps to produce accessibility-ready jsx |

### Jest

| Type/Plugin                                                                            | Comment                     |
| :------------------------------------------------------------------------------------- | :-------------------------- |
| [eslint-plugin-jest/recommended](https://github.com/jest-community/eslint-plugin-jest) | Jest recommended practices. |

### Vitest

| Type/Plugin                                               | Comment                       |
| :-------------------------------------------------------- | :---------------------------- |
| [vitest](https://github.com/veritem/eslint-plugin-vitest) | Vitest recommended practices. |

### React Testing Library

| Type/Plugin                                                                                                   | Comment                               |
| :------------------------------------------------------------------------------------------------------------ | :------------------------------------ |
| [eslint-plugin-testing-library/recommended](https://github.com/testing-library/eslint-plugin-testing-library) | Ease when using react-testing-library |

### Regexp

| Type/Plugin                                                                           | Comment |
| :------------------------------------------------------------------------------------ | :------ |
| [eslint-plugin-regexp/recommended](https://github.com/ota-meshi/eslint-plugin-regexp) |         |

### Etc

...
