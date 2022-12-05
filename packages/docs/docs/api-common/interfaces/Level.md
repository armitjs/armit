---
id: "Level"
title: "Interface: Level<L>"
sidebar_label: "Level"
sidebar_position: 0
custom_edit_url: null
---

Represents a category to which you can log messages. Levels are usually used to represent various levels of importance.

## Type parameters

| Name | Type             |
| :--- | :--------------- |
| `L`  | extends `string` |

## Properties

### color

• **color**: [`Color`](../modules.md#color)[]

Any ANSI colors/formats which you want any messages logged to this level to have their timestamps highlighted in.

#### Defined in

[packages/common/src/terminal/types.ts:30](https://github.com/armitjs/armit/blob/84b6bb8/packages/common/src/terminal/types.ts#L30)

---

### isError

• **isError**: `boolean`

If true, each message logged to this level will be sent to `process.stderr` (standard error stream) instead of `process.stdout` (standard out stream).

#### Defined in

[packages/common/src/terminal/types.ts:35](https://github.com/armitjs/armit/blob/84b6bb8/packages/common/src/terminal/types.ts#L35)

---

### name

• **name**: `L`

The name of this level.

#### Defined in

[packages/common/src/terminal/types.ts:40](https://github.com/armitjs/armit/blob/84b6bb8/packages/common/src/terminal/types.ts#L40)
