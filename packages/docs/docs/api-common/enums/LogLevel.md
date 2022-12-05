---
id: "LogLevel"
title: "Enumeration: LogLevel"
sidebar_label: "LogLevel"
sidebar_position: 0
custom_edit_url: null
---

**`Description`**

An enum of valid logging levels.

## Enumeration Members

### Debug

• **Debug** = `4`

**`Description`**

Logs detailed info useful in debug scenarios, including stack traces for
all errors. In production this would probably generate too much noise.

#### Defined in

[packages/common/src/logger/logger.ts:49](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/logger/logger.ts#L49)

---

### Error

• **Error** = `0`

**`Description`**

Log Errors only. These are usually indicative of some potentially
serious issue, so should be acted upon.

#### Defined in

[packages/common/src/logger/logger.ts:27](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/logger/logger.ts#L27)

---

### Info

• **Info** = `2`

**`Description`**

Logs general information such as startup messages.

#### Defined in

[packages/common/src/logger/logger.ts:38](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/logger/logger.ts#L38)

---

### Verbose

• **Verbose** = `3`

**`Description`**

Logs additional information

#### Defined in

[packages/common/src/logger/logger.ts:43](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/logger/logger.ts#L43)

---

### Warn

• **Warn** = `1`

**`Description`**

Warnings indicate that some situation may require investigation
and handling. But not as serious as an Error.

#### Defined in

[packages/common/src/logger/logger.ts:33](https://github.com/armitjs/armit/blob/204c0a1/packages/common/src/logger/logger.ts#L33)
