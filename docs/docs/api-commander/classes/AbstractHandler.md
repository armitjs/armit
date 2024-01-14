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

- `OnCommandHandler`

## Constructors

### constructor

• **new AbstractHandler**\<`T`\>(`args`): [`AbstractHandler`](AbstractHandler.md)\<`T`\>

#### Type parameters

| Name | Type                                                               |
| :--- | :----------------------------------------------------------------- |
| `T`  | extends [`CommandArgv`](../modules.md#commandargv)\<`ArgvConfig`\> |

#### Parameters

| Name   | Type               |
| :----- | :----------------- |
| `args` | `Arguments`\<`T`\> |

#### Returns

[`AbstractHandler`](AbstractHandler.md)\<`T`\>

#### Defined in

[packages/commander/src/create-command.ts:72](https://github.com/armitjs/armit/blob/bd1948c/packages/commander/src/create-command.ts#L72)

## Properties

### args

• `Protected` **args**: `Arguments`\<`T`\>

#### Defined in

[packages/commander/src/create-command.ts:72](https://github.com/armitjs/armit/blob/bd1948c/packages/commander/src/create-command.ts#L72)

---

### logger

• `Protected` **logger**: `Logger`\<`unknown`, \{ `adapter`: `StdoutAdapter`\<`unknown`\> ; `logLevel`: `LogLevel` }\>

#### Defined in

[packages/commander/src/create-command.ts:54](https://github.com/armitjs/armit/blob/bd1948c/packages/commander/src/create-command.ts#L54)

---

### packageJson

• `Private` **packageJson**: `PackageJson`

#### Defined in

[packages/commander/src/create-command.ts:70](https://github.com/armitjs/armit/blob/bd1948c/packages/commander/src/create-command.ts#L70)

---

### pluginName

• `Private` **pluginName**: `string`

#### Defined in

[packages/commander/src/create-command.ts:69](https://github.com/armitjs/armit/blob/bd1948c/packages/commander/src/create-command.ts#L69)

## Accessors

### cliPackageJson

• `get` **cliPackageJson**(): `PackageJson`

#### Returns

`PackageJson`

#### Implementation of

OnCommandHandler.cliPackageJson

#### Defined in

[packages/commander/src/create-command.ts:98](https://github.com/armitjs/armit/blob/bd1948c/packages/commander/src/create-command.ts#L98)

---

### name

• `get` **name**(): `string`

#### Returns

`string`

#### Implementation of

OnCommandHandler.name

#### Defined in

[packages/commander/src/create-command.ts:102](https://github.com/armitjs/armit/blob/bd1948c/packages/commander/src/create-command.ts#L102)

## Methods

### handle

▸ **handle**(): `void` \| `Promise`\<`void`\>

The `CommanderHandler` class should inherit and implment this function

#### Returns

`void` \| `Promise`\<`void`\>

#### Implementation of

OnCommandHandler.handle

#### Defined in

[packages/commander/src/create-command.ts:121](https://github.com/armitjs/armit/blob/bd1948c/packages/commander/src/create-command.ts#L121)

---

### initialize

▸ **initialize**(): `void`

The `CommanderHandler` class should inherit and implment this function,

#### Returns

`void`

**`Example`**

```ts
console.log(this.args.logLevel);
```

#### Implementation of

OnCommandHandler.initialize

#### Defined in

[packages/commander/src/create-command.ts:114](https://github.com/armitjs/armit/blob/bd1948c/packages/commander/src/create-command.ts#L114)

---

### updateLogger

▸ **updateLogger**(`args`): `void`

#### Parameters

| Name   | Type               |
| :----- | :----------------- |
| `args` | `Arguments`\<`T`\> |

#### Returns

`void`

#### Defined in

[packages/commander/src/create-command.ts:79](https://github.com/armitjs/armit/blob/bd1948c/packages/commander/src/create-command.ts#L79)
