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

| Name | Type             |
| :--- | :--------------- |
| `T`  | extends `Object` |

#### Parameters

| Name   | Type              |
| :----- | :---------------- |
| `args` | `Arguments`<`T`\> |

#### Defined in

[packages/commander/src/create-command.ts:57](https://github.com/armitjs/armit/blob/18cfa59/packages/commander/src/create-command.ts#L57)

## Properties

### args

• `Protected` **args**: `Arguments`<`T`\>

#### Defined in

[packages/commander/src/create-command.ts:57](https://github.com/armitjs/armit/blob/18cfa59/packages/commander/src/create-command.ts#L57)

---

### logger

• `Protected` **logger**: `DefaultLogger`

#### Defined in

[packages/commander/src/create-command.ts:49](https://github.com/armitjs/armit/blob/18cfa59/packages/commander/src/create-command.ts#L49)

---

### packageJson

• `Private` **packageJson**: `PackageJson`

#### Defined in

[packages/commander/src/create-command.ts:55](https://github.com/armitjs/armit/blob/18cfa59/packages/commander/src/create-command.ts#L55)

---

### pluginName

• `Private` **pluginName**: `string`

#### Defined in

[packages/commander/src/create-command.ts:54](https://github.com/armitjs/armit/blob/18cfa59/packages/commander/src/create-command.ts#L54)

## Accessors

### cliPackageJson

• `get` **cliPackageJson**(): `PackageJson`

#### Returns

`PackageJson`

#### Implementation of

OnCommandHandler.cliPackageJson

#### Defined in

[packages/commander/src/create-command.ts:72](https://github.com/armitjs/armit/blob/18cfa59/packages/commander/src/create-command.ts#L72)

---

### name

• `get` **name**(): `string`

#### Returns

`string`

#### Implementation of

OnCommandHandler.name

#### Defined in

[packages/commander/src/create-command.ts:76](https://github.com/armitjs/armit/blob/18cfa59/packages/commander/src/create-command.ts#L76)

## Methods

### handle

▸ **handle**(): `void` \| `Promise`<`void`\>

#### Returns

`void` \| `Promise`<`void`\>

#### Implementation of

OnCommandHandler.handle

#### Defined in

[packages/commander/src/create-command.ts:80](https://github.com/armitjs/armit/blob/18cfa59/packages/commander/src/create-command.ts#L80)

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

[packages/commander/src/create-command.ts:63](https://github.com/armitjs/armit/blob/18cfa59/packages/commander/src/create-command.ts#L63)
