import { LogLevel } from '@armit/logger';
import type {
  LogAdapter,
  LogAdapterConfig,
  FormatStrategy,
} from '@armit/logger';
import { StdoutFormatStrategy } from './stdout-format-strategy.js';

export class StdoutAdapter<MessageType> implements LogAdapter<MessageType> {
  private formatStrategy: FormatStrategy<MessageType> =
    new StdoutFormatStrategy();
  private level = LogLevel.Info;

  constructor(options?: LogAdapterConfig<MessageType>) {
    this.config(options);
  }

  config(config?: LogAdapterConfig<MessageType>): LogAdapter<MessageType> {
    if (config?.formatStrategy) {
      this.formatStrategy = config?.formatStrategy;
    }
    if (config?.logLevel) {
      this.level = config?.logLevel || this.level;
    }
    return this as LogAdapter<MessageType>;
  }

  isLoggable(priority: LogLevel, context?: string): boolean {
    return this.level >= priority;
  }

  print(
    priority: LogLevel,
    context: string,
    message: MessageType,
    trace?
  ): void {
    this.formatStrategy.print(priority, context, message, trace);
  }
}
