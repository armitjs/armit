import { DEFAULT_CONTEXT } from '../constant/default-context.js';
import { LoggerPrinter } from '../printer/logger-printer.js';
import type { LogPrinter } from '../printer/printer.js';
import type { LogAdapter, LogAdapterConfig } from './adapter.js';

export type LoggerOptions = LogAdapterConfig & {
  adapter?: LogAdapter;
  context?: string;
};

/**
 * The default logger, which logs to the console (stdout) with optional timestamps. Since this logger is part of the
 * default Vendure configuration, you do not need to specify it explicitly in your server config. You would only need
 * to specify it if you wish to change the log level (which defaults to `LogLevel.Info`) or remove the timestamp.
 *
 * @example
 * ```ts
 * import { Logger, LogLevel } from '\@armit/logger';
 *
 * export const logger =  new Logger({ logLevel: LogLevel.Debug }),
 * ```
 */
export class Logger {
  private printer: LogPrinter = new LoggerPrinter();
  private context = DEFAULT_CONTEXT;

  constructor(options?: LoggerOptions) {
    this.context = options?.context || DEFAULT_CONTEXT;
    if (options?.adapter) {
      this.addLogAdapter(options.adapter, options);
    }
  }

  usePrinter(printer: LogPrinter) {
    this.printer = printer;
    return this;
  }

  addLogAdapter(adapter: LogAdapter, config?: LogAdapterConfig | undefined) {
    this.printer.addAdapter(adapter, config);
    return this;
  }

  clearLogAdapters() {
    this.printer.clearLogAdapters();
    return this;
  }

  error(message: string | object, context?: string, trace?): void {
    this.printer.error(message, this.logContext(context), trace);
  }

  warn(message: string | object, context?: string): void {
    this.printer.warn(message, this.logContext(context));
  }

  info(message: string | object, context?: string): void {
    this.printer.info(message, this.logContext(context));
  }

  verbose(message: string | object, context?: string): void {
    this.printer.verbose(message, this.logContext(context));
  }

  debug(message: string | object, context?: string): void {
    this.printer.debug(message, this.logContext(context));
  }

  private logContext(context) {
    return context || this.context;
  }
}
