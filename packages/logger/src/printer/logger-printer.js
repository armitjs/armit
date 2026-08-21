import { DEFAULT_CONTEXT } from '../constant/default-context.js';
import { LogLevel } from '../constant/log-level.js';
export class LoggerPrinter {
  logAdapters = [];
  error(message, context, trace) {
    this.print(LogLevel.Error, message, context, trace);
  }
  warn(message, context) {
    this.print(LogLevel.Warn, message, context);
  }
  info(message, context) {
    this.print(LogLevel.Info, message, context);
  }
  verbose(message, context) {
    this.print(LogLevel.Verbose, message, context);
  }
  debug(message, context) {
    this.print(LogLevel.Debug, message, context);
  }
  addAdapter(adapter, config) {
    this.logAdapters.push(adapter.config(config));
    return this;
  }
  reConfig(config) {
    for (let index = 0; index < this.logAdapters.length; index++) {
      const adapter = this.logAdapters[index];
      adapter.config(config);
    }
    return this;
  }
  clearLogAdapters() {
    this.logAdapters = [];
    return this;
  }
  print(priority, message, context, trace) {
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
        adapter.print(priority, context, message, trace);
      }
    }
  }
}
