import type { Color, Level, Locked, TerminalConstructorData, TerminalData } from './types.js';
/**
 * Terminal output formatting with ANSI colors
 * @param colors The colors for the console output
 * @param noColor Removes colors from the console output
 * @returns
 */
export declare function terminalColor(colors: readonly Color[], noColor?: boolean): (x: string) => string;
export type { Color, Level, Locked, TerminalConstructorData, TerminalData };
/**
 * A couple of preset levels. This is useful for a basic application.
 *
 * ### **Levels include:**
 *
 * -   error
 * -   trace
 */
export declare const basicLevels: Level<'error' | 'trace'>[];
/**
 * A list of preset levels that you can use to log messages of various levels of importance.
 *
 * ### **Levels include:**
 *
 * -   error
 * -   trace
 * -   debug
 * -   fatal
 * -   info
 * -   warn
 */
export declare const advancedLevels: Level<'error' | 'trace' | 'debug' | 'fatal' | 'info' | 'warn'>[];
/**
 * Represents the console.
 */
export declare class TerminalLog<L extends string> {
    private stdout;
    private stderr;
    /**
     * Customization options that were inputted when this terminal instance was created.
     */
    readonly data: TerminalData;
    /**
     * Represents the logger. Any methods of `log` logs a message to a specific level.
     *
     * Note `trace?` is availble only for `Level` with `isError=true`
     *
     * @example
     *
     * ```
     * log.error("faz");
     * log.error("faz", 'context')
     * log.error("faz", 'context', 'trace');
     *
     * ```
     *
     * Logs "faz" to the `error` level if such a level even exists.
     */
    readonly log: Record<L, (message: string, context?: string, trace?: any) => void>;
    /**
     * The time when this terminal instance was created.
     */
    readonly startTime: Date;
    /**
     * The time when the last message was logged to the terminal.
     */
    timeInLastLog: Date;
    private logMsg;
    formatMsg(level: Level<string>, message: string, context?: string, trace?: any): string;
    /**
     * Represents the console.
     *
     * @param data Any customization options for the terminal.
     */
    constructor(data: TerminalConstructorData<string>);
}
