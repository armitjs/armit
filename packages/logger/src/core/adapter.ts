import type { LogLevel } from '../constant/log-level.js';
import type { FormatStrategy } from './format-strategy.js';

export type LogAdapterConfig = {
  noColor?: boolean;
  formatStrategy?: FormatStrategy;
  logLevel?: LogLevel;
};
/**
 * Provides a common interface to emits logs through. This is a required contract for Logger.
 *
 * @see ConsoleAdapter
 */
export interface LogAdapter {
  /**
   * Used to determine whether log should be printed out or not.
   *
   * @param priority is the log level e.g. DEBUG, WARNING
   * @param context is the given tag for the log message
   *
   * @return is used to determine if log should printed.
   *         If it is true, it will be printed, otherwise it'll be ignored.
   */
  isLoggable(priority: LogLevel, context?: string): boolean;

  /**
   * Used to setup configurations for adapter.
   *
   * @param config is the adapter normalized config options.
   */
  config(config?: LogAdapterConfig): LogAdapter;

  /**
   * Each log will use this pipeline
   *
   * @param priority is the log level e.g. DEBUG, WARNING
   * @param context is the given tag for the log message.
   * @param message is the given message for the log message.
   * @param trace trace full stack trace).
   */
  log(priority: LogLevel, context: string, message: string, trace?): void;
}
