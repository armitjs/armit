import type { LogPrinter } from '../printer/printer.js';
import type { LogAdapter, LogAdapterConfig } from './adapter.js';
export type LoggerOptions<MessageType, OptionExtendType extends Record<string, unknown> = {}> = LogAdapterConfig<MessageType> & {
    adapter?: LogAdapter<MessageType>;
    context?: string;
} & OptionExtendType;
/**
 * The default logger, which logs to the console (stdout) with optional timestamps. Since this logger is part of the
 * default Vendure configuration, you do not need to specify it explicitly in your server config. You would only need
 * to specify it if you wish to change the log level (which defaults to `LogLevel.Info`) or remove the timestamp.
 *
 * @example
 * ```ts
 * import { Logger, LogLevel } from '\@armit/logger';
 *
 * export const logger =  new Logger({ logLevel: LogLevel.Debug }),
 * ```
 */
export declare class Logger<MessageType, OptionExtendType extends Record<string, unknown> = {}> {
    private printer;
    private context;
    constructor(options?: LoggerOptions<MessageType, OptionExtendType>);
    usePrinter(printer: LogPrinter<MessageType>): this;
    reConfig(options?: Partial<LoggerOptions<MessageType, OptionExtendType>>): void;
    addLogAdapter(adapter: LogAdapter<MessageType>, config?: LogAdapterConfig<MessageType> | undefined): this;
    clearLogAdapters(): this;
    error(message: MessageType, context?: string, trace?: any): void;
    warn(message: MessageType, context?: string): void;
    info(message: MessageType, context?: string): void;
    verbose(message: MessageType, context?: string): void;
    debug(message: MessageType, context?: string): void;
    private logContext;
}
