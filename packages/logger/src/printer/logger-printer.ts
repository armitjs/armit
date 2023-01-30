import { DEFAULT_CONTEXT } from '../constant/default-context.js';
import { LogLevel } from '../constant/log-level.js';
import type { LogAdapter, LogAdapterConfig } from '../core/adapter.js';
import type { LogPrinter } from './printer.js';

export class LoggerPrinter implements LogPrinter {
  private logAdapters: LogAdapter[] = [];

  error(message: string, context?: string, trace?: string): void {
    this.print(LogLevel.Error, message, context, trace);
  }

  warn(message: string, context?: string): void {
    this.print(LogLevel.Warn, message, context);
  }

  info(message: string, context?: string): void {
    this.print(LogLevel.Info, message, context);
  }

  verbose(message: string, context?: string): void {
    this.print(LogLevel.Verbose, message, context);
  }

  debug(message: string, context?: string): void {
    this.print(LogLevel.Debug, message, context);
  }

  addAdapter(adapter: LogAdapter, config?: LogAdapterConfig | undefined) {
    this.logAdapters.push(adapter.config(config));
    return this;
  }

  clearLogAdapters() {
    this.logAdapters = [];
    return this;
  }

  private print(priority: LogLevel, message: string, context?: string, trace?) {
    if (!message) {
      message = 'Empty/NULL log message';
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
        adapter.log(priority, context, message, trace);
      }
    }
  }
}
