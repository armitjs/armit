import type { LogAdapter, LogAdapterConfig } from '../core/adapter.js';

export interface LogPrinter {
  error(message, context?: string, trace?): void;
  warn(message, context?: string): void;
  info(message, context?: string): void;
  verbose(message, context?: string): void;
  debug(message, context?: string): void;
  addAdapter(adapter: LogAdapter, config?: LogAdapterConfig): LogPrinter;
  clearLogAdapters(): LogPrinter;
}
