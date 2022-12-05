---
id: "modules"
title: "@armit/common"
sidebar_label: "Exports"
sidebar_position: 0.5
custom_edit_url: null
---

## Namespaces

- [recursiveCopy](namespaces/recursiveCopy.md)

## Enumerations

- [LogLevel](enums/LogLevel.md)

## Classes

- [AbstractHandler](classes/AbstractHandler.md)
- [CliMain](classes/CliMain.md)
- [DefaultLogger](classes/DefaultLogger.md)
- [Terminal](classes/Terminal.md)

## Interfaces

- [ArmitLogger](interfaces/ArmitLogger.md)
- [CliOption](interfaces/CliOption.md)
- [Level](interfaces/Level.md)
- [TerminalConstructorData](interfaces/TerminalConstructorData.md)
- [ZipOptions](interfaces/ZipOptions.md)

## Type Aliases

### ChiperType

Ƭ **ChiperType**: `"SHA"` \| `"SHA256"` \| `"SHA384"` \| `"SHA512"` \| `"SSHA"` \| `"SSHA256"` \| `"SSHA384"` \| `"SSHA512"`

#### Defined in

[packages/common/src/ldap/ldap.ts:3](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/ldap/ldap.ts#L3)

---

### Color

Ƭ **Color**: `Exclude`<keyof typeof `picocolors`, `"createColors"` \| `"isColorSupported"`\>

Represents an ANSI color.

#### Defined in

[packages/common/src/terminal/types.ts:6](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/terminal/types.ts#L6)

---

### CommandArgv

Ƭ **CommandArgv**<`T`\>: { `logLevel`: keyof typeof [`LogLevel`](enums/LogLevel.md) ; `name`: `string` ; `noColor`: `boolean` ; `packageJson`: `PackageJson` } & `T`

#### Type parameters

| Name | Type         |
| :--- | :----------- |
| `T`  | `ArgvConfig` |

#### Defined in

[packages/common/src/cmd/create-command.ts:10](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/cmd/create-command.ts#L10)

---

### Locked

Ƭ **Locked**<`T`\>: { readonly [K in keyof T]: T[K] extends object ? Locked<T[K]\> : T[K] }

Make every property and sub-property read-only.

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Defined in

[packages/common/src/terminal/types.ts:14](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/terminal/types.ts#L14)

---

### TerminalData

Ƭ **TerminalData**: [`Locked`](modules.md#locked)<`Required`<[`TerminalConstructorData`](interfaces/TerminalConstructorData.md)<`string`\>\>\>

Same as `TerminalConstructorData<string>`, but all properties are required and read-only. This interface is used for the `data` property of the `Terminal` class.

#### Defined in

[packages/common/src/terminal/types.ts:21](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/terminal/types.ts#L21)

## Variables

### advancedLevels

• `Const` **advancedLevels**: [`Level`](interfaces/Level.md)<`"error"` \| `"trace"` \| `"debug"` \| `"fatal"` \| `"info"` \| `"warn"`\>[]

A list of preset levels that you can use to log messages of various levels of importance.

### **Levels include:**

- error
- trace
- debug
- fatal
- info
- warn

#### Defined in

[packages/common/src/terminal/terminal-log.ts:38](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/terminal/terminal-log.ts#L38)

---

### basicLevels

• `Const` **basicLevels**: [`Level`](interfaces/Level.md)<`"error"` \| `"trace"`\>[]

A couple of preset levels. This is useful for a basic application.

### **Levels include:**

- error
- trace

#### Defined in

[packages/common/src/terminal/terminal-log.ts:21](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/terminal/terminal-log.ts#L21)

## Functions

### arrayFlatten

▸ **arrayFlatten**<`T`\>(`arr`, `depth?`): `T`

Creates a new array with all sub-array elements concatenated into it recursively up to the specified depth.

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Parameters

| Name    | Type     | Default value | Description           |
| :------ | :------- | :------------ | :-------------------- |
| `arr`   | `any`    | `undefined`   | The array to flatten. |
| `depth` | `number` | `1`           | default 1             |

#### Returns

`T`

A new array with the sub-array elements concatenated into it.

#### Defined in

[packages/common/src/array/array-flatten.ts:7](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/array/array-flatten.ts#L7)

---

### arrayUnique

▸ **arrayUnique**<`T`\>(`arr`, `byKey?`): `T`[]

Returns an array with only unique values. Objects are compared by reference,
unless the `byKey` argument is supplied, in which case matching properties will
be used to check duplicates

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Parameters

| Name     | Type      |
| :------- | :-------- |
| `arr`    | `T`[]     |
| `byKey?` | keyof `T` |

#### Returns

`T`[]

#### Defined in

[packages/common/src/array/array-unique.ts:7](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/array/array-unique.ts#L7)

---

### clearCache

▸ **clearCache**(): `void`

#### Returns

`void`

#### Defined in

[packages/common/src/cmd/load-plugins.ts:169](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/cmd/load-plugins.ts#L169)

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

[packages/common/src/cmd/create-cli.ts:68](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/cmd/create-cli.ts#L68)

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

| Name | Type                                                           |
| :--- | :------------------------------------------------------------- |
| `T`  | extends [`CommandArgv`](modules.md#commandargv)<`ArgvConfig`\> |

#### Parameters

| Name      | Type                                            | Description                                 |
| :-------- | :---------------------------------------------- | :------------------------------------------ |
| `name`    | `string`                                        | The name of this command plugin             |
| `declare` | `Omit`<`CommandModule`<`T`, {}\>, `"handler"`\> | The definitions of this command using yargs |
| `ctor`    | `CommandHandlerCtor`<`T`\>                      | The constraint command handler              |

#### Returns

`CommandModule`<`T`, {}\>

#### Defined in

[packages/common/src/cmd/create-command.ts:122](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/cmd/create-command.ts#L122)

---

### createFixtureFiles

▸ **createFixtureFiles**(`url`, `dir?`, `files`): `string`

Method for dynamic creating fixture workspace dir for jest

#### Parameters

| Name    | Type                          | Default value | Description                                                                |
| :------ | :---------------------------- | :------------ | :------------------------------------------------------------------------- |
| `url`   | `string`                      | `undefined`   | The default should be dynamic `import.meta.url`                            |
| `dir`   | `string`                      | `'fixture'`   | The default fixture workspace dir is default: `fixture`                    |
| `files` | `Record`<`string`, `string`\> | `undefined`   | `{'a/hello.txt': 'hello', 'b/hello.txt': 'hello', 'b/world.txt': 'hello'}` |

#### Returns

`string`

\_\_dirname

#### Defined in

[packages/common/src/test-utils/fixture.ts:12](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/test-utils/fixture.ts#L12)

---

### createSalt

▸ **createSalt**(): `Buffer`

A cryptographic salt is made up of random bits added to each password instance before its hashing

#### Returns

`Buffer`

#### Defined in

[packages/common/src/ldap/ldap.ts:55](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/ldap/ldap.ts#L55)

---

### createSubCommands

▸ **createSubCommands**(`program`, `...commands`): `Argv`<{}\>

Provides a standard mechanism for creating subcommands

#### Parameters

| Name          | Type                       | Description      |
| :------------ | :------------------------- | :--------------- |
| `program`     | `Argv`<{}\>                | the main command |
| `...commands` | `CommandModule`<{}, {}\>[] | subcommand list  |

#### Returns

`Argv`<{}\>

#### Defined in

[packages/common/src/cmd/create-command.ts:141](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/cmd/create-command.ts#L141)

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

[packages/common/src/cmd/create-yargs.ts:67](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/cmd/create-yargs.ts#L67)

---

### ensureSlash

▸ **ensureSlash**(`str`, `slashEndfix?`): `string`

Ensure your string ends with a slash.

#### Parameters

| Name          | Type      | Default value |
| :------------ | :-------- | :------------ |
| `str`         | `string`  | `undefined`   |
| `slashEndfix` | `boolean` | `false`       |

#### Returns

`string`

#### Defined in

[packages/common/src/file/path.ts:10](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/file/path.ts#L10)

---

### execaOpts

▸ **execaOpts**(`workDir?`, `opts`): `CommonOptions`<`string`\>

Orgnization execa configuration

#### Parameters

| Name      | Type                       | Description                   |
| :-------- | :------------------------- | :---------------------------- |
| `workDir` | `string`                   | -                             |
| `opts`    | `CommonOptions`<`string`\> | overrides execa configuration |

#### Returns

`CommonOptions`<`string`\>

#### Defined in

[packages/common/src/terminal/program.ts:10](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/terminal/program.ts#L10)

---

### extractFileFromZip

▸ **extractFileFromZip**(`zipFileName`, `zipEntryName`): `null` \| `Buffer`

Extract file from zip to Buffer

#### Parameters

| Name           | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `zipFileName`  | `string` | The absolute file path for this zip. |
| `zipEntryName` | `string` | `test.txt`                           |

#### Returns

`null` \| `Buffer`

Buffer

#### Defined in

[packages/common/src/file/zip.ts:81](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/file/zip.ts#L81)

---

### fileCompare

▸ **fileCompare**(`file1`, `file2`, `algo`): `Promise`<`boolean`\>

Compare two files base on their computed hash rather than just size or timestamp

#### Parameters

| Name    | Type                | Description                                  |
| :------ | :------------------ | :------------------------------------------- |
| `file1` | `string`            | required string path to file 1               |
| `file2` | `string`            | required string path to file 2               |
| `algo`  | `"sha1"` \| `"md5"` | option string algorithm for hash computation |

#### Returns

`Promise`<`boolean`\>

boolean indicating if compare succeeded

#### Defined in

[packages/common/src/file/file-compare.ts:32](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/file/file-compare.ts#L32)

---

### fileWalk

▸ **fileWalk**(`pattern`, `options?`): `Promise`<`string`[]\>

Traversing the file system and returning pathnames that matched a defined set of a specified pattern according to the rules

**`Example`**

```ts
// https://github.com/mrmlnc/fast-glob
const files = await fileWalk("**/*.*", {
  cwd: fixtureCwd,
  ignore: ["**/*.{jpg,png}"],
});
```

#### Parameters

| Name      | Type                            |
| :-------- | :------------------------------ |
| `pattern` | `string` \| readonly `string`[] |
| `options` | `Options`                       |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[packages/common/src/file/file-walk.ts:43](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/file/file-walk.ts#L43)

---

### fileWalkSync

▸ **fileWalkSync**(`pattern`, `options?`): `string`[]

Traversing the file system and returning pathnames that matched a defined set of a specified pattern according to the rules
Note '!**/\_\_MACOSX/**', '!\*_/_.DS_Store' will be ignored.

**`Example`**

```ts
// https://github.com/mrmlnc/fast-glob
const files = fileWalkSync("**/*.*", {
  cwd: fixtureCwd,
  ignore: ["**/*.{jpg,png}"],
});
```

#### Parameters

| Name      | Type                            |
| :-------- | :------------------------------ |
| `pattern` | `string` \| readonly `string`[] |
| `options` | `Options`                       |

#### Returns

`string`[]

#### Defined in

[packages/common/src/file/file-walk.ts:17](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/file/file-walk.ts#L17)

---

### findParentDir

▸ **findParentDir**(`currentFullPath`, `clue`): `null` \| `string`

Finds the first parent directory that contains a given file or directory.

#### Parameters

| Name              | Type     | Description                             |
| :---------------- | :------- | :-------------------------------------- |
| `currentFullPath` | `string` | Directory search start                  |
| `clue`            | `string` | Give file or directory we want to find. |

#### Returns

`null` \| `string`

#### Defined in

[packages/common/src/package/package-search.ts:30](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/package/package-search.ts#L30)

---

### getClosestPackageFile

▸ **getClosestPackageFile**(`options`): `undefined` \| `string`

Find the closest package.json file

#### Parameters

| Name      | Type                                                                                  |
| :-------- | :------------------------------------------------------------------------------------ |
| `options` | `Simplify`<`Except`<`Options`, `"cwd"`\> & `Required`<`Pick`<`Options`, `"cwd"`\>\>\> |

#### Returns

`undefined` \| `string`

Returns the file path, or undefined if it could not be found.

#### Defined in

[packages/common/src/package/package-search.ts:20](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/package/package-search.ts#L20)

---

### getDirname

▸ **getDirname**(`url`, `subDir?`): `string`

Provider method to simulate \_\_dirname veriable.

#### Parameters

| Name     | Type     | Default value | Description     |
| :------- | :------- | :------------ | :-------------- |
| `url`    | `string` | `undefined`   | import.meta.url |
| `subDir` | `string` | `''`          | sub directory   |

#### Returns

`string`

\_\_dirname

#### Defined in

[packages/common/src/file/dir-name.ts:10](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/file/dir-name.ts#L10)

---

### getLastCommitHash

▸ **getLastCommitHash**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/common/src/git/commit-hash.ts:3](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/git/commit-hash.ts#L3)

---

### getPackageData

▸ **getPackageData**(`options`): `undefined` \| `PackageJson`

Read the closest package.json file data object.

#### Parameters

| Name      | Type                                                                                  |
| :-------- | :------------------------------------------------------------------------------------ |
| `options` | `Simplify`<`Except`<`Options`, `"cwd"`\> & `Required`<`Pick`<`Options`, `"cwd"`\>\>\> |

#### Returns

`undefined` \| `PackageJson`

Returns the result object or undefined if no package.json was found.

#### Defined in

[packages/common/src/package/package-data.ts:11](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/package/package-data.ts#L11)

---

### getPackageDir

▸ **getPackageDir**(`options`): `undefined` \| `string`

Find the root directory of a Node.js project or npm package

#### Parameters

| Name      | Type                                                                                  |
| :-------- | :------------------------------------------------------------------------------------ |
| `options` | `Simplify`<`Except`<`Options`, `"cwd"`\> & `Required`<`Pick`<`Options`, `"cwd"`\>\>\> |

#### Returns

`undefined` \| `string`

Returns the project root path or undefined if it could not be found.

#### Defined in

[packages/common/src/package/package-search.ts:12](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/package/package-search.ts#L12)

---

### getTerminalLink

▸ **getTerminalLink**(`text`, `url`): `string`

Create a link for use in stdout.

#### Parameters

| Name   | Type     | Description      |
| :----- | :------- | :--------------- |
| `text` | `string` | Text to linkify. |
| `url`  | `string` | URL to link to.  |

#### Returns

`string`

#### Defined in

[packages/common/src/terminal/terminal-link.ts:7](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/terminal/terminal-link.ts#L7)

---

### isDirectory

▸ **isDirectory**(`path`): `boolean`

Sync Returns true if a filepath exists on the file system and it's directory.

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `path` | `string` |

#### Returns

`boolean`

#### Defined in

[packages/common/src/file/file-read.ts:6](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/file/file-read.ts#L6)

---

### isGlobalYarnOrNpm

▸ **isGlobalYarnOrNpm**(): `boolean`

Check if your package was installed globally, npm / yarn

#### Returns

`boolean`

#### Defined in

[packages/common/src/package/npm-yarn.ts:17](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/package/npm-yarn.ts#L17)

---

### isJunkFile

▸ **isJunkFile**(`filename`): `boolean`

Returns true if filename matches a junk file.

#### Parameters

| Name       | Type     | Description                           |
| :--------- | :------- | :------------------------------------ |
| `filename` | `string` | normally it should be path.basename() |

#### Returns

`boolean`

#### Defined in

[packages/common/src/file/path.ts:58](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/file/path.ts#L58)

---

### isNotJunkFile

▸ **isNotJunkFile**(`filename`): `boolean`

Returns true if filename does not match a junk file.

#### Parameters

| Name       | Type     | Description                           |
| :--------- | :------- | :------------------------------------ |
| `filename` | `string` | normally it should be path.basename() |

#### Returns

`boolean`

#### Defined in

[packages/common/src/file/path.ts:67](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/file/path.ts#L67)

---

### isPathMatch

▸ **isPathMatch**(`str`, `pattern`, `options?`): `boolean`

Returns true if every string in the given list matches any of the given glob patterns.

#### Parameters

| Name      | Type                   | Description                                      |
| :-------- | :--------------------- | :----------------------------------------------- |
| `str`     | `string`               | The string to test.                              |
| `pattern` | `string` \| `string`[] | One or more glob patterns to use for matching.   |
| `options` | `Options`              | https://github.com/micromatch/micromatch#options |

#### Returns

`boolean`

#### Defined in

[packages/common/src/file/path.ts:26](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/file/path.ts#L26)

---

### isYarnGlobal

▸ **isYarnGlobal**(): `boolean`

Check if installed by yarn globally without any `fs` calls

#### Returns

`boolean`

#### Defined in

[packages/common/src/package/npm-yarn.ts:9](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/package/npm-yarn.ts#L9)

---

### ldapSHAVerify

▸ **ldapSHAVerify**(`password`, `hash`): `boolean`

Using LDAP to validating user

#### Parameters

| Name       | Type     | Description               |
| :--------- | :------- | :------------------------ |
| `password` | `string` | Password                  |
| `hash`     | `string` | Encryped ldap hash string |

#### Returns

`boolean`

#### Defined in

[packages/common/src/ldap/ldap.ts:83](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/ldap/ldap.ts#L83)

---

### ldapSSHACreate

▸ **ldapSSHACreate**(`password`, `salt`): `string`

Create Ldap Algorithm Authorization token

#### Parameters

| Name       | Type                 | Description                                                                                       |
| :--------- | :------------------- | :------------------------------------------------------------------------------------------------ |
| `password` | `string`             | Password                                                                                          |
| `salt`     | `string` \| `Buffer` | A cryptographic salt is made up of random bits added to each password instance before its hashing |

#### Returns

`string`

Crypto ldap hash string

#### Defined in

[packages/common/src/ldap/ldap.ts:65](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/ldap/ldap.ts#L65)

---

### loadPlugins

▸ **loadPlugins**(`plugins?`, `pluginPackPattern?`, `pluginSearchDirs?`, `cwd?`): `Promise`<{ `name`: `string` ; `plugin`: `CommandModule` }[]\>

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

[packages/common/src/cmd/load-plugins.ts:40](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/cmd/load-plugins.ts#L40)

---

### mergeDirs

▸ **mergeDirs**(`src`, `dest`, `conflict?`): `void`

#### Parameters

| Name       | Type                      | Default value |
| :--------- | :------------------------ | :------------ |
| `src`      | `string`                  | `undefined`   |
| `dest`     | `string`                  | `undefined`   |
| `conflict` | `"overwrite"` \| `"skip"` | `'skip'`      |

#### Returns

`void`

#### Defined in

[packages/common/src/file/merge-dirs.ts:18](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/file/merge-dirs.ts#L18)

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

[packages/common/src/cmd/parse-argv.ts:22](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/cmd/parse-argv.ts#L22)

---

### projectHasYarn

▸ **projectHasYarn**(): `boolean`

Check if a project is using Yarn, It checks if a yarn.lock file is present in the working directory.
Useful for tools that needs to know whether to use yarn or npm to install dependencies.

#### Returns

`boolean`

#### Defined in

[packages/common/src/package/npm-yarn.ts:26](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/package/npm-yarn.ts#L26)

---

### readJsonFromFile

▸ **readJsonFromFile**<`T`\>(`fileFrom`): `T`

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `fileFrom` | `string` |

#### Returns

`T`

#### Defined in

[packages/common/src/file/file-write.ts:37](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/file/file-write.ts#L37)

---

### recursiveCopy

▸ **recursiveCopy**(`src`, `dest`, `options?`): `WithCopyEvents`<`Promise`<`undefined` \| `CopyOperation`[]\>\>

Recursively copy files and folders from src to dest

#### Parameters

| Name      | Type                   | Description                  |
| :-------- | :--------------------- | :--------------------------- |
| `src`     | `string`               | Source file/folder path      |
| `dest`    | `string`               | Destination file/folder path |
| `options` | `RecursiveCopyOptions` |                              |

#### Returns

`WithCopyEvents`<`Promise`<`undefined` \| `CopyOperation`[]\>\>

#### Defined in

[packages/common/src/file/file-recursive-copy/file-recursive-copy.ts:27](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/file/file-recursive-copy/file-recursive-copy.ts#L27)

---

### rmrfSync

▸ **rmrfSync**(`path`): `void`

Synchronously removes files and directories (modeled on the standard POSIX `rm`utility).

#### Parameters

| Name   | Type     | Description |
| :----- | :------- | :---------- |
| `path` | `string` | the path    |

#### Returns

`void`

#### Defined in

[packages/common/src/file/file-write.ts:9](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/file/file-write.ts#L9)

---

### rmrfSyncByPattern

▸ **rmrfSyncByPattern**(`pattern`, `options?`): `string`[]

Similar to rimraf, but looking files and directories using glob patterns.

#### Parameters

| Name      | Type                            |
| :-------- | :------------------------------ |
| `pattern` | `string` \| readonly `string`[] |
| `options` | `Options`                       |

#### Returns

`string`[]

#### Defined in

[packages/common/src/file/file-write.ts:21](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/file/file-write.ts#L21)

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

[packages/common/src/terminal/program.ts:31](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/terminal/program.ts#L31)

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

[packages/common/src/terminal/program.ts:49](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/terminal/program.ts#L49)

---

### runingNpmOrYarn

▸ **runingNpmOrYarn**(): `Object`

Check if your code is running as an npm or yarn script

**`Exmaple`**

```sh
$ node foo.js
# ┌─────────────┬────────┐
# │   (index)   │ Values │
# ├─────────────┼────────┤
# │ isNpmOrYarn │ false  │
# │    isNpm    │ false  │
# │   isYarn    │ false  │
# └─────────────┴────────┘
$ npm run foo
# ┌─────────────┬────────┐
# │   (index)   │ Values │
# ├─────────────┼────────┤
# │ isNpmOrYarn │  true  │
# │    isNpm    │  true  │
# │   isYarn    │ false  │
# └─────────────┴────────┘
$ yarn run foo
# ┌─────────────┬────────┐
# │   (index)   │ Values │
# ├─────────────┼────────┤
# │ isNpmOrYarn │  true  │
# │    isNpm    │ false  │
# │   isYarn    │  true  │
# └─────────────┴────────┘
```

#### Returns

`Object`

| Name          | Type      |
| :------------ | :-------- |
| `isNpm`       | `boolean` |
| `isNpmOrYarn` | `boolean` |
| `isYarn`      | `boolean` |

#### Defined in

[packages/common/src/package/npm-yarn.ts:61](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/package/npm-yarn.ts#L61)

---

### showBanner

▸ **showBanner**(`text`, `options`, `debug?`): `void`

#### Parameters

| Name      | Type                             | Default value |
| :-------- | :------------------------------- | :------------ |
| `text`    | `string`                         | `undefined`   |
| `options` | `Partial`<`BannerFontsOptions`\> | `undefined`   |
| `debug`   | `boolean`                        | `false`       |

#### Returns

`void`

#### Defined in

[packages/common/src/terminal/terminal-banner.ts:89](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/terminal/terminal-banner.ts#L89)

---

### slash

▸ **slash**(`path`): `string`

Convert Windows backslash paths to slash paths: foo\\bar ➔ foo/bar
Forward-slash paths can be used in Windows as long as they're not extended-length paths.
This was created since the path methods in Node.js outputs \\ paths on Windows.

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `path` | `string` |

#### Returns

`string`

#### Defined in

[packages/common/src/file/path.ts:43](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/file/path.ts#L43)

---

### terminalColor

▸ **terminalColor**(`colors`, `noColor?`): (`x`: `string`) => `string`

Terminal output formatting with ANSI colors

#### Parameters

| Name       | Type                                   | Description                            |
| :--------- | :------------------------------------- | :------------------------------------- |
| `colors`   | readonly [`Color`](modules.md#color)[] | The colors for the console output      |
| `noColor?` | `boolean`                              | Removes colors from the console output |

#### Returns

`fn`

▸ (`x`): `string`

##### Parameters

| Name | Type     |
| :--- | :------- |
| `x`  | `string` |

##### Returns

`string`

#### Defined in

[packages/common/src/terminal/terminal-color.ts:10](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/terminal/terminal-color.ts#L10)

---

### unzip

▸ **unzip**(`zipFileName`, `extractTo`, `filter?`): `string`

Decompress zip files directly to disk

#### Parameters

| Name          | Type       | Description                                               |
| :------------ | :--------- | :-------------------------------------------------------- |
| `zipFileName` | `string`   | The absolute file path for this zip.                      |
| `extractTo`   | `string`   | Extracts the specified file to the specified location     |
| `filter`      | `string`[] | Each zip file path should matches all given glob patterns |

#### Returns

`string`

#### Defined in

[packages/common/src/file/zip.ts:57](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/file/zip.ts#L57)

---

### updateNotifier

▸ **updateNotifier**(`args`): `Promise`<`void`\>

Simple update notifier to check for npm updates for cli applications.

#### Parameters

| Name   | Type            |
| :----- | :-------------- |
| `args` | `PackageUpdate` |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/common/src/package/update-notifier/index.ts:15](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/package/update-notifier/index.ts#L15)

---

### writeJsonToBuffer

▸ **writeJsonToBuffer**(`content`): `Buffer`

#### Parameters

| Name      | Type  |
| :-------- | :---- |
| `content` | `any` |

#### Returns

`Buffer`

#### Defined in

[packages/common/src/file/file-write.ts:48](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/file/file-write.ts#L48)

---

### writeJsonToFile

▸ **writeJsonToFile**(`saveTo`, `content`): `void`

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `saveTo`  | `string` |
| `content` | `any`    |

#### Returns

`void`

#### Defined in

[packages/common/src/file/file-write.ts:42](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/file/file-write.ts#L42)

---

### zip

▸ **zip**(`cwd`, `saveTo`, `options`): `Promise`<`void`\>

Zip matched files into .zip file

#### Parameters

| Name      | Type                                     | Description                        |
| :-------- | :--------------------------------------- | :--------------------------------- |
| `cwd`     | `string`                                 | absolute directory path.           |
| `saveTo`  | `string`                                 | the directory Where can save it to |
| `options` | [`ZipOptions`](interfaces/ZipOptions.md) | zip configuration                  |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/common/src/file/zip.ts:42](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/file/zip.ts#L42)

---

### zipFiles

▸ **zipFiles**(`fileNames`, `saveZipTo`, `options`): `string`

Compress the specified list of files and keep the file directory of the ZIP package as the specified relative path
Note the jszip depends `dom` to load `lib.dom.d.ts`

#### Parameters

| Name        | Type                                     | Description                       |
| :---------- | :--------------------------------------- | :-------------------------------- |
| `fileNames` | `string`[]                               | All files with full path          |
| `saveZipTo` | `string`                                 | -                                 |
| `options`   | [`ZipOptions`](interfaces/ZipOptions.md) | Some configurations while ziping. |

#### Returns

`string`

#### Defined in

[packages/common/src/file/zip.ts:21](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/file/zip.ts#L21)
