import type { LogAdapter, LogAdapterConfig } from '@armit/logger';
import { LogLevel } from '@armit/logger';
export declare class StdoutAdapter<MessageType> implements LogAdapter<MessageType> {
    private formatStrategy;
    private level;
    constructor(options?: LogAdapterConfig<MessageType>);
    config(config?: LogAdapterConfig<MessageType>): LogAdapter<MessageType>;
    isLoggable(priority: LogLevel, context?: string): boolean;
    print(priority: LogLevel, context: string, message: MessageType, trace?: any): void;
}
