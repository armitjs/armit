import type { FormatStrategy } from '@armit/logger';
import { LogLevel } from '@armit/logger';
import type { CustomizedStdWriteStream } from '../types.js';
export declare class StdoutFormatStrategy<MessageType> implements FormatStrategy<MessageType> {
    private options?;
    private readonly localeStringOptions;
    private timestamp;
    constructor(options?: CustomizedStdWriteStream | undefined);
    print(priority: LogLevel, context: string, message: MessageType, trace: any): void;
    private logMessage;
    private logContext;
    private logTimestamp;
    private ensureString;
}
