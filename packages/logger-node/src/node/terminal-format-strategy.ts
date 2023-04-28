import type { FormatStrategy } from '@armit/logger';
import { LogLevel } from '@armit/logger';
import { TerminalLog, advancedLevels } from '../terminal/terminal-log.js';

export class TerminalFormatStrategy<MessageType>
  implements FormatStrategy<MessageType>
{
  private terminal = new TerminalLog({
    levels: advancedLevels,
    showLevelName: true,
    noColor: false,
  });

  constructor(options?: { noColor?: boolean }) {
    if (options?.noColor) {
      this.terminal = new TerminalLog({
        levels: advancedLevels,
        showLevelName: true,
        noColor: true,
      });
    }
  }

  print(
    priority: LogLevel,
    context: string,
    message: MessageType,
    trace?
  ): void {
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

  private ensureString(message): string {
    return typeof message === 'string'
      ? message
      : message instanceof Error
      ? message.toString()
      : JSON.stringify(message, null, 2);
  }
}
