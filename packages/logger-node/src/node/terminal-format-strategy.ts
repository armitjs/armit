import type { FormatStrategy } from '@armit/logger';
import { LogLevel } from '@armit/logger';
import {
  advancedLevels,
  type TerminalData,
  TerminalLog,
} from '../terminal/terminal-log.js';
import type { CustomizedStdWriteStream } from '../types.js';

export class TerminalFormatStrategy<MessageType>
  implements FormatStrategy<MessageType>
{
  private terminal: TerminalLog<
    'error' | 'trace' | 'debug' | 'fatal' | 'info' | 'warn'
  >;

  constructor(
    options?: Partial<
      Pick<
        TerminalData,
        | 'noColor'
        | 'showLevelName'
        | 'use24HourClock'
        | 'showTimestamp'
        | 'showRelativeTimestamp'
        | 'showTimestampRelativeToLastLog'
        | 'showContext'
      >
    > &
      CustomizedStdWriteStream
  ) {
    this.terminal = new TerminalLog({
      levels: advancedLevels,
      showLevelName: options?.showLevelName,
      noColor: options?.noColor,
      showTimestamp: options?.showTimestamp,
      showRelativeTimestamp: options?.showRelativeTimestamp,
      showTimestampRelativeToLastLog: options?.showTimestampRelativeToLastLog,
      showContext: options?.showContext,
      use24HourClock: options?.use24HourClock,
      stdout: options?.stdout,
      stderr: options?.stderr,
    });
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
