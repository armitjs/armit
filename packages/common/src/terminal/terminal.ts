import C from 'picocolors';
import type {
  Color,
  Level,
  Locked,
  TerminalConstructorData,
  TerminalData,
} from './types.js';

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
 * -   debug
 * -   error
 * -   fatal
 * -   info
 * -   trace
 * -   warn
 */
export const advancedLevels: Level<
  'debug' | 'error' | 'fatal' | 'info' | 'trace' | 'warn'
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

/**
 * Represents the console.
 */
export class Terminal<L extends string> {
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
  readonly log: Record<
    L,
    (message: string, context?: string, trace?: string) => void
  >;

  /**
   * The time when this terminal instance was created.
   */
  readonly startTime: Date;

  /**
   * The time when the last message was logged to the terminal.
   */
  timeInLastLog: Date;

  // eslint-disable-next-line @typescript-eslint/naming-convention, sonarjs/cognitive-complexity
  private _log(
    level: Level<string>,
    message: string,
    context?: string,
    trace?: string
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
    } = this.data;

    const time = new Date();
    const color = getColorApplier('COLOR');
    const decorate = getColorApplier('DECORATION');
    let monthPositionSwitch = showMonthBeforeDay;
    let output = '';

    function formatChangeInTime(from: Date, prefix: string) {
      let formattedChangeInTime = ' ';
      let remainder = time.getTime() - from.getTime();

      function addUnitOfTime(
        unitValueInMilliseconds: number,
        unitName: string
      ) {
        const unitCount = Math.floor(remainder / unitValueInMilliseconds);

        remainder = remainder % unitValueInMilliseconds;
        formattedChangeInTime +=
          unitCount !== 0
            ? decorate(prefix + unitCount + unitName) + ' '
            : unitValueInMilliseconds === 1
            ? decorate(prefix + '0') + ' '
            : '';
      }

      addUnitOfTime(31536000000, 'y'); // YEARS
      addUnitOfTime(2592000000, 'm'); // MONTHS
      addUnitOfTime(86400000, 'd'); // DAYS
      addUnitOfTime(3600000, 'h'); // HOURS
      addUnitOfTime(60000, 'min'); // MINUTES
      addUnitOfTime(1000, 's'); // SECONDS
      addUnitOfTime(1, 'ms'); // MILLISECONDS

      return color(formattedChangeInTime);
    }

    function formatMonth() {
      monthPositionSwitch = !monthPositionSwitch;
      return monthPositionSwitch ? '' : `${time.getMonth() + 1}m/`;
    }

    function getColorApplier(colorType: 'COLOR' | 'DECORATION') {
      const colors = level.color.filter((colorName) => {
        const isDecoration =
          colorName === 'strikethrough' || colorName === 'underline';

        return colorType === 'DECORATION' ? isDecoration : !isDecoration;
      });

      if (!colors[0]) {
        return (x: string) => x;
      }
      let colorApplier = C[colors[0]];
      for (let i = 1; i < colors.length; i++) {
        colorApplier = colorApplier[colors[i]];
      }

      return colorApplier;
    }

    // Should look like: [ ERROR ] or [ error ]
    if (showLevelName) {
      output += `[${color(
        ' ' +
          decorate(
            capitalizeLevelName ? level.name.toUpperCase() : level.name
          ) +
          ' '
      )}]\t`;
    }
    // Should look like: [ 12d/5m/2011y | 13:43:10.23 ] or [ 5m/12d/2011y | 1:43:10.23 PM ]
    if (showDate || showTimestamp) {
      output += '[';
      if (showDate) {
        output += color(
          ' ' +
            decorate(
              `${
                formatMonth() + time.getDate()
              }d/${formatMonth()}${time.getFullYear()}y`
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
        output += formatChangeInTime(this.startTime, '');
      }
      if (showRelativeTimestamp && showTimestampRelativeToLastLog) {
        output += '|';
      }
      if (showTimestampRelativeToLastLog) {
        output += formatChangeInTime(this.timeInLastLog, '+');
      }
      output += ']';
    }

    // Should look like: >>
    if (showArrow) {
      output += ` ${C.bold('>>')}\t`;
    }

    // Should add context if we have.
    if (context) {
      output += ` ${context}\t`;
    }

    // Should add trace if we have error?
    output += `\t${message}` + (level.isError && trace ? `\n${trace}\n` : '\n');

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
          this._log(level, message, context, trace);
        },
      };
    }

    this.log = logger as Record<
      L,
      (message: string, context?: string, trace?: string) => void
    >;
  }
}
