import type picocolors from 'picocolors';

/**
 * Represents an ANSI color.
 */
export type Color = Exclude<
  keyof typeof picocolors,
  'createColors' | 'isColorSupported'
>;

/**
 * Make every property and sub-property read-only.
 */
export type Locked<T> = {
  readonly [K in keyof T]: T[K] extends object ? Locked<T[K]> : T[K];
};

/**
 * Same as `TerminalConstructorData<string>`, but all properties are required and read-only. This interface is used for the `data` property of the `Terminal` class.
 */
export type TerminalData = Locked<Required<TerminalConstructorData<string>>>;

/**
 * Represents a category to which you can log messages. Levels are usually used to represent various levels of importance.
 */
export interface Level<L extends string> {
  /**
   * Any ANSI colors/formats which you want any messages logged to this level to have their timestamps highlighted in.
   */
  color: Color[];

  /**
   * If true, each message logged to this level will be sent to `process.stderr` (standard error stream) instead of `process.stdout` (standard out stream).
   */
  isError: boolean;

  /**
   * The name of this level.
   */
  name: L;
}

/**
 * Customization options for how logs are to be displayed in the terminal.
 */
export interface TerminalConstructorData<L extends string> {
  /**
   * Whether or not to capitalize the name of a log's corresponding level when it's attached to the log. Keep in mind that you can only see the name of a log's corresponding level when `showLevelName` is also true.
   *
   * ### **No capitalization:**
   *
   * `[ info ] Something very interesting happened.`
   *
   * ### **Capitalization:**
   *
   * `[ INFO ] Something very interesting happened.`
   */
  capitalizeLevelName?: boolean;

  /**
   * A list of categories which you can log to.
   */
  levels: Level<L>[];

  /**
   * The colors Will be painted on `context` if have.
   * @default ['bold', 'black']
   */
  contextColor?: Color[];
  /**
   * Whether or not to show a cool arrow before a log's message.
   *
   * `>> baz`
   */
  showArrow?: boolean;

  /**
   * If true, each message logged to the terminal will have a date corresponding to when the message was logged attached to it.
   *
   * `[ 12d/5m/2011y ] foo`
   */
  showDate?: boolean;

  /**
   * If true, each message logged to the terminal will have the name of the level of the message attached to it.
   *
   * `[ FATAL ] WHAT WILL I DO?!`
   */
  showLevelName?: boolean;

  /**
   * If true, the date displayed on each message logged to the console will have the month before the day. Keep in mind that the date of when a log was logged to the console is only displayed when `showDate` is also true.
   *
   * ### **Day before month:**
   *
   * `[ 20d/12m/1999y ] loy`
   *
   * ### **Month before day:**
   *
   * `[ 12m/20d/1999y ] loy`
   */
  showMonthBeforeDay?: boolean;

  /**
   * If true, each message logged to the terminal will have a timestamp relative to the creation of this particular instance of the `Terminal` class.
   *
   * `[ 5y 1m 15h 51min 7s 300ms ] A long time has passed.`
   */
  showRelativeTimestamp?: boolean;

  /**
   * If true, each message logged to the terminal will have a timestamp corresponding to the exact time the message was logged.
   *
   * `[ 13:43:10.23 ] bar`
   */
  showTimestamp?: boolean;

  /**
   * If true, each message logged to the terminal will have a timestamp relative to when the previous message was logged to the terminal.
   *
   * `[ +31min +5s +903ms ] It took forever!`
   */
  showTimestampRelativeToLastLog?: boolean;

  /**
   * If true, the timestamp on each message logged to the console will be displayed using the 24 hour clock instead of the 12 hour clock. Keep in mind that the timestamp of when a log was logged to the console is only displayed when `showTimestamp` is also true.
   *
   * ### **24 hour clock:**
   *
   * `[ 13:27:55.33 ] pow`
   *
   * ### **12 hour clock:**
   *
   * `[ 1:27:55.33 PM ] pow`
   */
  use24HourClock?: boolean;

  /**
   * Removes colors from the console output
   * @default false
   */
  noColor?: boolean;
}
