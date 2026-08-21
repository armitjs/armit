import pic from 'picocolors';
import { DEFAULT_CONTEXT, LogLevel } from '@armit/logger';
export class StdoutFormatStrategy {
  options;
  localeStringOptions = {
    year: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
  };
  timestamp = true;
  constructor(options) {
    this.options = options;
  }
  print(priority, context, message, trace) {
    this.logMessage(priority, this.ensureString(message), context, trace);
  }
  logMessage(priority, message, context, trace) {
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
    const stdstream =
      priority === LogLevel.Error
        ? (this.options?.stderr ?? process.stderr)
        : (this.options?.stdout ?? process.stdout);
    stdstream.write(
      [
        prefix,
        this.logTimestamp(),
        this.logContext(context),
        printMessage,
        '\n',
      ].join(' ')
    );
  }
  logContext(context) {
    return pic.cyan(`[${context || DEFAULT_CONTEXT}]`);
  }
  logTimestamp() {
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
  ensureString(message) {
    return typeof message === 'string'
      ? message
      : message instanceof Error
        ? message.toString()
        : JSON.stringify(message, null, 2);
  }
}
