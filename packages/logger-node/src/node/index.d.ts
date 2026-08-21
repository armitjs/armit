import { Logger } from '@armit/logger';
import { StdoutAdapter } from './stdout-adapter.js';
export declare const logger: Logger<unknown, {
    adapter: StdoutAdapter<unknown>;
}>;
export * from './stdout-adapter.js';
export * from './stdout-format-strategy.js';
export * from './terminal-format-strategy.js';
