---
id: "Terminal"
title: "Class: Terminal<L>"
sidebar_label: "Terminal"
sidebar_position: 0
custom_edit_url: null
---

Represents the console.

## Type parameters

| Name | Type             |
| :--- | :--------------- |
| `L`  | extends `string` |

## Constructors

### constructor

• **new Terminal**<`L`\>(`data`)

Represents the console.

#### Type parameters

| Name | Type             |
| :--- | :--------------- |
| `L`  | extends `string` |

#### Parameters

| Name   | Type                                                                        | Description                                 |
| :----- | :-------------------------------------------------------------------------- | :------------------------------------------ |
| `data` | [`TerminalConstructorData`](../interfaces/TerminalConstructorData.md)<`L`\> | Any customization options for the terminal. |

#### Defined in

[packages/common/src/terminal/terminal-log.ts:351](https://github.com/armitjs/armit/blob/224552a/packages/common/src/terminal/terminal-log.ts#L351)

## Properties

### data

• `Readonly` **data**: [`Locked`](../modules.md#locked)<`Required`<[`TerminalConstructorData`](../interfaces/TerminalConstructorData.md)<`string`\>\>\>

Customization options that were inputted when this terminal instance was created.

#### Defined in

[packages/common/src/terminal/terminal-log.ts:178](https://github.com/armitjs/armit/blob/224552a/packages/common/src/terminal/terminal-log.ts#L178)

---

### log

• `Readonly` **log**: `Record`<`L`, (`message`: `string`, `context?`: `string`, `trace?`: `string`) => `void`\>

Represents the logger. Any methods of `log` logs a message to a specific level.

Note `trace?` is availble only for `Level` with `isError=true`

**`Example`**

```
log.error("faz");
log.error("faz", 'context')
log.error("faz", 'context', 'trace');

```

Logs "faz" to the `error` level if such a level even exists.

#### Defined in

[packages/common/src/terminal/terminal-log.ts:196](https://github.com/armitjs/armit/blob/224552a/packages/common/src/terminal/terminal-log.ts#L196)

---

### startTime

• `Readonly` **startTime**: `Date`

The time when this terminal instance was created.

#### Defined in

[packages/common/src/terminal/terminal-log.ts:204](https://github.com/armitjs/armit/blob/224552a/packages/common/src/terminal/terminal-log.ts#L204)

---

### timeInLastLog

• **timeInLastLog**: `Date`

The time when the last message was logged to the terminal.

#### Defined in

[packages/common/src/terminal/terminal-log.ts:209](https://github.com/armitjs/armit/blob/224552a/packages/common/src/terminal/terminal-log.ts#L209)

## Methods

### logMsg

▸ `Private` **logMsg**(`level`, `message`, `context?`, `trace?`): `void`

#### Parameters

| Name       | Type                                         |
| :--------- | :------------------------------------------- |
| `level`    | [`Level`](../interfaces/Level.md)<`string`\> |
| `message`  | `string`                                     |
| `context?` | `string`                                     |
| `trace?`   | `any`                                        |

#### Returns

`void`

#### Defined in

[packages/common/src/terminal/terminal-log.ts:212](https://github.com/armitjs/armit/blob/224552a/packages/common/src/terminal/terminal-log.ts#L212)
