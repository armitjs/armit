import { LogLevel } from '@armit/logger';
import { StdoutFormatStrategy } from './stdout-format-strategy.js';
export class StdoutAdapter {
  formatStrategy = new StdoutFormatStrategy();
  level = LogLevel.Info;
  constructor(options) {
    this.config(options);
  }
  config(config) {
    if (config?.formatStrategy) {
      this.formatStrategy = config?.formatStrategy;
    }
    // handle case `Error`===`0`
    if (typeof config?.logLevel !== 'undefined') {
      this.level = config?.logLevel;
    }
    return this;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isLoggable(priority, context) {
    return this.level >= priority;
  }
  print(priority, context, message, trace) {
    this.formatStrategy.print(priority, context, message, trace);
  }
}
