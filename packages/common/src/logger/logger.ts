import { terminalColor } from '../terminal/terminal-color.js';
import type { Color } from '../terminal/terminal-log.js';
import { advancedLevels, Terminal } from '../terminal/terminal-log.js';

export interface ArmitLogger {
  error(message: string, context?: string, trace?: string): void;
  warn(message: string, context?: string): void;
  info(message: string, context?: string): void;
  verbose(message: string, context?: string): void;
  debug(message: string, context?: string): void;
  setDefaultContext?(defaultContext: string): void;
}

/**
 * @description
 * An enum of valid logging levels.
 *
 */
export enum LogLevel {
  /**
   * @description
   * Log Errors only. These are usually indicative of some potentially
   * serious issue, so should be acted upon.
   */
  Error = 0,
  /**
   * @description
   * Warnings indicate that some situation may require investigation
   * and handling. But not as serious as an Error.
   */
  Warn = 1,
  /**
   * @description
   * Logs general information such as startup messages.
   */
  Info = 2,
  /**
   * @description
   * Logs additional information
   */
  Verbose = 3,
  /**
   * @description
   * Logs detailed info useful in debug scenarios, including stack traces for
   * all errors. In production this would probably generate too much noise.
   */
  Debug = 4,
}

const DEFAULT_CONTEXT = 'Armitjs';

/**
 * The default logger, which logs to the console (stdout) with optional timestamps. Since this logger is part of the
 * default Vendure configuration, you do not need to specify it explicitly in your server config. You would only need
 * to specify it if you wish to change the log level (which defaults to `LogLevel.Info`) or remove the timestamp.
 *
 * @example
 * ```ts
 * import { DefaultLogger, LogLevel } from '\@armit/common';
 *
 * export const logger =  new DefaultLogger({ level: LogLevel.Debug, timestamp: false }),
 * ```
 */
export class DefaultLogger implements ArmitLogger {
  private level: LogLevel = LogLevel.Info;
  private noColor = false;
  private defaultContext = DEFAULT_CONTEXT;

  private terminal = new Terminal({
    levels: advancedLevels,
    showLevelName: true,
    noColor: false,
  });

  constructor(options?: { level?: LogLevel; noColor?: boolean }) {
    this.level =
      options && options.level != null ? options.level : LogLevel.Info;
    this.noColor = options?.noColor || false;

    if (this.noColor) {
      this.terminal = new Terminal({
        levels: advancedLevels,
        showLevelName: true,
        noColor: true,
      });
    }
  }

  setLevel(level: LogLevel) {
    this.level = level;
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
