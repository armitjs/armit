import { Logger } from '../core/logger.js';
import { ConsoleAdapter } from './console-adapter.js';

export const logger = new Logger({
  adapter: new ConsoleAdapter(),
});

export * from './console-adapter.js';
export * from './console-format-strategy.js';
