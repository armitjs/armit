import pic from 'picocolors';
import { DEFAULT_CONTEXT } from '../constant/default-context.js';
import { LogLevel } from '../constant/log-level.js';
import type { FormatStrategy } from '../core/format-strategy.js';

export class StdoutFormatStrategy implements FormatStrategy {
  private readonly localeStringOptions = {
    year: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
  } as const;

  private timestamp = true;

  print(priority: LogLevel, context: string, message: string, trace): void {
    this.logMessage(priority, this.ensureString(message), context, trace);
  }

  private logMessage(
    priority: LogLevel,
    message: string,
    context?: string,
    trace?
  ) {
    let prefix = pic.blue(LogLevel[LogLevel.Info].toLowerCase());
    let printMessage = this.ensureString(message);

    switch (priority) {
      case LogLevel.Debug:
        prefix = pic.magenta(LogLevel[LogLevel.Debug].toLowerCase());
        break;
      case LogLevel.Verbose:
        prefix = pic.magenta(LogLevel[LogLevel.Verbose].toLowerCase());
        break;
      case LogLevel.Info:
        prefix = pic.blue(LogLevel[LogLevel.Info].toLowerCase());
        break;
      case LogLevel.Warn:
        prefix = pic.yellow(LogLevel[LogLevel.Warn].toLowerCase());
        printMessage = pic.yellow(message);
        break;
      case LogLevel.Error:
        prefix = pic.red(LogLevel[LogLevel.Error].toLowerCase());
        printMessage = pic.red(
          this.ensureString(message) +
            (trace ? `\n${this.ensureString(trace)}` : '')
        );
        break;
    }
    (priority === LogLevel.Error ? process.stderr : process.stdout).write(
      [
        prefix,
        this.logTimestamp(),
        this.logContext(context),
        printMessage,
        '\n',
      ].join(' ')
    );
  }

  private logContext(context?: string) {
    return pic.cyan(`[${context || DEFAULT_CONTEXT}]`);
  }

  private logTimestamp() {
    if (this.timestamp) {
      const timestamp = new Date(Date.now()).toLocaleString(
        undefined,
        this.localeStringOptions
      );
      return pic.gray(timestamp + ' -');
    } else {
      return '';
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
