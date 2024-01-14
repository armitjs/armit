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

Ƭ **CommandArgv**\<`T`\>: \{ `logLevel`: keyof typeof `LogLevel` ; `name`: `string` ; `noColor`: `boolean` ; `packageJson`: `PackageJson` } & `T`

#### Type parameters

| Name | Type                                |
| :--- | :---------------------------------- |
| `T`  | extends `ArgvConfig` = `ArgvConfig` |

#### Defined in

[packages/commander/src/create-command.ts:11](https://github.com/armitjs/armit/blob/bd1948c/packages/commander/src/create-command.ts#L11)

---

### PluginConfig

Ƭ **PluginConfig**: `Object`

#### Type declaration

| Name            | Type                            | Description                                                 |
| :-------------- | :------------------------------ | :---------------------------------------------------------- |
| `commandModule` | `CommandModule`\<`any`, `any`\> | The plugin command definition.                              |
| `name?`         | `string`                        | The plugin name, Optional, fallback to name of package.json |

#### Defined in

[packages/commander/src/define-plugin.ts:3](https://github.com/armitjs/armit/blob/bd1948c/packages/commander/src/define-plugin.ts#L3)

## Functions

### clearCache

▸ **clearCache**(): `void`

#### Returns

`void`

#### Defined in

[packages/commander/src/cli-load-plugins.ts:187](https://github.com/armitjs/armit/blob/bd1948c/packages/commander/src/cli-load-plugins.ts#L187)

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

[packages/commander/src/create-cli.ts:68](https://github.com/armitjs/armit/blob/bd1948c/packages/commander/src/create-cli.ts#L68)

---

### createCommand

▸ **createCommand**\<`T`\>(`name`, `declare`, `ctor`): `CommandModule`\<`T`, {}\>

Allow us create an customized command based on yargs

#### Type parameters

| Name | Type                                                            |
| :--- | :-------------------------------------------------------------- |
| `T`  | extends [`CommandArgv`](modules.md#commandargv)\<`ArgvConfig`\> |

#### Parameters

| Name      | Type                                              | Description                                 |
| :-------- | :------------------------------------------------ | :------------------------------------------ |
| `name`    | `string`                                          | The name of this command plugin             |
| `declare` | `Omit`\<`CommandModule`\<`T`, {}\>, `"handler"`\> | The definitions of this command using yargs |
| `ctor`    | `CommandHandlerCtor`\<`T`\>                       | The constraint command handler              |

#### Returns

`CommandModule`\<`T`, {}\>

**`Example`**

```ts
import type { CommandArgv } from "@armit/commander";
import { createCommand, AbstractHandler } from "@armit/commander";

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

#### Defined in

[packages/commander/src/create-command.ts:167](https://github.com/armitjs/armit/blob/bd1948c/packages/commander/src/create-command.ts#L167)

---

### createSubCommands

▸ **createSubCommands**(`program`, `...commands`): `Argv`\<{}\>

Provides a standard mechanism for creating subcommands

#### Parameters

| Name          | Type                              | Description      |
| :------------ | :-------------------------------- | :--------------- |
| `program`     | `Argv`\<{}\>                      | the main command |
| `...commands` | `CommandModule`\<`any`, `any`\>[] | subcommand list  |

#### Returns

`Argv`\<{}\>

#### Defined in

[packages/commander/src/create-command.ts:186](https://github.com/armitjs/armit/blob/bd1948c/packages/commander/src/create-command.ts#L186)

---

### createYargs

▸ **createYargs**(`option`): `Argv`\<\{ `log-level`: `string` } & \{ `no-color`: `boolean` } & \{ `l`: `string` }\>

#### Parameters

| Name     | Type                                   |
| :------- | :------------------------------------- |
| `option` | [`CliOption`](interfaces/CliOption.md) |

#### Returns

`Argv`\<\{ `log-level`: `string` } & \{ `no-color`: `boolean` } & \{ `l`: `string` }\>

#### Defined in

[packages/commander/src/create-yargs.ts:69](https://github.com/armitjs/armit/blob/bd1948c/packages/commander/src/create-yargs.ts#L69)

---

### definePlugin

▸ **definePlugin**(`config`): [`PluginConfig`](modules.md#pluginconfig)

For now we could need to AVOID use `export default` to export an plugin
it seems that using dynamic `import(filename)` will always return `[Module: null prototype] {}` with empty.

```ts
// below is wrong
export default definePlugin({});
// below is correct, `myPlugin` can be any name you want
// we can also export multi plugin in one module
export const myPlugin = definePlugin({
   name:'',
   commandModule: ?
});
```

#### Parameters

| Name     | Type                                      |
| :------- | :---------------------------------------- |
| `config` | [`PluginConfig`](modules.md#pluginconfig) |

#### Returns

[`PluginConfig`](modules.md#pluginconfig)

#### Defined in

[packages/commander/src/define-plugin.ts:31](https://github.com/armitjs/armit/blob/bd1948c/packages/commander/src/define-plugin.ts#L31)

---

### loadCliPlugins

▸ **loadCliPlugins**(`plugins?`, `pluginPackPattern?`, `pluginSearchDirs?`, `cwd?`): `Promise`\<\{ `name`: `string` ; `plugin`: `CommandModule` }[]\>

Load plugin from external specificed or auto searched from `pluginSearchDirs`

#### Parameters

| Name                | Type       | Default value | Description                                                                                         |
| :------------------ | :--------- | :------------ | :-------------------------------------------------------------------------------------------------- |
| `plugins`           | `string`[] | `[]`          | The manual load external plugin package names                                                       |
| `pluginPackPattern` | `string`[] | `[]`          | `['armit-plugin-*/package.json', '@*/armit-plugin-*/package.json', '@armit/plugin-*/package.json']` |
| `pluginSearchDirs`  | `string`[] | `[]`          | `The directory search from, it should not include `node_modules`                                    |
| `cwd`               | `string`   | `undefined`   | The directory to begin resolving from                                                               |

#### Returns

`Promise`\<\{ `name`: `string` ; `plugin`: `CommandModule` }[]\>

#### Defined in

[packages/commander/src/cli-load-plugins.ts:192](https://github.com/armitjs/armit/blob/bd1948c/packages/commander/src/cli-load-plugins.ts#L192)

---

### parseArgv

▸ **parseArgv**(`cwd?`): `Promise`\<\{ `$0`: `string` ; `_`: (`string` \| `number`)[] } \| \{ `$0`: `string` ; `_`: (`string` \| `number`)[] }\>

Parse command line script

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `cwd?` | `string` |

#### Returns

`Promise`\<\{ `$0`: `string` ; `_`: (`string` \| `number`)[] } \| \{ `$0`: `string` ; `_`: (`string` \| `number`)[] }\>

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

#### Defined in

[packages/commander/src/parse-argv.ts:22](https://github.com/armitjs/armit/blob/bd1948c/packages/commander/src/parse-argv.ts#L22)

---

### runProgram

▸ **runProgram**(`program`, `cwd`, `args`, `opts`): `ExecaChildProcess`\<`string`\>

Execute cli program

#### Parameters

| Name      | Type       | Description                        |
| :-------- | :--------- | :--------------------------------- |
| `program` | `string`   | the node program path.             |
| `cwd`     | `string`   | -                                  |
| `args`    | `string`[] | the program parameters             |
| `opts`    | `Options`  | the overrides execa configurations |

#### Returns

`ExecaChildProcess`\<`string`\>

#### Defined in

[packages/commander/src/run-program.ts:29](https://github.com/armitjs/armit/blob/bd1948c/packages/commander/src/run-program.ts#L29)

---

### runTsCliMock

▸ **runTsCliMock**(`program`, `...args`): `Promise`\<[`CliMockResult`](interfaces/CliMockResult.md)\>

#### Parameters

| Name      | Type       |
| :-------- | :--------- |
| `program` | `any`      |
| `...args` | `string`[] |

#### Returns

`Promise`\<[`CliMockResult`](interfaces/CliMockResult.md)\>

#### Defined in

[packages/commander/src/run-program.ts:75](https://github.com/armitjs/armit/blob/bd1948c/packages/commander/src/run-program.ts#L75)

---

### runTsScript

▸ **runTsScript**(`program`, `mode`, `tsconfig`, `options`, `...args`): `Promise`\<`ExecaReturnValue`\<`string`\>\>

Pipe the child process stdout to the parent, this method only used to `jest test` purpose
Please manully install `ts-node`, `tsconfig-paths`

#### Parameters

| Name       | Type                    | Description                                                     |
| :--------- | :---------------------- | :-------------------------------------------------------------- |
| `program`  | `string`                | exec node file `join(__dirname, 'cmd-cli.ts')`                  |
| `mode`     | `"commonjs"` \| `"esm"` | esm or commonjs                                                 |
| `tsconfig` | `string`                | the configuration file `join(process.cwd(), './tsconfig.json')` |
| `options`  | `Options`               | the configuration of `execa`                                    |
| `...args`  | `any`[]                 | parameters for program                                          |

#### Returns

`Promise`\<`ExecaReturnValue`\<`string`\>\>

#### Defined in

[packages/commander/src/run-program.ts:47](https://github.com/armitjs/armit/blob/bd1948c/packages/commander/src/run-program.ts#L47)
