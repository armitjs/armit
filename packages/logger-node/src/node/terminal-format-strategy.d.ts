import type { FormatStrategy } from '@armit/logger';
import { LogLevel } from '@armit/logger';
import { type TerminalData } from '../terminal/terminal-log.js';
import type { CustomizedStdWriteStream } from '../types.js';
export declare class TerminalFormatStrategy<MessageType> implements FormatStrategy<MessageType> {
    private terminal;
    constructor(options?: Partial<Pick<TerminalData, 'noColor' | 'showLevelName' | 'use24HourClock' | 'showTimestamp' | 'showRelativeTimestamp' | 'showTimestampRelativeToLastLog' | 'showContext'>> & CustomizedStdWriteStream);
    print(priority: LogLevel, context: string, message: MessageType, trace?: any): void;
    private ensureString;
}
