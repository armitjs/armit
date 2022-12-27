---
id: "modules"
title: "@armit/commander"
sidebar_label: "Exports"
sidebar_position: 0.5
custom_edit_url: null
---

## Classes

- [AbstractHandler](classes/AbstractHandler.md)
- [CliMain](classes/CliMain.md)

## Interfaces

- [CliMockResult](interfaces/CliMockResult.md)
- [CliOption](interfaces/CliOption.md)

## Type Aliases

### CommandArgv

Ƭ **CommandArgv**<`T`\>: { `logLevel`: keyof typeof `LogLevel` ; `name`: `string` ; `noColor`: `boolean` ; `packageJson`: `PackageJson` } & `T`

#### Type parameters

| Name | Type                      |
| :--- | :------------------------ |
| `T`  | extends `ArgvConfig` = {} |

#### Defined in

[packages/commander/src/create-command.ts:10](https://github.com/armitjs/armit/blob/f6509f7/packages/commander/src/create-command.ts#L10)

## Functions

### clearCache

▸ **clearCache**(): `void`

#### Returns

`void`

#### Defined in

[packages/commander/src/cli-load-plugins.ts:173](https://github.com/armitjs/armit/blob/f6509f7/packages/commander/src/cli-load-plugins.ts#L173)

---

### createCli

▸ **createCli**(`options`): [`CliMain`](classes/CliMain.md)

Create cli program

#### Parameters

| Name      | Type                                   |
| :-------- | :------------------------------------- |
| `options` | [`CliOption`](interfaces/CliOption.md) |

#### Returns

[`CliMain`](classes/CliMain.md)

#### Defined in

[packages/commander/src/create-cli.ts:68](https://github.com/armitjs/armit/blob/f6509f7/packages/commander/src/create-cli.ts#L68)

---

### createCommand

▸ **createCommand**<`T`\>(`name`, `declare`, `ctor`): `CommandModule`<`T`, {}\>

Allow us create an customized command based on yargs

**`Example`**

```ts
import type { CommandArgv } from "@armit/common";
import { createCommand, AbstractHandler } from "@armit/common";

type TestCmdArgs = CommandArgv<{
  test: number;
}>;

class CmdTestHandle extends AbstractHandler<TestCmdArgs> {
  get name(): string {
    return `test`;
  }
  handle(): void | Promise<void> {
    console.log("this is test command");
  }
}

export const cmdTest = createCommand(
  "info",
  {
    command: "info",
    describe: "Display armit project details.",
    builder: (yargs) => {
      return yargs.example(`$0 cmd test `, "cli testing").option("test", {
        type: "number",
        alias: "",
        default: true,
        describe: `cli option "test" describe`,
      });
    },
  },
  CmdTestHandle
);
```

#### Type parameters

| Name | Type             |
| :--- | :--------------- |
| `T`  | extends `Object` |

#### Parameters

| Name      | Type                                            | Description                                 |
| :-------- | :---------------------------------------------- | :------------------------------------------ |
| `name`    | `string`                                        | The name of this command plugin             |
| `declare` | `Omit`<`CommandModule`<`T`, {}\>, `"handler"`\> | The definitions of this command using yargs |
| `ctor`    | `CommandHandlerCtor`<`T`\>                      | The constraint command handler              |

#### Returns

`CommandModule`<`T`, {}\>

#### Defined in

[packages/commander/src/create-command.ts:126](https://github.com/armitjs/armit/blob/f6509f7/packages/commander/src/create-command.ts#L126)

---

### createSubCommands

▸ **createSubCommands**(`program`, `...commands`): `Argv`<{}\>

Provides a standard mechanism for creating subcommands

#### Parameters

| Name          | Type                             | Description      |
| :------------ | :------------------------------- | :--------------- |
| `program`     | `Argv`<{}\>                      | the main command |
| `...commands` | `CommandModule`<`any`, `any`\>[] | subcommand list  |

#### Returns

`Argv`<{}\>

#### Defined in

[packages/commander/src/create-command.ts:145](https://github.com/armitjs/armit/blob/f6509f7/packages/commander/src/create-command.ts#L145)

---

### createYargs

▸ **createYargs**(`option`): `Argv`<`Omit`<{}, `"logLevel"` \| `"noColor"`\> & `InferredOptionTypes`<{ `logLevel`: { `choices`: `string`[] ; `default`: `string` = 'Info'; `describe`: `string` ; `type`: `"string"` = 'string' } ; `noColor`: { `default`: `boolean` = false; `describe`: `string` ; `type`: `"boolean"` = 'boolean' } }\> & { `l`: `string` }\>

#### Parameters

| Name     | Type                                   |
| :------- | :------------------------------------- |
| `option` | [`CliOption`](interfaces/CliOption.md) |

#### Returns

`Argv`<`Omit`<{}, `"logLevel"` \| `"noColor"`\> & `InferredOptionTypes`<{ `logLevel`: { `choices`: `string`[] ; `default`: `string` = 'Info'; `describe`: `string` ; `type`: `"string"` = 'string' } ; `noColor`: { `default`: `boolean` = false; `describe`: `string` ; `type`: `"boolean"` = 'boolean' } }\> & { `l`: `string` }\>

#### Defined in

[packages/commander/src/create-yargs.ts:66](https://github.com/armitjs/armit/blob/f6509f7/packages/commander/src/create-yargs.ts#L66)

---

### loadCliPlugins

▸ **loadCliPlugins**(`plugins?`, `pluginPackPattern?`, `pluginSearchDirs?`, `cwd?`): `Promise`<{ `name`: `string` ; `plugin`: `CommandModule` }[]\>

Load plugin from external specificed or auto searched from `pluginSearchDirs`

#### Parameters

| Name                | Type       | Default value | Description                                                                                         |
| :------------------ | :--------- | :------------ | :-------------------------------------------------------------------------------------------------- |
| `plugins`           | `string`[] | `[]`          | The manual load external plugin package names                                                       |
| `pluginPackPattern` | `string`[] | `[]`          | `['armit-plugin-*/package.json', '@*/armit-plugin-*/package.json', '@armit/plugin-*/package.json']` |
| `pluginSearchDirs`  | `string`[] | `[]`          | `The directory search from, it should not include `node_modules`                                    |
| `cwd`               | `string`   | `undefined`   | The directory to begin resolving from                                                               |

#### Returns

`Promise`<{ `name`: `string` ; `plugin`: `CommandModule` }[]\>

#### Defined in

[packages/commander/src/cli-load-plugins.ts:44](https://github.com/armitjs/armit/blob/f6509f7/packages/commander/src/cli-load-plugins.ts#L44)

---

### parseArgv

▸ **parseArgv**(`cwd?`): `Promise`<{ `$0`: `string` ; `_`: (`string` \| `number`)[] } \| { `$0`: `string` ; `_`: (`string` \| `number`)[] }\>

Parse command line script

**`Example`**

```
./generate.js create-reduce-action __store__=some-name __model__=some-other-name --outputpath=./src/here --overwrite

 {
  _: [
    'create-reduce-action',
    '__store__=some-name',
    '__model__=some-other-name'
  ],
  outputpath: './src/here',
  overwrite: true,
}
```

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `cwd?` | `string` |

#### Returns

`Promise`<{ `$0`: `string` ; `_`: (`string` \| `number`)[] } \| { `$0`: `string` ; `_`: (`string` \| `number`)[] }\>

#### Defined in

[packages/commander/src/parse-argv.ts:22](https://github.com/armitjs/armit/blob/f6509f7/packages/commander/src/parse-argv.ts#L22)

---

### runProgram

▸ **runProgram**(`program`, `cwd`, `args`, `opts`): `ExecaChildProcess`<`string`\>

Execute cli program

#### Parameters

| Name      | Type                       | Description                        |
| :-------- | :------------------------- | :--------------------------------- |
| `program` | `string`                   | the node program path.             |
| `cwd`     | `string`                   | -                                  |
| `args`    | `string`[]                 | the program parameters             |
| `opts`    | `CommonOptions`<`string`\> | the overrides execa configurations |

#### Returns

`ExecaChildProcess`<`string`\>

#### Defined in

[packages/commander/src/run-program.ts:32](https://github.com/armitjs/armit/blob/f6509f7/packages/commander/src/run-program.ts#L32)

---

### runTsCliMock

▸ **runTsCliMock**(`program`, `...args`): `Promise`<[`CliMockResult`](interfaces/CliMockResult.md)\>

#### Parameters

| Name      | Type       |
| :-------- | :--------- |
| `program` | `any`      |
| `...args` | `string`[] |

#### Returns

`Promise`<[`CliMockResult`](interfaces/CliMockResult.md)\>

#### Defined in

[packages/commander/src/run-program.ts:78](https://github.com/armitjs/armit/blob/f6509f7/packages/commander/src/run-program.ts#L78)

---

### runTsScript

▸ **runTsScript**(`program`, `mode`, `tsconfig`, `options`, `...args`): `Promise`<`ExecaReturnValue`<`string`\>\>

Pipe the child process stdout to the parent, this method only used to `jest test` purpose
Please manully install `ts-node`, `tsconfig-paths`

#### Parameters

| Name       | Type                       | Description                                                     |
| :--------- | :------------------------- | :-------------------------------------------------------------- |
| `program`  | `string`                   | exec node file `join(__dirname, 'cmd-cli.ts')`                  |
| `mode`     | `"esm"` \| `"commonjs"`    | esm or commonjs                                                 |
| `tsconfig` | `string`                   | the configuration file `join(process.cwd(), './tsconfig.json')` |
| `options`  | `CommonOptions`<`string`\> | the configuration of `execa`                                    |
| `...args`  | `any`[]                    | parameters for program                                          |

#### Returns

`Promise`<`ExecaReturnValue`<`string`\>\>

#### Defined in

[packages/commander/src/run-program.ts:50](https://github.com/armitjs/armit/blob/f6509f7/packages/commander/src/run-program.ts#L50)
