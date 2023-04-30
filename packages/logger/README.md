# @armit/logger

Simple, pretty and powerful logger for nodejs

### Setup

Initialize

```ts
import { logger } from "@armit/logger";
logger.debug("hello", "context");
```

And customized adapter for nodejs

```ts
import { Logger } from "@armit/logger";
import { StdoutAdapter } from "@armit/logger-node";

const logger = new Logger({
  logLevel: LogLevel.Warn,
  adapter: new StdoutAdapter({
    formatStrategy: new TerminalFormatStrategy(),
  }),
});

logger.debug("hello", "context");
```

And customized adapter for web

```ts
import { Logger } from "@armit/logger";
import { ConsoleAdapter } from "@armit/logger-node";

const logger = new Logger({
  logLevel: LogLevel.Warn,
  adapter: new ConsoleAdapter({
    formatStrategy: new ConsoleFormatStrategy(),
  }),
});

logger.debug("hello", "context");
```
