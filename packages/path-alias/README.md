# @armit/path-alias

A package to bind paths alias, resolving the `source` directory when the app is launched with ts-node, or resolving the `out` directory when ts-node isn't used. Includes some utilities in case if you need to generate paths dinamically depending of the code that is running.

This package has been designed to work with ESM projects (using [--loader](https://nodejs.org/api/esm.html#loaders) flag).

With this package, you can forget about those ugly imports like:

```ts
import { Jajaja } from "../../../../../../../jajaja.js";
import { Gegege } from "../../../../../gegege.js";
```

...and instead you can use alias like this (with the power of intellisense):

```ts
import { Jajaja } from "@alias-a/jajaja.js";
import { Gegege } from "@alias-b/gegege.js";
```

## Disclaimer

This package is designed to work in end-user backend aplications for unit-testing purpose (because of how [module alias works](https://github.com/ilearnio/module-alias/blob/dev/README.md#using-within-another-npm-package)). So this probably doesn't work in front-end applications, or apps that uses a bundler (like webpack for example).

Also, this package is **experimental** and probably can generate unexpected behaviors, or performance issues. For that reason, <u>**you must test intensively this package in all possible use cases if do you want to implement in production.**</u>

## Installation

If you don't have installed ts-node, now is the moment:

```bash
npm i --save-dev ts-node
```

...and install this package as a dependency:

```bash
npm i --save @armit/path-alias
```

## Usage

To explain all features of this package, we will use this project estructure as example:

```bash
# Your current working directory
project-folder
│   # The project dependencies
├── node_modules
│
│   # The transpiled files
├── dist
│   │   # The file when the app starts
│   ├── index.js
│   │
│   ├── folder-a
│   │   ├── ...
│   │   └── ...
│   ├── folder-b
│   │   ├── ...
│   │   └── ...
│   └── ...
│
│   # The source code
├── src
│   │   # The file when the app starts
│   ├── index.ts
│   │
│   ├── folder-a
│   │   ├── ...
│   │   └── ...
│   ├── folder-b
│   │   ├── ...
│   │   └── ...
│   ├── file-x.ts
│   └── ...
│
│   # The project configuration files
├── package.json
├── package-lock.json
└── tsconfig.json
```

### Configure your `tsconfig.json`

This package reads the `tsconfig.json` file (and is capable to find values if the file extends another configuration files) to declare the alias. A typical configuration coul be similar to this:

```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",

    "baseUrl": "./src",
    "paths": {
      "@file-x": ["./file-x.ts"],
      "@alias-a/*": ["./folder-a/*"],
      "@alias-b/*": ["./folder-b/*"]
    }
  }
}
```

The fields listed in the example of above are all required in order to the correct working of the package.

### ...with **ESM** projects

- Execute the source code with **ts-node:**

  ```bash
  node \
  --loader @armit/path-alias/esm \
  ./src/index.ts
  ```

- Execute the transpiled code:
  ```bash
  node \
  --loader @armit/path-alias/esm \
  ./dist/index.js
  ```

## Utilities

### Verbose mode

If you want to check if the project is runnig with ts-node (\*.ts) or directly with node (\*.js) at the beginning of the execution, you can define this environment variable:

```env
ARM_PATH_ALIAS_VERBOSE=true
```

This package includes `dotnet` package, so if you want, create a `.env` file in your current working directory.

### Function `isTsNodeRunning`

If you want to check if `ts-node` is running, you can execute this function:

```ts
import { isTsNodeRunning } from "@armit/path-alias";

const response = isTsNodeRunning(); // Returns a boolean
console.log("if ts-node is running?", response);
```

### Function `isPathAliasRunning`

If you want to check if `@armit/path-alias` is running, you can execute this function:

```ts
import { isPathAliasRunning } from "@armit/path-alias";

const response = isPathAliasRunning(); // Returns a boolean
console.log("if this package is running?", response);
```

### Function `pathResolve`

Resolve any subfolder of `"rootDir"` depending if **ts-node** is running. For example, imagine do you want to resolve the path `"./src/folder-a/*"`:

```ts
import { pathResolve } from "@armit/path-alias";

const path = pathResolve("./folder-a/*");
console.log("path:", path);
```

With **ts-node** the output is:

```bash
node \
--loader @armit/path-alias/esm \
./src/index.ts

# path: src/folder-a/*
```

With the transpiled code:

```bash
node \
--loader @armit/path-alias/esm \
./dist/index.js

# path: dist/folder-a/*
```

Optionally receives as second parameter an object with this options:

- `"absolute"`:

  > If `true`, returns the full path, otherwise returns the path relative to the current working directory.

- `"ext"`:
  > If true, converts the extensions `*.ts` / `*.mts` / `*.cts` / `*.js` / `*.mjs` / `*.cjs` depending if **ts-node** is running or not.

## Limitations

- The library requires a `"tsconfig.json"` file into the current working directory to work. Doesn't matter if that file extends another file, or be a part of a set of inhetirance, **while all required properties are accesible through its ancestors.**

- The resolve output between `"baseURL"` and the `"paths"` declared in the `"tsconfig.json"` file must always return a path inside of `"rootDir"` folder.
