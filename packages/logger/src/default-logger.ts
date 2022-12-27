import { terminalColor } from '@armit/terminal';
import { LogLevel } from './logger.js';
import type { ArmitLogger, LoggerOptions } from './logger.js';
import type { Color } from './terminal-log.js';
import { advancedLevels, TerminalLog } from './terminal-log.js';

const DEFAULT_CONTEXT = 'Armitjs';

/**
 * The default logger, which logs to the console (stdout) with optional timestamps. Since this logger is part of the
 * default Vendure configuration, you do not need to specify it explicitly in your server config. You would only need
 * to specify it if you wish to change the log level (which defaults to `LogLevel.Info`) or remove the timestamp.
 *
 * @example
 * ```ts
 * import { DefaultLogger, LogLevel } from '\@armit/logger';
 *
 * export const logger =  new DefaultLogger({ level: LogLevel.Debug }),
 * ```
 */
export class DefaultLogger implements ArmitLogger {
  private level: LogLevel = LogLevel.Info;
  private noColor = false;
  private defaultContext = DEFAULT_CONTEXT;

  private terminal = new TerminalLog({
    levels: advancedLevels,
    showLevelName: true,
    noColor: false,
  });

  constructor(options?: LoggerOptions) {
    this.setOptions(options);
  }

  setOptions(options?: LoggerOptions) {
    this.noColor = options?.noColor || false;
    this.level = options?.level ? options.level : LogLevel.Info;

    if (options?.level) {
      this.level = options.level;
    }
    if (options?.noColor) {
      this.terminal = new TerminalLog({
        levels: advancedLevels,
        showLevelName: true,
        noColor: true,
      });
    }
    if (options?.context) {
      this.setDefaultContext(options.context);
    }
  }

  setDefaultContext(defaultContext: string) {
    this.defaultContext = defaultContext;
  }

  /**
   * Terminal output formatting with ANSI colors.
   * @returns
   */
  chalk(colors: readonly Color[], txt: string | object): string {
    return terminalColor(colors, this.noColor)(this.ensureString(txt));
  }

  error(
    message: string | object,
    context?: string,
    trace?: string | undefined
  ): void {
    if (this.level >= LogLevel.Error) {
      this.terminal.log.error(
        this.ensureString(message),
        this.logContext(context),
        trace
      );
    }
  }

  warn(message: string | object, context?: string): void {
    if (this.level >= LogLevel.Warn) {
      this.terminal.log.warn(
        this.ensureString(message),
        this.logContext(context)
      );
    }
  }
  info(message: string | object, context?: string): void {
    if (this.level >= LogLevel.Info) {
      this.terminal.log.info(
        this.ensureString(message),
        this.logContext(context)
      );
    }
  }
  verbose(message: string | object, context?: string): void {
    if (this.level >= LogLevel.Verbose) {
      this.terminal.log.trace(
        this.ensureString(message),
        this.logContext(context)
      );
    }
  }

  debug(message: string | object, context?: string): void {
    if (this.level >= LogLevel.Debug) {
      this.terminal.log.debug(this.ensureString(message), context);
    }
  }

  private logContext(context?: string) {
    return context || this.defaultContext;
  }

  private ensureString(message: string | object | unknown[]): string {
    return typeof message === 'string'
      ? message
      : JSON.stringify(message, null, 2);
  }
}
