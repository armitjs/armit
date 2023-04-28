import { DEFAULT_CONTEXT } from '../constant/default-context.js';
import { LogLevel } from '../constant/log-level.js';
import type { LogAdapter, LogAdapterConfig } from '../core/adapter.js';
import type { LogPrinter } from './printer.js';

export class LoggerPrinter<MessageType> implements LogPrinter<MessageType> {
  private logAdapters: LogAdapter<MessageType>[] = [];

  error(message: MessageType, context?: string, trace?): void {
    this.print(LogLevel.Error, message, context, trace);
  }

  warn(message: MessageType, context?: string): void {
    this.print(LogLevel.Warn, message, context);
  }

  info(message: MessageType, context?: string): void {
    this.print(LogLevel.Info, message, context);
  }

  verbose(message: MessageType, context?: string): void {
    this.print(LogLevel.Verbose, message, context);
  }

  debug(message: MessageType, context?: string): void {
    this.print(LogLevel.Debug, message, context);
  }

  addAdapter(
    adapter: LogAdapter<MessageType>,
    config?: LogAdapterConfig<MessageType> | undefined
  ) {
    this.logAdapters.push(adapter.config(config));
    return this;
  }

  clearLogAdapters() {
    this.logAdapters = [];
    return this;
  }

  private print(
    priority: LogLevel,
    message: MessageType,
    context?: string,
    trace?
  ) {
    if (!message) {
      message = 'Empty/NULL log message' as MessageType;
    }

    if (!context) {
      context = DEFAULT_CONTEXT;
    }

    if (this.logAdapters.length === 0) {
      throw new Error(`No registered adapters were found!`);
    }

    for (let index = 0; index < this.logAdapters.length; index++) {
      const adapter = this.logAdapters[index];
      const loggable = adapter.isLoggable(priority, context);
      if (loggable) {
        adapter.print(priority, context, message, trace);
      }
    }
  }
}
