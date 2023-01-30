import { LogLevel } from '../constant/log-level.js';
import type { LogAdapterConfig } from '../core/adapter.js';
import type { FormatStrategy } from '../core/format-strategy.js';
import { advancedLevels, TerminalLog } from '../terminal/terminal-log.js';

export class TerminalFormatStrategy implements FormatStrategy {
  private terminal = new TerminalLog({
    levels: advancedLevels,
    showLevelName: true,
    noColor: false,
  });

  constructor(options?: Pick<LogAdapterConfig, 'logLevel' | 'noColor'>) {
    if (options?.noColor) {
      this.terminal = new TerminalLog({
        levels: advancedLevels,
        showLevelName: true,
        noColor: true,
      });
    }
  }

  print(priority: LogLevel, context: string, message: string, trace?): void {
    switch (priority) {
      case LogLevel.Debug:
        this.terminal.log.debug(this.ensureString(message), context);
        break;
      case LogLevel.Verbose:
        this.terminal.log.trace(this.ensureString(message), context);
        break;
      case LogLevel.Info:
        this.terminal.log.info(this.ensureString(message), context);
        break;
      case LogLevel.Warn:
        this.terminal.log.warn(this.ensureString(message), context);
        break;
      case LogLevel.Error:
        this.terminal.log.error(this.ensureString(message), context, trace);
        break;
    }
  }

  private ensureString(message: string | object | unknown[]): string {
    return typeof message === 'string'
      ? message
      : message instanceof Error
      ? message.toString()
      : JSON.stringify(message, null, 2);
  }
}
