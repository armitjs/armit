---
id: "TerminalConstructorData"
title: "Interface: TerminalConstructorData<L>"
sidebar_label: "TerminalConstructorData"
sidebar_position: 0
custom_edit_url: null
---

Customization options for how logs are to be displayed in the terminal.

## Type parameters

| Name | Type             |
| :--- | :--------------- |
| `L`  | extends `string` |

## Properties

### capitalizeLevelName

• `Optional` **capitalizeLevelName**: `boolean`

Whether or not to capitalize the name of a log's corresponding level when it's attached to the log. Keep in mind that you can only see the name of a log's corresponding level when `showLevelName` is also true.

### **No capitalization:**

`[ info ] Something very interesting happened.`

### **Capitalization:**

`[ INFO ] Something very interesting happened.`

#### Defined in

[packages/common/src/terminal/types.ts:58](https://github.com/armitjs/armit/blob/224552a/packages/common/src/terminal/types.ts#L58)

---

### contextColor

• `Optional` **contextColor**: [`Color`](../modules.md#color)[]

The colors Will be painted on `context` if have.

**`Default`**

['bold', 'black']

#### Defined in

[packages/common/src/terminal/types.ts:69](https://github.com/armitjs/armit/blob/224552a/packages/common/src/terminal/types.ts#L69)

---

### levels

• **levels**: [`Level`](Level.md)<`L`\>[]

A list of categories which you can log to.

#### Defined in

[packages/common/src/terminal/types.ts:63](https://github.com/armitjs/armit/blob/224552a/packages/common/src/terminal/types.ts#L63)

---

### noColor

• `Optional` **noColor**: `boolean`

Removes colors from the console output

**`Default`**

false

#### Defined in

[packages/common/src/terminal/types.ts:142](https://github.com/armitjs/armit/blob/224552a/packages/common/src/terminal/types.ts#L142)

---

### showArrow

• `Optional` **showArrow**: `boolean`

Whether or not to show a cool arrow before a log's message.

`>> baz`

#### Defined in

[packages/common/src/terminal/types.ts:75](https://github.com/armitjs/armit/blob/224552a/packages/common/src/terminal/types.ts#L75)

---

### showDate

• `Optional` **showDate**: `boolean`

If true, each message logged to the terminal will have a date corresponding to when the message was logged attached to it.

`[ 12d/5m/2011y ] foo`

#### Defined in

[packages/common/src/terminal/types.ts:82](https://github.com/armitjs/armit/blob/224552a/packages/common/src/terminal/types.ts#L82)

---

### showLevelName

• `Optional` **showLevelName**: `boolean`

If true, each message logged to the terminal will have the name of the level of the message attached to it.

`[ FATAL ] WHAT WILL I DO?!`

#### Defined in

[packages/common/src/terminal/types.ts:89](https://github.com/armitjs/armit/blob/224552a/packages/common/src/terminal/types.ts#L89)

---

### showMonthBeforeDay

• `Optional` **showMonthBeforeDay**: `boolean`

If true, the date displayed on each message logged to the console will have the month before the day. Keep in mind that the date of when a log was logged to the console is only displayed when `showDate` is also true.

### **Day before month:**

`[ 20d/12m/1999y ] loy`

### **Month before day:**

`[ 12m/20d/1999y ] loy`

#### Defined in

[packages/common/src/terminal/types.ts:102](https://github.com/armitjs/armit/blob/224552a/packages/common/src/terminal/types.ts#L102)

---

### showRelativeTimestamp

• `Optional` **showRelativeTimestamp**: `boolean`

If true, each message logged to the terminal will have a timestamp relative to the creation of this particular instance of the `Terminal` class.

`[ 5y 1m 15h 51min 7s 300ms ] A long time has passed.`

#### Defined in

[packages/common/src/terminal/types.ts:109](https://github.com/armitjs/armit/blob/224552a/packages/common/src/terminal/types.ts#L109)

---

### showTimestamp

• `Optional` **showTimestamp**: `boolean`

If true, each message logged to the terminal will have a timestamp corresponding to the exact time the message was logged.

`[ 13:43:10.23 ] bar`

#### Defined in

[packages/common/src/terminal/types.ts:116](https://github.com/armitjs/armit/blob/224552a/packages/common/src/terminal/types.ts#L116)

---

### showTimestampRelativeToLastLog

• `Optional` **showTimestampRelativeToLastLog**: `boolean`

If true, each message logged to the terminal will have a timestamp relative to when the previous message was logged to the terminal.

`[ +31min +5s +903ms ] It took forever!`

#### Defined in

[packages/common/src/terminal/types.ts:123](https://github.com/armitjs/armit/blob/224552a/packages/common/src/terminal/types.ts#L123)

---

### use24HourClock

• `Optional` **use24HourClock**: `boolean`

If true, the timestamp on each message logged to the console will be displayed using the 24 hour clock instead of the 12 hour clock. Keep in mind that the timestamp of when a log was logged to the console is only displayed when `showTimestamp` is also true.

### **24 hour clock:**

`[ 13:27:55.33 ] pow`

### **12 hour clock:**

`[ 1:27:55.33 PM ] pow`

#### Defined in

[packages/common/src/terminal/types.ts:136](https://github.com/armitjs/armit/blob/224552a/packages/common/src/terminal/types.ts#L136)
