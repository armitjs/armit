import { Logger, LogLevel } from '@armit/logger';
import { StdoutAdapter, TerminalFormatStrategy } from '@armit/logger-node';

export const logger = new Logger({
  logLevel: LogLevel.Warn,
  adapter: new StdoutAdapter({
    formatStrategy: new TerminalFormatStrategy(),
  }),
});
