---
id: "CliMain"
title: "Class: CliMain"
sidebar_label: "CliMain"
sidebar_position: 0
custom_edit_url: null
---

## Constructors

### constructor

• **new CliMain**(`options`)

#### Parameters

| Name      | Type                                      |
| :-------- | :---------------------------------------- |
| `options` | [`CliOption`](../interfaces/CliOption.md) |

#### Defined in

[packages/common/src/cmd/create-cli.ts:9](https://github.com/armitjs/armit/blob/224552a/packages/common/src/cmd/create-cli.ts#L9)

## Properties

### commands

• `Private` **commands**: `CommandModule`<{}, {}\>[] = `[]`

#### Defined in

[packages/common/src/cmd/create-cli.ts:7](https://github.com/armitjs/armit/blob/224552a/packages/common/src/cmd/create-cli.ts#L7)

---

### options

• `Private` **options**: [`CliOption`](../interfaces/CliOption.md)

#### Defined in

[packages/common/src/cmd/create-cli.ts:6](https://github.com/armitjs/armit/blob/224552a/packages/common/src/cmd/create-cli.ts#L6)

---

### program

• `Private` **program**: `Argv`<{}\>

#### Defined in

[packages/common/src/cmd/create-cli.ts:8](https://github.com/armitjs/armit/blob/224552a/packages/common/src/cmd/create-cli.ts#L8)

## Methods

### exitProcess

▸ **exitProcess**(`code`, `err`): `void`

Manually indicate that the program should exit, and provide context about why we wanted to exit.

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `code` | `number` |
| `err`  | `Error`  |

#### Returns

`void`

#### Defined in

[packages/common/src/cmd/create-cli.ts:58](https://github.com/armitjs/armit/blob/224552a/packages/common/src/cmd/create-cli.ts#L58)

---

### parse

▸ **parse**(`argv`, `callback?`): { `$0`: `string` ; `_`: (`string` \| `number`)[] } \| `Promise`<{ `$0`: `string` ; `_`: (`string` \| `number`)[] }\>

Parse args instead of process.argv. Returns the argv object. args may either be a pre-processed argv array, or a raw argument string.

#### Parameters

| Name        | Type                 | Description           |
| :---------- | :------------------- | :-------------------- |
| `argv`      | `string`[]           | procces.argv.slice(2) |
| `callback?` | `ParseCallback`<{}\> | -                     |

#### Returns

{ `$0`: `string` ; `_`: (`string` \| `number`)[] } \| `Promise`<{ `$0`: `string` ; `_`: (`string` \| `number`)[] }\>

#### Defined in

[packages/common/src/cmd/create-cli.ts:29](https://github.com/armitjs/armit/blob/224552a/packages/common/src/cmd/create-cli.ts#L29)

---

### parseAsync

▸ **parseAsync**<`T`\>(`argv`, `callback?`): `Promise`<`T`\>

Identical to .parse() except always returns a promise for a parsed argv object, regardless of whether an async builder, handler, or middleware is used.

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Parameters

| Name        | Type                 | Description           |
| :---------- | :------------------- | :-------------------- |
| `argv`      | `string`[]           | procces.argv.slice(2) |
| `callback?` | `ParseCallback`<{}\> |                       |

#### Returns

`Promise`<`T`\>

#### Defined in

[packages/common/src/cmd/create-cli.ts:43](https://github.com/armitjs/armit/blob/224552a/packages/common/src/cmd/create-cli.ts#L43)

---

### register

▸ **register**(`...cmds`): [`CliMain`](CliMain.md)

Register new command module to chain.
Note Normally we can register only one command, because the T maybe different.

#### Parameters

| Name      | Type                             |
| :-------- | :------------------------------- |
| `...cmds` | `CommandModule`<`any`, `any`\>[] |

#### Returns

[`CliMain`](CliMain.md)

#### Defined in

[packages/common/src/cmd/create-cli.ts:19](https://github.com/armitjs/armit/blob/224552a/packages/common/src/cmd/create-cli.ts#L19)
