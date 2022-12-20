import type { Color } from './types.js';

export type LoggerOptions = {
  level?: LogLevel;
  noColor?: boolean;
  context?: string;
};

export interface ArmitLogger {
  error(message: string, context?: string, trace?: string): void;
  warn(message: string, context?: string): void;
  info(message: string, context?: string): void;
  verbose(message: string, context?: string): void;
  debug(message: string, context?: string): void;
  chalk(colors: readonly Color[], txt: string | object): string;
  setOptions(options: LoggerOptions): void;
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
