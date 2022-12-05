---
id: "CliOption"
title: "Interface: CliOption"
sidebar_label: "CliOption"
sidebar_position: 0
custom_edit_url: null
---

A context object can optionally be given as the second argument to parse()
Providing a useful mechanism for passing state information to commands

## Properties

### exitProcess

• `Optional` **exitProcess**: `boolean`

By default, yargs exits the process when the user passes a help flag, the user uses the .version functionality,
Calling .exitProcess(false) disables this behavior, enabling further actions after yargs have been validated.

#### Defined in

[packages/common/src/cmd/create-yargs.ts:25](https://github.com/armitjs/armit/blob/84b6bb8/packages/common/src/cmd/create-yargs.ts#L25)

---

### group

• **group**: `string`

The group name

**`Default`**

`@armit`

#### Defined in

[packages/common/src/cmd/create-yargs.ts:16](https://github.com/armitjs/armit/blob/84b6bb8/packages/common/src/cmd/create-yargs.ts#L16)

---

### packageJson

• `Optional` **packageJson**: `Record`<`string`, `unknown`\>

the json parsed from `package.json`

#### Defined in

[packages/common/src/cmd/create-yargs.ts:20](https://github.com/armitjs/armit/blob/84b6bb8/packages/common/src/cmd/create-yargs.ts#L20)
