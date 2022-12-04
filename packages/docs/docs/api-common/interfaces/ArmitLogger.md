---
id: "ArmitLogger"
title: "Interface: ArmitLogger"
sidebar_label: "ArmitLogger"
sidebar_position: 0
custom_edit_url: null
---

## Implemented by

- [`DefaultLogger`](../classes/DefaultLogger.md)

## Methods

### chalk

▸ **chalk**(`colors`, `txt`): `string`

#### Parameters

| Name     | Type                                      |
| :------- | :---------------------------------------- |
| `colors` | readonly [`Color`](../modules.md#color)[] |
| `txt`    | `string` \| `object`                      |

#### Returns

`string`

#### Defined in

[packages/common/src/logger/logger.ts:11](https://github.com/armitjs/armit/blob/224552a/packages/common/src/logger/logger.ts#L11)

---

### debug

▸ **debug**(`message`, `context?`): `void`

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `message`  | `string` |
| `context?` | `string` |

#### Returns

`void`

#### Defined in

[packages/common/src/logger/logger.ts:10](https://github.com/armitjs/armit/blob/224552a/packages/common/src/logger/logger.ts#L10)

---

### error

▸ **error**(`message`, `context?`, `trace?`): `void`

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `message`  | `string` |
| `context?` | `string` |
| `trace?`   | `string` |

#### Returns

`void`

#### Defined in

[packages/common/src/logger/logger.ts:6](https://github.com/armitjs/armit/blob/224552a/packages/common/src/logger/logger.ts#L6)

---

### info

▸ **info**(`message`, `context?`): `void`

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `message`  | `string` |
| `context?` | `string` |

#### Returns

`void`

#### Defined in

[packages/common/src/logger/logger.ts:8](https://github.com/armitjs/armit/blob/224552a/packages/common/src/logger/logger.ts#L8)

---

### setDefaultContext

▸ `Optional` **setDefaultContext**(`defaultContext`): `void`

#### Parameters

| Name             | Type     |
| :--------------- | :------- |
| `defaultContext` | `string` |

#### Returns

`void`

#### Defined in

[packages/common/src/logger/logger.ts:13](https://github.com/armitjs/armit/blob/224552a/packages/common/src/logger/logger.ts#L13)

---

### setOptions

▸ **setOptions**(`options`): `void`

#### Parameters

| Name      | Type            |
| :-------- | :-------------- |
| `options` | `LoggerOptions` |

#### Returns

`void`

#### Defined in

[packages/common/src/logger/logger.ts:12](https://github.com/armitjs/armit/blob/224552a/packages/common/src/logger/logger.ts#L12)

---

### verbose

▸ **verbose**(`message`, `context?`): `void`

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `message`  | `string` |
| `context?` | `string` |

#### Returns

`void`

#### Defined in

[packages/common/src/logger/logger.ts:9](https://github.com/armitjs/armit/blob/224552a/packages/common/src/logger/logger.ts#L9)

---

### warn

▸ **warn**(`message`, `context?`): `void`

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `message`  | `string` |
| `context?` | `string` |

#### Returns

`void`

#### Defined in

[packages/common/src/logger/logger.ts:7](https://github.com/armitjs/armit/blob/224552a/packages/common/src/logger/logger.ts#L7)
