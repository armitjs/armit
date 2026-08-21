import type { LogAdapter, LogAdapterConfig } from '../core/adapter.js';
import type { LogPrinter } from './printer.js';
export declare class LoggerPrinter<MessageType> implements LogPrinter<MessageType> {
    private logAdapters;
    error(message: MessageType, context?: string, trace?: any): void;
    warn(message: MessageType, context?: string): void;
    info(message: MessageType, context?: string): void;
    verbose(message: MessageType, context?: string): void;
    debug(message: MessageType, context?: string): void;
    addAdapter(adapter: LogAdapter<MessageType>, config?: LogAdapterConfig<MessageType> | undefined): this;
    reConfig(config?: LogAdapterConfig<MessageType> | undefined): this;
    clearLogAdapters(): this;
    private print;
}
