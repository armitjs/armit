import { DEFAULT_CONTEXT } from '../constant/default-context.js';
import { LoggerPrinter } from '../printer/logger-printer.js';
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
  printer = new LoggerPrinter();
  context = DEFAULT_CONTEXT;
  constructor(options) {
    this.context = options?.context || DEFAULT_CONTEXT;
    if (options?.adapter) {
      this.addLogAdapter(options.adapter, options);
    }
  }
  usePrinter(printer) {
    this.printer = printer;
    return this;
  }
  reConfig(options) {
    this.context = options?.context || this.context;
    this.printer.reConfig(options);
  }
  addLogAdapter(adapter, config) {
    this.printer.addAdapter(adapter, config);
    return this;
  }
  clearLogAdapters() {
    this.printer.clearLogAdapters();
    return this;
  }
  error(message, context, trace) {
    this.printer.error(message, this.logContext(context), trace);
  }
  warn(message, context) {
    this.printer.warn(message, this.logContext(context));
  }
  info(message, context) {
    this.printer.info(message, this.logContext(context));
  }
  verbose(message, context) {
    this.printer.verbose(message, this.logContext(context));
  }
  debug(message, context) {
    this.printer.debug(message, this.logContext(context));
  }
  logContext(context) {
    return context || this.context;
  }
}
