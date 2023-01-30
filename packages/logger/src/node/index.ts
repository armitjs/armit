import { Logger } from '../core/logger.js';
import { StdoutAdapter } from './stdout-adapter.js';

export const logger = new Logger({
  adapter: new StdoutAdapter(),
});

export * from './stdout-adapter.js';
export * from './stdout-format-strategy.js';
export * from './terminal-format-strategy.js';
