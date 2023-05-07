# @armit/config-loader

Find and load configuration from a package.json property, rc file, or CommonJS module, also support `.ts` file type:

it will search up the directory tree, checking each of these places in each directory, until it finds some acceptable configuration (or hits the home directory).

Alternative config loaer : https://github.com/egoist/joycon

## config loader support below config file pattern

```ts
'package.json',
`.${moduleName}rc`,
`.${moduleName}rc.json`,
`.${moduleName}rc.yaml`,
`.${moduleName}rc.yml`,
`.${moduleName}rc.js`,
`.${moduleName}rc.ts`,
// cjs
`.${moduleName}rc.cjs`,
`${moduleName}.config.cjs`,

// esm with `type:module`, otherwise `cjs`
`${moduleName}.config.js`,
// esm with `type:module`, otherwise `cjs`
`${moduleName}.config.ts`,

// esm
`${moduleName}.config.mts`,
`${moduleName}.config.mjs`,
```

## custom `esm` bundler could be as below shown:

```ts
import { babel } from "@rollup/plugin-babel";
import pluginCommonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { rollup } from "rollup";
import { type ConfigBundler } from "../src/types.js";
import { builtinModules, isBuiltin } from "node:module";

const nodeBabelPreset = {
  presets: [
    [
      require.resolve("@babel/preset-env"),
      {
        loose: true,
        useBuiltIns: false,
        targets: "node >= 14.0",
      },
    ],
    [
      require.resolve("@babel/preset-typescript"),
      {
        // https://babeljs.io/docs/en/babel-preset-typescript
        // https://github.com/babel/babel/blob/main/packages/babel-parser/src/plugins/typescript/index.js#L3133
        isTSX: false,
        allExtensions: false,
      },
    ],
  ],
  plugins: [
    [require.resolve("@babel/plugin-proposal-decorators"), { legacy: true }],
    [
      require.resolve("@babel/plugin-proposal-class-properties"),
      { loose: true },
    ],
  ],
};

export const rollupBundler: ConfigBundler = {
  async bundle(fileName: string): Promise<{ code: string }> {
    const bundle = await rollup({
      input: fileName,
      external: (moduleId) => {
        // `vite` is demo for tests purpose.
        const externals = ["vite"];
        if (!externals.length) {
          return false;
        }
        const isExternal = externals.find((externalModule: string) => {
          // moduleId: `@dimjs/utils/esm/class-names`
          return moduleId.startsWith(externalModule);
        });
        return (
          !!isExternal ||
          builtinModules.includes(moduleId) ||
          isBuiltin(moduleId)
        );
      },
      cache: false,
      plugins: [
        nodeResolve({
          extensions: [".js", ".ts", ".tsx", ".json", ".vue"],
        }),
        (pluginCommonjs.default || pluginCommonjs)({}),
        babel({
          ...nodeBabelPreset,
          babelrc: false,
          exclude: "node_modules/**",
          babelHelpers: "bundled",
          extensions: [".js", ".ts", ".tsx", ".json", ".vue"],
        }),
      ],
    });
    try {
      const { output } = await bundle.generate({
        format: "esm",
        indent: true,
        extend: true,
        strict: false,
      });
      const allCodes: string[] = [];
      for (const chunkOrAsset of output) {
        if (chunkOrAsset.type !== "asset") {
          allCodes.push(chunkOrAsset.code);
        }
      }
      const bundledCode = allCodes.join("\n");
      return {
        code: bundledCode,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
```
