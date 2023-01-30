import { LogLevel } from '../constant/log-level.js';
import type { LogAdapter, LogAdapterConfig } from '../core/adapter.js';
import type { FormatStrategy } from '../core/format-strategy.js';
import { StdoutFormatStrategy } from './stdout-format-strategy.js';

export class StdoutAdapter implements LogAdapter {
  private formatStrategy: FormatStrategy = new StdoutFormatStrategy();
  private level = LogLevel.Info;

  constructor(options?: LogAdapterConfig) {
    this.config(options);
  }

  config(config?: LogAdapterConfig): LogAdapter {
    if (config?.formatStrategy) {
      this.formatStrategy = config?.formatStrategy;
    }
    if (config?.logLevel) {
      this.level = config?.logLevel || this.level;
    }
    return this;
  }

  isLoggable(priority: LogLevel, context?: string): boolean {
    return this.level >= priority;
  }

  log(priority: LogLevel, context: string, message: string, trace?): void {
    this.formatStrategy.print(priority, context, message, trace);
  }
}
