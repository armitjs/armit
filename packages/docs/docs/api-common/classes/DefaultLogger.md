---
id: "DefaultLogger"
title: "Class: DefaultLogger"
sidebar_label: "DefaultLogger"
sidebar_position: 0
custom_edit_url: null
---

The default logger, which logs to the console (stdout) with optional timestamps. Since this logger is part of the
default Vendure configuration, you do not need to specify it explicitly in your server config. You would only need
to specify it if you wish to change the log level (which defaults to `LogLevel.Info`) or remove the timestamp.

**`Example`**

```ts
import { DefaultLogger, LogLevel } from "@armit/common";

export const logger = new DefaultLogger({ level: LogLevel.Debug });
```

## Implements

- [`ArmitLogger`](../interfaces/ArmitLogger.md)

## Constructors

### constructor

• **new DefaultLogger**(`options?`)

#### Parameters

| Name       | Type            |
| :--------- | :-------------- |
| `options?` | `LoggerOptions` |

#### Defined in

[packages/common/src/logger/logger.ts:78](https://github.com/armitjs/armit/blob/84b6bb8/packages/common/src/logger/logger.ts#L78)

## Properties

### defaultContext

• `Private` **defaultContext**: `string` = `DEFAULT_CONTEXT`

#### Defined in

[packages/common/src/logger/logger.ts:70](https://github.com/armitjs/armit/blob/84b6bb8/packages/common/src/logger/logger.ts#L70)

---

### level

• `Private` **level**: [`LogLevel`](../enums/LogLevel.md) = `LogLevel.Info`

#### Defined in

[packages/common/src/logger/logger.ts:68](https://github.com/armitjs/armit/blob/84b6bb8/packages/common/src/logger/logger.ts#L68)

---

### noColor

• `Private` **noColor**: `boolean` = `false`

#### Defined in

[packages/common/src/logger/logger.ts:69](https://github.com/armitjs/armit/blob/84b6bb8/packages/common/src/logger/logger.ts#L69)

---

### terminal

• `Private` **terminal**: [`Terminal`](Terminal.md)<`"error"` \| `"warn"` \| `"info"` \| `"trace"` \| `"debug"` \| `"fatal"`\>

#### Defined in

[packages/common/src/logger/logger.ts:72](https://github.com/armitjs/armit/blob/84b6bb8/packages/common/src/logger/logger.ts#L72)

## Methods

### chalk

▸ **chalk**(`colors`, `txt`): `string`

Terminal output formatting with ANSI colors.

#### Parameters

| Name     | Type                                      |
| :------- | :---------------------------------------- |
| `colors` | readonly [`Color`](../modules.md#color)[] |
| `txt`    | `string` \| `object`                      |

#### Returns

`string`

#### Implementation of

[ArmitLogger](../interfaces/ArmitLogger.md).[chalk](../interfaces/ArmitLogger.md#chalk)

#### Defined in

[packages/common/src/logger/logger.ts:109](https://github.com/armitjs/armit/blob/84b6bb8/packages/common/src/logger/logger.ts#L109)

---

### debug

▸ **debug**(`message`, `context?`): `void`

#### Parameters

| Name       | Type                 |
| :--------- | :------------------- |
| `message`  | `string` \| `object` |
| `context?` | `string`             |

#### Returns

`void`

#### Implementation of

[ArmitLogger](../interfaces/ArmitLogger.md).[debug](../interfaces/ArmitLogger.md#debug)

#### Defined in

[packages/common/src/logger/logger.ts:152](https://github.com/armitjs/armit/blob/84b6bb8/packages/common/src/logger/logger.ts#L152)

---

### ensureString

▸ `Private` **ensureString**(`message`): `string`

#### Parameters

| Name      | Type                                |
| :-------- | :---------------------------------- |
| `message` | `string` \| `object` \| `unknown`[] |

#### Returns

`string`

#### Defined in

[packages/common/src/logger/logger.ts:162](https://github.com/armitjs/armit/blob/84b6bb8/packages/common/src/logger/logger.ts#L162)

---

### error

▸ **error**(`message`, `context?`, `trace?`): `void`

#### Parameters

| Name       | Type                 |
| :--------- | :------------------- |
| `message`  | `string` \| `object` |
| `context?` | `string`             |
| `trace?`   | `string`             |

#### Returns

`void`

#### Implementation of

[ArmitLogger](../interfaces/ArmitLogger.md).[error](../interfaces/ArmitLogger.md#error)

#### Defined in

[packages/common/src/logger/logger.ts:113](https://github.com/armitjs/armit/blob/84b6bb8/packages/common/src/logger/logger.ts#L113)

---

### info

▸ **info**(`message`, `context?`): `void`

#### Parameters

| Name       | Type                 |
| :--------- | :------------------- |
| `message`  | `string` \| `object` |
| `context?` | `string`             |

#### Returns

`void`

#### Implementation of

[ArmitLogger](../interfaces/ArmitLogger.md).[info](../interfaces/ArmitLogger.md#info)

#### Defined in

[packages/common/src/logger/logger.ts:135](https://github.com/armitjs/armit/blob/84b6bb8/packages/common/src/logger/logger.ts#L135)

---

### logContext

▸ `Private` **logContext**(`context?`): `string`

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `context?` | `string` |

#### Returns

`string`

#### Defined in

[packages/common/src/logger/logger.ts:158](https://github.com/armitjs/armit/blob/84b6bb8/packages/common/src/logger/logger.ts#L158)

---

### setDefaultContext

▸ **setDefaultContext**(`defaultContext`): `void`

#### Parameters

| Name             | Type     |
| :--------------- | :------- |
| `defaultContext` | `string` |

#### Returns

`void`

#### Implementation of

[ArmitLogger](../interfaces/ArmitLogger.md).[setDefaultContext](../interfaces/ArmitLogger.md#setdefaultcontext)

#### Defined in

[packages/common/src/logger/logger.ts:101](https://github.com/armitjs/armit/blob/84b6bb8/packages/common/src/logger/logger.ts#L101)

---

### setOptions

▸ **setOptions**(`options?`): `void`

#### Parameters

| Name       | Type            |
| :--------- | :-------------- |
| `options?` | `LoggerOptions` |

#### Returns

`void`

#### Implementation of

[ArmitLogger](../interfaces/ArmitLogger.md).[setOptions](../interfaces/ArmitLogger.md#setoptions)

#### Defined in

[packages/common/src/logger/logger.ts:82](https://github.com/armitjs/armit/blob/84b6bb8/packages/common/src/logger/logger.ts#L82)

---

### verbose

▸ **verbose**(`message`, `context?`): `void`

#### Parameters

| Name       | Type                 |
| :--------- | :------------------- |
| `message`  | `string` \| `object` |
| `context?` | `string`             |

#### Returns

`void`

#### Implementation of

[ArmitLogger](../interfaces/ArmitLogger.md).[verbose](../interfaces/ArmitLogger.md#verbose)

#### Defined in

[packages/common/src/logger/logger.ts:143](https://github.com/armitjs/armit/blob/84b6bb8/packages/common/src/logger/logger.ts#L143)

---

### warn

▸ **warn**(`message`, `context?`): `void`

#### Parameters

| Name       | Type                 |
| :--------- | :------------------- |
| `message`  | `string` \| `object` |
| `context?` | `string`             |

#### Returns

`void`

#### Implementation of

[ArmitLogger](../interfaces/ArmitLogger.md).[warn](../interfaces/ArmitLogger.md#warn)

#### Defined in

[packages/common/src/logger/logger.ts:127](https://github.com/armitjs/armit/blob/84b6bb8/packages/common/src/logger/logger.ts#L127)
