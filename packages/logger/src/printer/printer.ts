import type { LogAdapter, LogAdapterConfig } from '../core/adapter.js';

export interface LogPrinter<MessageType> {
  error(message: MessageType, context?: string, trace?): void;
  warn(message: MessageType, context?: string): void;
  info(message: MessageType, context?: string): void;
  verbose(message: MessageType, context?: string): void;
  debug(message: MessageType, context?: string): void;
  addAdapter(
    adapter: LogAdapter<MessageType>,
    config?: LogAdapterConfig<MessageType>
  ): LogPrinter<MessageType>;
  clearLogAdapters(): LogPrinter<MessageType>;
}
