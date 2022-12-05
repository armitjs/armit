---
id: "AbstractHandler"
title: "Class: AbstractHandler<T>"
sidebar_label: "AbstractHandler"
sidebar_position: 0
custom_edit_url: null
---

## Type parameters

| Name | Type                                               |
| :--- | :------------------------------------------------- |
| `T`  | extends [`CommandArgv`](../modules.md#commandargv) |

## Implements

- `OnCommandHandler`<`T`\>

## Constructors

### constructor

• **new AbstractHandler**<`T`\>(`args`)

#### Type parameters

| Name | Type                                                              |
| :--- | :---------------------------------------------------------------- |
| `T`  | extends [`CommandArgv`](../modules.md#commandargv)<`ArgvConfig`\> |

#### Parameters

| Name   | Type              |
| :----- | :---------------- |
| `args` | `Arguments`<`T`\> |

#### Defined in

[packages/common/src/cmd/create-command.ts:53](https://github.com/armitjs/armit/blob/84b6bb8/packages/common/src/cmd/create-command.ts#L53)

## Properties

### args

• `Protected` **args**: `Arguments`<`T`\>

#### Defined in

[packages/common/src/cmd/create-command.ts:53](https://github.com/armitjs/armit/blob/84b6bb8/packages/common/src/cmd/create-command.ts#L53)

---

### logger

• `Protected` **logger**: [`DefaultLogger`](DefaultLogger.md)

#### Defined in

[packages/common/src/cmd/create-command.ts:45](https://github.com/armitjs/armit/blob/84b6bb8/packages/common/src/cmd/create-command.ts#L45)

---

### packageJson

• `Private` **packageJson**: `PackageJson`

#### Defined in

[packages/common/src/cmd/create-command.ts:51](https://github.com/armitjs/armit/blob/84b6bb8/packages/common/src/cmd/create-command.ts#L51)

---

### pluginName

• `Private` **pluginName**: `string`

#### Defined in

[packages/common/src/cmd/create-command.ts:50](https://github.com/armitjs/armit/blob/84b6bb8/packages/common/src/cmd/create-command.ts#L50)

## Accessors

### cliPackageJson

• `get` **cliPackageJson**(): `PackageJson`

#### Returns

`PackageJson`

#### Implementation of

OnCommandHandler.cliPackageJson

#### Defined in

[packages/common/src/cmd/create-command.ts:68](https://github.com/armitjs/armit/blob/84b6bb8/packages/common/src/cmd/create-command.ts#L68)

---

### name

• `get` **name**(): `string`

#### Returns

`string`

#### Implementation of

OnCommandHandler.name

#### Defined in

[packages/common/src/cmd/create-command.ts:72](https://github.com/armitjs/armit/blob/84b6bb8/packages/common/src/cmd/create-command.ts#L72)

## Methods

### handle

▸ **handle**(): `void` \| `Promise`<`void`\>

#### Returns

`void` \| `Promise`<`void`\>

#### Implementation of

OnCommandHandler.handle

#### Defined in

[packages/common/src/cmd/create-command.ts:76](https://github.com/armitjs/armit/blob/84b6bb8/packages/common/src/cmd/create-command.ts#L76)

---

### initialize

▸ **initialize**(`args`): `void`

#### Parameters

| Name   | Type              |
| :----- | :---------------- |
| `args` | `Arguments`<`T`\> |

#### Returns

`void`

#### Implementation of

OnCommandHandler.initialize

#### Defined in

[packages/common/src/cmd/create-command.ts:59](https://github.com/armitjs/armit/blob/84b6bb8/packages/common/src/cmd/create-command.ts#L59)
