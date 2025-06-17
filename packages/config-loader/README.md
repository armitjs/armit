# @armit/config-loader

Find and load configuration from a package.json property, rc file, or CommonJS module, also support `.ts` file type:

it will search up the directory tree, checking each of these places in each directory, until it finds some acceptable configuration (or hits the home directory).

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

## Note

This library is deprecated. Please use the SWC version at https://github.com/hyperse-io/config-loader
