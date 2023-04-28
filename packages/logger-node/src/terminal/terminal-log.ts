import C from 'picocolors';
import type {
  Color,
  Level,
  Locked,
  TerminalConstructorData,
  TerminalData,
} from './types.js';

/**
 * Terminal output formatting with ANSI colors
 * @param colors The colors for the console output
 * @param noColor Removes colors from the console output
 * @returns
 */
export function terminalColor(colors: readonly Color[], noColor?: boolean) {
  if (noColor || !colors.length) {
    // Pure text output.
    return (x: string) => x;
  }
  return (x: string) => {
    let out: string = x;
    for (let i = 0; i < colors.length; i++) {
      out = C[colors[i]](out);
    }
    return out;
  };
}

export type { Color, Level, Locked, TerminalConstructorData, TerminalData };

/**
 * A couple of preset levels. This is useful for a basic application.
 *
 * ### **Levels include:**
 *
 * -   error
 * -   trace
 */
export const basicLevels: Level<'error' | 'trace'>[] = [
  { color: ['red', 'underline'], name: 'error', isError: true },
  { color: ['gray', 'bold'], name: 'trace', isError: false },
];

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
export const advancedLevels: Level<
  'error' | 'trace' | 'debug' | 'fatal' | 'info' | 'warn'
>[] = [
  ...basicLevels,
  {
    color: ['gray', 'bold', 'italic', 'underline'],
    isError: false,
    name: 'debug',
  },
  { color: ['bgRed', 'white', 'bold', 'italic'], isError: true, name: 'fatal' },
  { color: ['blue', 'bold'], isError: false, name: 'info' },
  { color: ['yellow', 'dim', 'underline'], isError: true, name: 'warn' },
];

function ensureString(message): string {
  return typeof message === 'string'
    ? message
    : message instanceof Error
    ? message.toString()
    : JSON.stringify(message, null, 2);
}

function getColorApplier(
  colorType: 'COLOR' | 'DECORATION',
  levelColors: readonly Color[],
  noColor: boolean
) {
  const colors = levelColors.filter((colorName) => {
    const isDecoration =
      colorName === 'strikethrough' || colorName === 'underline';

    return colorType === 'DECORATION' ? isDecoration : !isDecoration;
  });

  return terminalColor(colors, noColor);
}

function addUnitOfTime(
  prefix: string,
  time: Date,
  lastTime: Date,
  colorFn: (s) => string,
  unitValueInMilliseconds: number,
  unitName: string
) {
  let remainder = time.getTime() - lastTime.getTime();
  const unitCount = Math.floor(remainder / unitValueInMilliseconds);

  remainder = remainder % unitValueInMilliseconds;
  return unitCount !== 0
    ? colorFn(prefix + unitCount + unitName) + ' '
    : unitValueInMilliseconds === 1
    ? colorFn(prefix + '0') + ' '
    : '';
}

function formatChangeInTime(
  time: Date,
  lastTime: Date,
  decorateColorFn: (s) => string,
  color: (s) => string,
  prefix: string
) {
  let formattedChangeInTime = ' ';
  // YEARS
  formattedChangeInTime += addUnitOfTime(
    prefix,
    time,
    lastTime,
    decorateColorFn,
    31536000000,
    'y'
  );
  // MONTHS
  formattedChangeInTime += addUnitOfTime(
    prefix,
    time,
    lastTime,
    decorateColorFn,
    2592000000,
    'm'
  );
  // DAYS
  formattedChangeInTime += addUnitOfTime(
    prefix,
    time,
    lastTime,
    decorateColorFn,
    86400000,
    'd'
  );
  // HOURS
  formattedChangeInTime += addUnitOfTime(
    prefix,
    time,
    lastTime,
    decorateColorFn,
    3600000,
    'h'
  );
  // MINUTES
  formattedChangeInTime += addUnitOfTime(
    prefix,
    time,
    lastTime,
    decorateColorFn,
    60000,
    'min'
  );
  // SECONDS
  formattedChangeInTime += addUnitOfTime(
    prefix,
    time,
    lastTime,
    decorateColorFn,
    1000,
    's'
  );
  // MILLISECONDS
  formattedChangeInTime += addUnitOfTime(
    prefix,
    time,
    lastTime,
    decorateColorFn,
    1,
    'ms'
  );
  return color(formattedChangeInTime);
}

function formatMonth(time: Date, monthPositionSwitch: boolean) {
  monthPositionSwitch = !monthPositionSwitch;
  return monthPositionSwitch ? '' : `${time.getMonth() + 1}m/`;
}

/**
 * Represents the console.
 */
export class TerminalLog<L extends string> {
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
  readonly log: Record<L, (message: string, context?: string, trace?) => void>;

  /**
   * The time when this terminal instance was created.
   */
  readonly startTime: Date;

  /**
   * The time when the last message was logged to the terminal.
   */
  timeInLastLog: Date;

  // eslint-disable-next-line sonarjs/cognitive-complexity
  private logMsg(
    level: Level<string>,
    message: string,
    context?: string,
    trace?
  ) {
    const {
      capitalizeLevelName,
      showArrow,
      showDate,
      showLevelName,
      showMonthBeforeDay,
      showRelativeTimestamp,
      showTimestamp,
      showTimestampRelativeToLastLog,
      use24HourClock,
      contextColor,
      noColor,
    } = this.data;

    const time = new Date();
    const color = getColorApplier('COLOR', level.color, noColor);
    const decorate = getColorApplier('DECORATION', level.color, noColor);
    const monthPositionSwitch = showMonthBeforeDay;
    let output = '';

    const levelContext: string[] = [];
    // Should add context if we have.
    if (context) {
      const ctxColor = getColorApplier('COLOR', contextColor, noColor);
      levelContext.push(' ' + ctxColor(context.toUpperCase()) + ' ');
    }

    // Should look like: [ ERROR ] or [ error ]
    if (showLevelName) {
      levelContext.push(
        color(
          ' ' +
            decorate(
              capitalizeLevelName ? level.name.toUpperCase() : level.name
            ) +
            ' '
        )
      );
    }

    if (levelContext.length) {
      output += '[' + levelContext.join(':') + ']\t';
    }

    // Should look like: [ 12d/5m/2011y | 13:43:10.23 ] or [ 5m/12d/2011y | 1:43:10.23 PM ]
    if (showDate || showTimestamp) {
      output += '[';
      if (showDate) {
        output += color(
          ' ' +
            decorate(
              `${
                formatMonth(time, monthPositionSwitch) + time.getDate()
              }d/${formatMonth(
                time,
                monthPositionSwitch
              )}${time.getFullYear()}y`
            ) +
            ' '
        );
      }

      if (showDate && showTimestamp) {
        output += '|';
      }

      if (showTimestamp) {
        const hours = time.getHours();

        output += color(
          ' ' +
            decorate(
              `${
                use24HourClock || !(hours >= 13 || hours === 0)
                  ? hours
                  : Math.abs(hours - 12)
              }:${time.getMinutes()}:${time.getSeconds()}.${time.getMilliseconds()}`
            ) +
            ' ' +
            (use24HourClock ? '' : decorate(hours >= 13 ? 'PM' : 'AM') + ' ')
        );
      }

      output += ']';
    }

    if (
      (showDate || showTimestamp) &&
      (showRelativeTimestamp || showTimestampRelativeToLastLog)
    ) {
      output += '\t';
    }

    // Should look like: [ 5y 1m 15h 51min 7s 300ms | +31min +5s +903ms ]
    if (showRelativeTimestamp || showTimestampRelativeToLastLog) {
      output += '[';
      if (showRelativeTimestamp) {
        output += formatChangeInTime(time, this.startTime, decorate, color, '');
      }
      if (showRelativeTimestamp && showTimestampRelativeToLastLog) {
        output += '|';
      }
      if (showTimestampRelativeToLastLog) {
        output += formatChangeInTime(
          time,
          this.timeInLastLog,
          decorate,
          color,
          '+'
        );
      }
      output += ']';
    }

    // Should look like: >>
    if (showArrow) {
      output += ` ${terminalColor(['bold'])('>>')}\t`;
    }

    // Should add trace if we have error?
    output +=
      `\t${message}` +
      (level.isError && trace
        ? `\n${terminalColor(['red'])(ensureString(trace))}\n`
        : '\n');

    (level.isError ? process.stderr : process.stdout).write(output);
    this.timeInLastLog = time;
  }

  /**
   * Represents the console.
   *
   * @param data Any customization options for the terminal.
   */
  constructor(data: TerminalConstructorData<L>) {
    const defaultData: Omit<TerminalData, 'levels'> = {
      capitalizeLevelName: true,
      showArrow: false,
      showDate: false,
      showLevelName: false,
      showMonthBeforeDay: false,
      showRelativeTimestamp: false,
      showTimestamp: true,
      showTimestampRelativeToLastLog: true,
      use24HourClock: false,
      noColor: false,
      contextColor: ['bold', 'magenta'],
    };

    let logger: object = {};
    let registeredLevels: string[] = [];

    this.startTime = new Date();
    this.timeInLastLog = this.startTime;
    this.data = Object.assign({}, defaultData, data);

    for (const level of data.levels) {
      if (registeredLevels.some((value) => value === level.name)) {
        throw new Error(`Duplicate level name "${level.name}".`);
      }
      registeredLevels = [...registeredLevels, level.name];

      logger = {
        ...logger,

        [level.name]: (
          message: string,
          context?: string,
          trace?: string | undefined
        ) => {
          this.logMsg(level, message, context, trace);
        },
      };
    }

    this.log = logger as Record<
      L,
      (message: string, context?: string, trace?: string) => void
    >;
  }
}
